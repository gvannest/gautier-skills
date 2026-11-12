async (page) => {
  const expect = (condition, message) => { if (!condition) throw new Error(message); };
  await page.getByRole('heading', { name: 'A job, from schedule to storage', exact: true }).waitFor();
  expect(await page.locator('.diagram-canvas').first().getByText('Scheduler', { exact: true }).isVisible(), 'Missing flowchart label.');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'dark' &&
    document.querySelector('.diagram-canvas svg')?.dataset.theme === 'dark');
  expect(await page.locator('body').evaluate(e => getComputedStyle(e).colorScheme) === 'dark', 'Dark browser preference ignored.');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.waitForFunction(() => document.documentElement.dataset.theme === 'light' &&
    document.querySelector('.diagram-canvas svg')?.dataset.theme === 'light');
  async function save(text) {
    await page.getByRole('textbox', { name: 'Your comment', exact: true }).fill(text);
    await page.getByRole('button', { name: 'Save comment', exact: true }).click();
    await page.getByRole('dialog', { name: 'Add a comment', exact: true }).waitFor({ state: 'hidden' });
  }
  await page.getByRole('button', { name: 'Comment on paragraph at line 14', exact: true }).click();
  await save('Paragraph: explain the retry boundary.');
  await page.getByRole('button', { name: 'Comment on node: Job queue', exact: true }).press('Enter');
  await save('Node: explain what the queue stores.');
  await page.getByRole('button', { name: 'Comment on edge: Claim job', exact: true }).press('Enter');
  await save('Edge: explain how the claim is atomic.');
  await page.locator('.diagram-canvas').last().getByText('Fetch data', { exact: true }).click();
  await save('Sequence: describe the response format.');
  await page.getByText('This proposal separates the technical queue from the ingestion use case.', { exact: false }).first().click({ clickCount: 3 });
  await page.getByRole('button', { name: 'Comment on selection', exact: true }).click();
  await page.getByRole('textbox', { name: 'Your comment', exact: true }).fill('Selected text: clarify handler registration.');
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(() => document.querySelector('.diagram-canvas svg')?.dataset.theme === 'dark');
  expect(await page.getByRole('textbox', { name: 'Your comment', exact: true }).inputValue() ===
    'Selected text: clarify handler registration.', 'Theme switch lost the composer draft.');
  await page.getByRole('button', { name: 'Save comment', exact: true }).click();
  await page.waitForFunction(() => document.querySelectorAll('.comment-card').length === 5);
  await page.reload();
  await page.waitForFunction(() => document.querySelectorAll('.comment-card').length === 5);
  await page.route('**/api/send', route => route.abort('failed'));
  await page.getByRole('button', { name: 'Send comments 5', exact: true }).click();
  await page.waitForFunction(() => document.getElementById('banner').classList.contains('error'));
  expect(await page.locator('.comment-card').count() === 5, 'Failed send lost pending comments.');
  await page.unroute('**/api/send');
  await page.getByRole('button', { name: 'Expand diagram', exact: true }).first().click();
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await page.getByRole('button', { name: 'Close diagram', exact: true }).click();
  return { savedComments: 5, checked: ['text', 'paragraph', 'node', 'edge', 'sequence', 'theme', 'reload', 'failed-send', 'expanded-diagram'] };
}
