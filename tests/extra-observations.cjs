// Run with Playwright available on NODE_PATH: node tests/extra-observations.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    for (const [file, key, fossil] of [
      ['earth-science/geology/geo-eras-expo', 'geofair_', true],
      ['integrated-science/earth-science/geo-eras-expo', 'geofairint_', true],
      ['earth-science/geology/sedimentary-rocks', 'sedimentary_', false],
    ]) {
      const context = await browser.newContext();
      await context.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.hostname !== 'lab.test') return route.abort();
        return route.fulfill({
          contentType: 'text/html',
          body: fs.readFileSync(path.join(__dirname, '..', url.pathname), 'utf8'),
        });
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('dialog', dialog => dialog.accept());
      const url = 'http://lab.test/reports/' + file + '/index.html';
      await page.goto(url);
      await page.locator('.tab[data-step="4"]').click();
      if (!fossil) await page.locator('#add-extra').click();
      const rows = page.locator(fossil ? '#extra-list .extra-card' : '#grid-extra .extra-rock-col');
      await rows.nth(0).locator('.extra-name').fill('표본 <A> & 이름');
      await rows.nth(0).locator('.extra-info').fill('관찰 내용\n둘째 줄');
      const png = await page.evaluate(() => {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 2;
        canvas.getContext('2d').fillRect(0, 0, 2, 2);
        return canvas.toDataURL().split(',')[1];
      });
      await rows.nth(0).locator('input[type=file]').setInputFiles({
        name: 'sample.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64'),
      });
      await page.waitForFunction(key => !!localStorage.getItem(key + 'extra_photo_extra_1'), key);
      await page.locator('#add-extra').click();
      await rows.nth(1).locator('.extra-name').fill('두 번째 표본');
      await page.locator('#add-extra').click();
      await rows.nth(2).locator('.extra-name').fill('세 번째 표본');
      await rows.nth(2).locator('input[type=file]').setInputFiles({
        name: 'third.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64'),
      });
      await page.waitForFunction(key => !!localStorage.getItem(key + 'extra_photo_extra_3'), key);
      await rows.nth(1).locator('button').click();
      await page.reload();
      await page.locator('.tab[data-step="4"]').click();
      assert.equal(await rows.count(), 2);
      assert.equal(await rows.nth(0).locator('.extra-name').inputValue(), '표본 <A> & 이름');
      assert.equal(await rows.nth(0).locator('.extra-info').inputValue(), '관찰 내용\n둘째 줄');
      assert.match(await rows.nth(0).locator('.drop img').getAttribute('src'), /^data:image\/jpeg/);
      assert.equal(await rows.nth(1).locator('.extra-name').inputValue(), '세 번째 표본');
      assert.equal(await rows.nth(1).getAttribute('data-rid'), 'extra_3');
      assert.match(await rows.nth(1).locator('.drop img').getAttribute('src'), /^data:image\/jpeg/);
      await page.evaluate(() => {
        const original = Storage.prototype.setItem;
        Storage.prototype.setItem = function(key, value) {
          if (key.includes('extra_photo_')) throw new DOMException('Full', 'QuotaExceededError');
          return original.call(this, key, value);
        };
      });
      await rows.nth(1).locator('.extra-info').fill('사진 저장 실패에도 글 보존');
      assert.match(await page.locator('#msg').textContent(), /저장 공간이 부족/);
      await page.reload();
      await page.locator('.tab[data-step="4"]').click();
      assert.equal(await rows.nth(1).locator('.extra-info').inputValue(), '사진 저장 실패에도 글 보존');
      await rows.nth(1).locator('button').click();
      await page.reload();
      assert.equal(await rows.count(), 1);
      await page.evaluate(() => localStorage.setItem('unrelated-report', 'keep'));
      await page.locator('#reset').click();
      await page.waitForFunction(key => localStorage.getItem(key + 'extra_rows') === null, key);
      await page.reload();
      assert.equal(await rows.count(), fossil ? 1 : 0);
      assert.equal(await page.evaluate(() => localStorage.getItem('unrelated-report')), 'keep');
      assert.equal(await page.evaluate(key => Object.keys(localStorage).filter(k => k.startsWith(key + 'extra_')).length, key), 0);
      assert.deepEqual(errors, []);
      console.log('PASS ' + file + ': text, photo, reload, middle delete, quota failure, reset');
      await context.close();
    }
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
