async (page) => {
  const expect = (condition, message) => { if (!condition) throw new Error(message); };
  await page.getByRole('button', { name: 'Comment on node: Job queue', exact: true }).waitFor();
  await page.getByRole('button', { name: 'Comment on node: Job queue', exact: true }).press('Enter');
  expect((await page.locator('#target-meta').innerText()).includes('16–22'), 'CRLF diagram maps to incorrect source lines.');
  await page.getByRole('textbox', { name: 'Your comment', exact: true }).fill('Original saved comment.');
  await page.getByRole('button', { name: 'Save comment', exact: true }).click();
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByRole('textbox', { name: 'Your comment', exact: true }).fill('An unsaved revision of that comment.');
  await page.reload();
  await page.getByRole('textbox', { name: 'Your comment', exact: true }).waitFor();
  expect(await page.getByRole('textbox', { name: 'Your comment', exact: true }).inputValue() ===
    'An unsaved revision of that comment.', 'Page reload lost the unsaved edit.');
  await page.getByRole('button', { name: 'Save comment', exact: true }).click();
  await page.getByText('USD to USD.', { exact: true }).scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const p = [...document.querySelectorAll('article p')].find(e => e.textContent === 'USD to USD.');
    const range = document.createRange(); range.setStart(p.firstChild, 7); range.setEnd(p.firstChild, 10);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  });
  await page.getByRole('button', { name: 'Comment on selection', exact: true }).click();
  await page.getByRole('textbox', { name: 'Your comment', exact: true }).fill('This means the second USD.');
  await page.getByRole('button', { name: 'Save comment', exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll('.comment-card').length === 2);
  return { crlfSourceLines: '16–22', recoveredUnsavedEdit: true, selectedRepeatedOccurrence: 'second USD' };
}
