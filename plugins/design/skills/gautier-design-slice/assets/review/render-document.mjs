import { marked, mermaid, DOMPurify } from './vendor/renderers.js';
import { wireDiagram } from './targets.mjs';

function configureTheme(mode) {
  const dark = mode === 'dark';
  mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'base', htmlLabels: false,
    themeVariables: { darkMode: dark, background: dark ? '#142035' : '#f9fbff',
      primaryColor: dark ? '#253b60' : '#eaf0ff', primaryTextColor: dark ? '#e5ecf7' : '#17283d',
      primaryBorderColor: dark ? '#799bd7' : '#8ba4d4', lineColor: dark ? '#a5bbdf' : '#627a9e',
      secondaryColor: dark ? '#1c304d' : '#f5f8ff', tertiaryColor: dark ? '#1c3a37' : '#edf6f3',
      actorBkg: dark ? '#253b60' : '#eaf0ff', actorTextColor: dark ? '#e5ecf7' : '#17283d',
      signalColor: dark ? '#dce6f7' : '#17283d', signalTextColor: dark ? '#e5ecf7' : '#17283d',
      fontFamily: 'system-ui, sans-serif' },
    flowchart: { htmlLabels: false, useMaxWidth: true }, sequence: { useMaxWidth: true } });
}

function sourceTokens(source) {
  source = source.replace(/\r\n?/g, '\n');
  const front = /^(?:---\r?\n)[\s\S]*?\r?\n---(?:\r?\n|$)/.exec(source)?.[0] ?? '';
  const tokens = marked.lexer(source.slice(front.length));
  let offset = front.length;
  return tokens.map(token => {
    const start = source.indexOf(token.raw, offset);
    offset = Math.max(offset, start) + token.raw.length;
    if (start < 0) throw new Error('This Markdown block could not be mapped to source lines.');
    const startLine = source.slice(0, start).split('\n').length;
    const endLine = startLine + token.raw.replace(/\r?\n$/, '').split('\n').length - 1;
    return { token, startLine, endLine };
  });
}
function cleanHTML(html) {
  return DOMPurify.sanitize(html, { FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input', 'button', 'textarea', 'object', 'embed'],
    FORBID_ATTR: ['style'], ALLOW_DATA_ATTR: false });
}
export async function renderDocument(container, source, round, onComment, onExpand, theme = 'light') {
  configureTheme(theme);
  container.replaceChildren();
  let diagramIndex = 0;
  for (const { token, startLine, endLine } of sourceTokens(source)) {
    if (token.type === 'space') continue;
    const block = document.createElement('section');
    block.className = 'source-block'; block.dataset.startLine = startLine; block.dataset.endLine = endLine;
    const target = { startLine, endLine, kind: 'paragraph' };
    if (token.type === 'code' && token.lang?.split(/\s/)[0] === 'mermaid') {
      const figure = document.createElement('div'); figure.className = 'diagram';
      const header = document.createElement('div'); header.className = 'diagram-header';
      const label = document.createElement('span'); label.textContent = 'Click a node or edge to comment';
      const expand = document.createElement('button'); expand.textContent = 'Expand diagram';
      header.append(label, expand);
      const canvas = document.createElement('div'); canvas.className = 'diagram-canvas';
      const details = document.createElement('details'), summary = document.createElement('summary'); summary.textContent = 'Mermaid source';
      const pre = document.createElement('pre'); pre.textContent = token.text; details.append(summary, pre);
      figure.append(header, canvas, details); block.append(figure); container.append(block);
      try {
        const { svg } = await mermaid.render(`review-r${round}-d${++diagramIndex}`, token.text);
        canvas.innerHTML = DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
        canvas.querySelector('svg').dataset.theme = theme;
        wireDiagram(canvas, target, onComment);
        expand.addEventListener('click', () => onExpand(canvas, target));
      } catch (error) {
        canvas.className += ' diagram-error'; canvas.textContent = `Diagram could not render: ${error.message}`;
        expand.disabled = true;
      }
      continue;
    }
    block.innerHTML = cleanHTML(marked.parser([token]));
    block.querySelectorAll('img').forEach(image => {
      const src = image.getAttribute('src');
      if (src && !/^(https?:|data:)/i.test(src)) image.src = `/document-assets/${src}`;
    });
    block.querySelectorAll('a').forEach(link => {
      link.rel = 'noopener noreferrer';
      if (link.getAttribute('href')?.startsWith('#')) {
        link.addEventListener('click', event => {
          event.preventDefault();
          const slug = decodeURIComponent(link.hash.slice(1));
          const heading = [...container.querySelectorAll('h1,h2,h3')].find(item => item.id === slug ||
            item.textContent.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') === slug);
          heading?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        });
      } else link.target = '_blank';
    });
    const heading = block.querySelector('h1,h2,h3');
    if (heading) heading.id = `section-${startLine}`;
    const add = document.createElement('button'); add.className = 'paragraph-comment'; add.textContent = '+';
    add.setAttribute('aria-label', `Comment on paragraph at line ${startLine}`);
    add.addEventListener('click', () => onComment({ ...target, quote: block.innerText.replace(/\+$/, '').trim() }));
    block.append(add); container.append(block);
  }
}
