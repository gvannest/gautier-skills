/** Snapshot-only SVG targets. Element ordinals never survive a document publication. */
export function wireDiagram(container, sourceTarget, onComment) {
  const svg = container.querySelector('svg');
  if (!svg) return;
  svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'Mermaid diagram with commentable elements');
  const targets = [], assigned = new Set();
  function add(element, kind, label, semantic = '') {
    if (!element || assigned.has(element)) return;
    assigned.add(element);
    const target = { ...sourceTarget, kind, quote: label, label,
      elementId: semantic || element.id || `${kind}-${targets.length + 1}` };
    const index = targets.push(target) - 1;
    element.dataset.reviewTarget = index;
    element.setAttribute('tabindex', '0'); element.setAttribute('role', 'button');
    element.setAttribute('aria-label', `Comment on ${kind}: ${label || target.elementId}`);
    return index;
  }
  const sequence = svg.getAttribute('aria-roledescription') === 'sequence';
  if (sequence) {
    svg.querySelectorAll('rect.actor').forEach(element => {
      const name = element.getAttribute('name') ?? '';
      const label = [...svg.querySelectorAll('text.actor')].find(text => text.closest('g') === element.closest('g'))?.textContent || name;
      add(element, 'node', label, `actor:${name}`);
    });
    const lines = [...svg.querySelectorAll('.messageLine0,.messageLine1')];
    const labels = [...svg.querySelectorAll('text.messageText')];
    lines.forEach((element, i) => {
      const label = labels.length === lines.length ? labels[i].textContent.trim() : `Message ${i + 1}`;
      const index = add(element, 'edge', label, `message:${i + 1}`);
      if (labels.length === lines.length) labels[i].dataset.reviewTarget = index;
    });
    svg.querySelectorAll('rect.note').forEach((element, i) => {
      add(element, 'node', element.parentElement.querySelector('.noteText')?.textContent || `Note ${i + 1}`, `note:${i + 1}`);
    });
  } else {
    svg.querySelectorAll('g.node,g.cluster,g.statediagram-cluster').forEach(element => {
      add(element, 'node', (element.querySelector('.nodeLabel,.label,text')?.textContent || element.textContent).trim());
    });
    svg.querySelectorAll('path.flowchart-link,path.transition,path.relation,path.relationshipLine').forEach((element, i) => {
      const id = element.id, suffix = id.replace(new RegExp(`^${svg.id}-`), '');
      const edgeLabel = [...svg.querySelectorAll('.edgeLabel')].find(label =>
        [...label.querySelectorAll('[data-id]')].some(item => [id, suffix].includes(item.getAttribute('data-id'))));
      const label = edgeLabel?.textContent.trim() || id || `Edge ${i + 1}`;
      const index = add(element, 'edge', label);
      if (edgeLabel) edgeLabel.dataset.reviewTarget = index;
    });
  }
  // Wider transparent edge strokes allow comfortable pointer selection without changing the visible drawing.
  for (const element of assigned) {
    if (targets[Number(element.dataset.reviewTarget)].kind !== 'edge') continue;
    const hit = element.cloneNode(false);
    hit.removeAttribute('id'); hit.removeAttribute('marker-end'); hit.removeAttribute('marker-start');
    hit.removeAttribute('tabindex'); hit.removeAttribute('role'); hit.removeAttribute('class'); hit.setAttribute('aria-hidden', 'true');
    hit.style.cssText = 'stroke:transparent;stroke-width:16px;fill:none;pointer-events:stroke';
    element.after(hit);
  }
  function comment(event) {
    const element = event.target.closest('[data-review-target]');
    if (!element || !container.contains(element)) return;
    event.preventDefault(); event.stopPropagation();
    const target = targets[Number(element.dataset.reviewTarget)];
    if (target) onComment({ ...target });
  }
  container.addEventListener('click', comment);
  container.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') comment(event); });
  container.dataset.targetCount = targets.length;
}
