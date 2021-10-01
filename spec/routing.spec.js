const {test, expect} = require('@playwright/test');
const version = require('../package.json').dependencies['@ionic/react'].replace('^', '')
const savePath = require('path').join(__dirname,'..',  'test-results', version)

const correctMatchPath = async (page, activeAnchor, screenshotName) => {
  await page.screenshot({ path: `${savePath}/${screenshotName}.png` });
  const matchPath = await page.locator('span:has-text("correct match path")').count();
  expect(matchPath).toBe(1);
  await expect(activeAnchor).toHaveAttribute('data-active', 'true');
};

const getAnchor = (page, text) => page.locator(`a:has-text("${text}")`);

test.only(`routing-${version}`, async ({page}) => {
  await page.goto('localhost:3000');
  const oranges = getAnchor(page, 'Oranges');
  const apples = getAnchor(page, 'Apples');
  await page.screenshot({ path: `redirect.png` });

  // redirect
  await correctMatchPath(page, oranges, '1-redirect');

  // click apples
  await apples.click();
  await correctMatchPath(page, apples, '2-apples');

  // click oranges
  await oranges.click();
  await correctMatchPath(page, oranges, '3-oranges');
});
