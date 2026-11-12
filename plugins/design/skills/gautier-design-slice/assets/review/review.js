import { renderDocument } from './render-document.mjs';

const $ = id => document.getElementById(id);
const token = new URLSearchParams(location.hash.slice(1)).get('token');
let state, busy = false, rendering = false, connected = true, renderedRound = 0, target, editingId, selectionTarget, composerRevision;
let expandedCanvas, canvasHome, zoom = 1, renderedTheme;
const mediaTheme = window.matchMedia('(prefers-color-scheme: dark)');
const browserTheme = () => mediaTheme.matches ? 'dark' : 'light';
document.documentElement.dataset.theme = browserTheme();
const draftKey = () => `review-composer:${state.id}`;
const caption = item => item.label || item.quote || `${item.kind} at line ${item.startLine}`;
const working = () => state?.phase === 'reviewing' && !busy && connected;

async function api(path, data) {
  const response = await fetch(`/api/${path}`, { method: data === undefined ? 'GET' : 'POST',
    headers: { 'X-Review-Token': token ?? '', 'Content-Type': 'application/json' },
    ...(data === undefined ? {} : { body: JSON.stringify(data) }), signal: AbortSignal.timeout(10000) });
  const value = await response.json();
  if (!response.ok) throw new Error(value.error || 'Request failed. Your comments are still saved.');
  return value;
}
function banner(message = '', error = false) {
  $('banner').hidden = !message; $('banner').textContent = message; $('banner').classList.toggle('error', error);
  $('banner').dataset.kind = error ? 'error' : 'info';
}
function showStatus() {
  if (!state) return;
  const comments = state.draft.comments;
  $('phase').textContent = !connected ? 'Connection lost' : state.phase === 'submitted' ? 'Agent is updating…' :
    state.phase === 'ended' ? 'Review ended' : state.stale ? 'Document changed' : 'Ready to review';
  $('send').disabled = !working() || state.stale || !comments.length || rendering;
  $('end').disabled = busy || !connected || state.phase !== 'reviewing';
  $('reload').disabled = busy || !connected || state.phase !== 'reviewing';
  $('count').textContent = comments.length; $('comment-total').textContent = comments.length;
  $('revision').textContent = `Revision ${state.round} · ${state.document.hash.slice(0, 8)}`;
  if (state.phase === 'ended') return;
  if (state.phase === 'submitted') banner('Comments sent. Your agent is updating the document; the next revision will appear here.');
  else if (state.stale) banner(state.sourceError || 'The source changed while you were reviewing. Your comments are kept. Reload before sending.');
  else if (connected && $('banner').dataset.kind === 'info') banner();
}
function renderComments() {
  $('comments').replaceChildren(); $('empty').hidden = state.draft.comments.length > 0;
  for (const [i, comment] of state.draft.comments.entries()) {
    const card = document.createElement('div'); card.className = 'comment-card';
    const kind = document.createElement('div'); kind.className = 'comment-kind';
    kind.textContent = `${i + 1}. ${comment.target.kind === 'text' ? 'Selected text' : comment.target.kind.replace(/^./, c => c.toUpperCase())}`;
    const quote = document.createElement('div'); quote.className = 'comment-quote'; quote.textContent = caption(comment.target);
    const text = document.createElement('div'); text.className = 'comment-body'; text.textContent = comment.text;
    const actions = document.createElement('div'); actions.className = 'comment-actions';
    const edit = document.createElement('button'); edit.textContent = 'Edit'; edit.disabled = !working();
    edit.addEventListener('click', () => openComment(comment.target, comment));
    const remove = document.createElement('button'); remove.textContent = 'Remove'; remove.disabled = !working();
    remove.addEventListener('click', () => void mutate(async () => {
      await applyState(await api('draft', { ...version(), revision: state.draft.revision,
        comments: state.draft.comments.filter(item => item.id !== comment.id) }));
    }));
    actions.append(edit, remove); card.append(kind, quote, text, actions); $('comments').append(card);
  }
}
const version = () => ({ hash: state.document.hash, round: state.round });
async function applyState(next) {
  if (state && (next.round < state.round || (next.round === state.round &&
    (next.sequence < state.sequence || next.draft.revision < state.draft.revision)))) return;
  const newRound = next.round !== renderedRound;
  const commentsChanged = newRound || !state || JSON.stringify(next.draft) !== JSON.stringify(state.draft) || next.phase !== state.phase;
  state = next;
  if (state.phase === 'ended') { finishView(); return; }
  if (newRound) {
    rendering = true; showStatus();
    if ($('diagram-dialog').open) $('diagram-dialog').close();
    if ($('composer').open) $('composer').close();
    $('selection-action').hidden = true;
    await paintDocument();
    renderedRound = state.round;
    $('filename').textContent = state.document.path.split(/[\\/]/).pop();
    $('filepath').textContent = state.document.path; document.title = `${$('filename').textContent} · Review`;
    $('outline').replaceChildren();
    const label = document.createElement('p'); label.className = 'outline-title'; label.textContent = 'In this document'; $('outline').append(label);
    $('document').querySelectorAll('h1,h2,h3').forEach(heading => {
      const link = document.createElement('a'); link.href = `#${heading.id}`; link.textContent = heading.textContent;
      if (heading.tagName === 'H3') link.className = 'sub';
      link.addEventListener('click', event => { event.preventDefault(); heading.scrollIntoView({ block: 'start', behavior: 'smooth' }); });
      $('outline').append(link);
    });
  }
  if (commentsChanged) renderComments();
  showStatus();
}
async function paintDocument() {
  rendering = true;
  if ($('diagram-dialog').open) $('diagram-dialog').close();
  do {
    renderedTheme = browserTheme();
    await renderDocument($('document'), state.document.source, state.round, item => openComment(item), expandDiagram, renderedTheme);
  } while (renderedTheme !== browserTheme());
  rendering = false;
}
mediaTheme.addEventListener('change', async () => {
  document.documentElement.dataset.theme = browserTheme();
  if (state && !rendering && state.phase !== 'ended') { await paintDocument(); showStatus(); }
});
async function mutate(action) {
  if (busy) return;
  busy = true; showStatus();
  try { await action(); if (state.phase === 'reviewing' && !state.stale) banner(); }
  catch (error) { banner(error.message, true); }
  finally { busy = false; showStatus(); renderComments(); }
}
function rememberComposer() {
  if (!state || !target) return;
  sessionStorage.setItem(draftKey(), JSON.stringify({ target, text: $('comment-text').value, editingId, revision: composerRevision,
    hash: state.document.hash, round: state.round }));
}
function openComment(item, existing = null, restoredText) {
  if (!working() || rendering) return;
  target = item; editingId = existing?.id ?? null; composerRevision = state.draft.revision;
  $('composer-title').textContent = existing ? 'Edit comment' : 'Add a comment';
  $('target-meta').textContent = `${item.kind === 'text' ? 'Selected text' : item.kind} · lines ${item.startLine}–${item.endLine}`;
  $('target-quote').textContent = caption(item); $('comment-text').value = restoredText ?? existing?.text ?? '';
  $('composer-error').textContent = ''; $('selection-action').hidden = true;
  window.getSelection()?.removeAllRanges(); $('composer').showModal(); $('comment-text').focus();
  rememberComposer();
}
function cancelComment() {
  const initial = state.draft.comments.find(item => item.id === editingId)?.text ?? '';
  if ($('comment-text').value !== initial && !confirm('Discard this unsaved comment?')) return;
  sessionStorage.removeItem(draftKey()); $('composer').close();
}
$('cancel').addEventListener('click', cancelComment);
$('composer').addEventListener('cancel', event => { event.preventDefault(); cancelComment(); });
$('comment-text').addEventListener('input', rememberComposer);
$('comment-text').addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') { event.preventDefault(); $('comment-form').requestSubmit(); }
});
$('comment-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (busy) return;
  busy = true; $('save-comment').disabled = true;
  const comment = { id: editingId ?? crypto.randomUUID(), target, text: $('comment-text').value };
  const comments = editingId ? state.draft.comments.map(item => item.id === editingId ? comment : item) : [...state.draft.comments, comment];
  try {
    await applyState(await api('draft', { ...version(), revision: composerRevision, comments }));
    sessionStorage.removeItem(draftKey()); $('composer').close(); banner();
  } catch (error) { $('composer-error').textContent = error.message; }
  finally { busy = false; $('save-comment').disabled = false; showStatus(); renderComments(); }
});
function captureSelection() {
  if ($('composer').open || !working()) return;
  const selection = window.getSelection();
  if (!selection?.rangeCount || !selection.toString().trim()) { $('selection-action').hidden = true; return; }
  const range = selection.getRangeAt(0), article = $('document');
  const element = node => node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
  const first = element(range.startContainer)?.closest('.source-block'), last = element(range.endContainer)?.closest('.source-block');
  if (!first || !last || !article.contains(first) || !article.contains(last) ||
    element(range.commonAncestorContainer)?.closest('.diagram') || selection.toString().length > 20000) return;
  const startRange = document.createRange(); startRange.selectNodeContents(first); startRange.setEnd(range.startContainer, range.startOffset);
  const endRange = document.createRange(); endRange.selectNodeContents(last); endRange.setEnd(range.endContainer, range.endOffset);
  selectionTarget = { kind: 'text', startLine: Number(first.dataset.startLine), endLine: Number(last.dataset.endLine),
    startTextOffset: startRange.toString().length, endTextOffset: endRange.toString().length, quote: selection.toString().trim() };
  const box = range.getBoundingClientRect(), button = $('selection-action'); button.hidden = false;
  button.style.left = `${Math.max(8, Math.min(window.innerWidth - 190, box.left))}px`;
  button.style.top = `${Math.max(8, Math.min(window.innerHeight - 48, box.bottom + 8))}px`;
}
document.addEventListener('mouseup', () => setTimeout(captureSelection, 0));
document.addEventListener('keyup', captureSelection);
$('selection-action').addEventListener('click', () => openComment(selectionTarget));
$('send').addEventListener('click', () => void mutate(async () => {
  const key = `review-send:${state.id}:${state.round}`;
  const requestId = sessionStorage.getItem(key) || crypto.randomUUID(); sessionStorage.setItem(key, requestId);
  await api('send', { ...version(), revision: state.draft.revision, requestId });
  await applyState(await api('state'));
}));
$('reload').addEventListener('click', () => void mutate(async () => {
  const pending = state.draft.comments.length > 0;
  if (pending && !confirm('Reload the document and discard your unsent comments?')) return;
  await applyState(await api('refresh', { ...version(), revision: state.draft.revision, discard: pending }));
  sessionStorage.removeItem(draftKey());
}));
$('end').addEventListener('click', () => void mutate(async () => {
  const pending = state.draft.comments.length > 0;
  if (pending && !confirm('End review and discard your unsent comments?')) return;
  await api('end', { ...version(), revision: state.draft.revision, discard: pending });
  state.phase = 'ended'; sessionStorage.removeItem(draftKey()); finishView();
}));
function finishView() {
  clearInterval(pollTimer); $('composer').close(); $('diagram-dialog').close(); document.body.classList.add('ended');
  $('send').disabled = true; $('end').disabled = true; $('phase').textContent = 'Review ended';
  banner('Review ended. You can close this tab.');
}
function expandDiagram(canvas) {
  if ($('diagram-dialog').open) return;
  canvasHome = document.createComment('diagram-home'); canvas.before(canvasHome); expandedCanvas = canvas;
  $('expanded-diagram').replaceChildren(canvas); $('diagram-dialog').showModal(); zoom = 1; setZoom(1);
}
function setZoom(value) {
  if (!expandedCanvas) return;
  zoom = Math.max(.25, Math.min(4, value));
  const svg = expandedCanvas.querySelector('svg');
  const natural = svg.viewBox.baseVal.width || 800;
  svg.style.width = `${Math.min(natural, $('expanded-diagram').clientWidth - 75) * zoom}px`; svg.style.maxHeight = 'none';
}
$('zoom-in').onclick = () => setZoom(zoom * 1.25); $('zoom-out').onclick = () => setZoom(zoom / 1.25); $('fit').onclick = () => setZoom(1);
$('close-diagram').onclick = () => $('diagram-dialog').close();
$('diagram-dialog').addEventListener('close', () => {
  if (expandedCanvas) { expandedCanvas.querySelector('svg')?.removeAttribute('style'); canvasHome.replaceWith(expandedCanvas); }
  expandedCanvas = null;
});
async function poll() {
  if (busy || rendering || state?.phase === 'ended') return;
  try {
    const next = await api('state'); const recovering = !connected; connected = true;
    await applyState(next); if (recovering && !state.stale && state.phase === 'reviewing') banner();
  } catch (error) { connected = false; showStatus(); banner('Connection lost. Your saved comments are kept. Restart the session to continue.', true); }
}
let pollTimer;
try {
  await applyState(await api('state'));
  const saved = JSON.parse(sessionStorage.getItem(draftKey()) || 'null');
  if (saved?.hash === state.document.hash && saved.round === state.round && saved.text && state.phase === 'reviewing') {
    openComment(saved.target, state.draft.comments.find(item => item.id === saved.editingId), saved.text);
    composerRevision = saved.revision;
    rememberComposer();
  }
  pollTimer = setInterval(poll, 900);
} catch (error) { banner(`Could not open review: ${error.message}`, true); }
