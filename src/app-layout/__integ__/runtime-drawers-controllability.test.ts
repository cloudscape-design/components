// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import createWrapper from '../../../lib/components/test-utils/selectors';

const wrapper = createWrapper().findAppLayout();

for (const visualRefresh of [true, false]) {
  for (const pageName of ['runtime-drawers', 'runtime-drawers-imperative']) {
    describe(`page=${pageName} visualRefresh=${visualRefresh}`, () => {
      function setupTest(testFn: (page: BasePageObject) => Promise<void>) {
        return useBrowser(async browser => {
          const page = new BasePageObject(browser);

          await browser.url(
            `#/light/app-layout/${pageName}?${new URLSearchParams({
              hasDrawers: 'false',
              hasTools: 'true',
              visualRefresh: `${visualRefresh}`,
            }).toString()}`
          );
          await page.waitForVisible(wrapper.findDrawerTriggerById('security').toSelector(), true);
          await testFn(page);
        });
      }

      test(
        'should switch between tools panel and runtime drawers',
        setupTest(async page => {
          await page.click(wrapper.findToolsToggle().toSelector());
          await expect(page.getText(wrapper.findTools().getElement())).resolves.toContain(
            'Here is some info for you: default'
          );

          await page.click(wrapper.findDrawerTriggerById('security').toSelector());
          await expect(page.getText(wrapper.findActiveDrawer().getElement())).resolves.toContain('I am runtime drawer');

          await page.click(wrapper.findDrawerTriggerById('awsui-internal-tools').toSelector());
          await expect(page.getText(wrapper.findTools().getElement())).resolves.toContain(
            'Here is some info for you: default'
          );
        })
      );

      test(
        'should allow switching to a drawer after clicking an info link',
        setupTest(async page => {
          await page.click('[data-testid="info-link-header"]');
          await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBeTruthy();
          await expect(page.getText(wrapper.findActiveDrawer().getElement())).resolves.toContain(
            'Here is some info for you: header'
          );
          await page.click(wrapper.findDrawerTriggerById('circle').toSelector());
          await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBeFalsy();
          await expect(page.getText(wrapper.findActiveDrawer().getElement())).resolves.toContain('Nothing to see here');
        })
      );

      test(
        'should open and close tools via controlled mode',
        setupTest(async page => {
          const toolsContentSelector = wrapper.findTools().getElement();
          await page.click(createWrapper().findHeader().findInfo().findLink().toSelector());
          await expect(page.isDisplayed(toolsContentSelector)).resolves.toBe(true);
          await expect(page.getText(wrapper.findActiveDrawer().getElement())).resolves.toContain(
            'Here is some info for you: header'
          );

          await page.click(wrapper.findToolsClose().toSelector());
          await expect(page.isDisplayed(toolsContentSelector)).resolves.toBe(false);
        })
      );

      test(
        'should switch help panel content and close the panel afterwards',
        setupTest(async page => {
          await page.click('[data-testid="info-link-header"]');
          await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBeTruthy();
          await expect(page.getText(wrapper.findActiveDrawer().getElement())).resolves.toContain(
            'Here is some info for you: header'
          );
          await page.click('[data-testid="info-link-content"]');
          await expect(page.getText(wrapper.findActiveDrawer().getElement())).resolves.toContain(
            'Here is some info for you: content'
          );
          await page.click(wrapper.findToolsClose().toSelector());
          await expect(page.isDisplayed(wrapper.findToolsClose().toSelector())).resolves.toBeFalsy();
        })
      );
    });
  }
}
