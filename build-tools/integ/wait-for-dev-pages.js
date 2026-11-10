// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const browserModule = require('@cloudscape-design/browser-test-tools/browser');

/**
 * The dev pages load the page components with dynamic imports, which do not delay the load event of the document.
 * Make `browser.url()` also wait until the page is rendered, so that the tests do not interact with a loading page.
 */
function waitForDevPagesOnNavigation(browser) {
  browser.overwriteCommand('url', async (url, ...args) => {
    const result = await url(...args);
    await browser.waitUntil(
      () =>
        browser.execute(() => {
          const app = document.getElementById('app');
          return !app || (app.childElementCount > 0 && !document.querySelector('[data-dev-pages-loading]'));
        }),
      { timeout: 30_000, timeoutMsg: `The page did not finish loading: ${args[0]}` }
    );
    return result;
  });
  return browser;
}

const getBrowserCreator = browserModule.default;
browserModule.default = (...args) => {
  const creator = getBrowserCreator(...args);
  const getBrowser = creator.getBrowser.bind(creator);
  creator.getBrowser = async (...options) => waitForDevPagesOnNavigation(await getBrowser(...options));
  return creator;
};
