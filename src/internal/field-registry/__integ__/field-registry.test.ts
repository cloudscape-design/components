// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const fillButton = '[data-testid="fill-example-values"]';
const writeResult = '[data-testid="write-result"]';
const formField = (testId: string) => wrapper.findFormField(`[data-testid="${testId}"]`);

const EXPECTED_RESULTS = [
  'Function name: Use only letters, numbers, hyphens and underscores',
  'Runtime: Set',
  'Architecture: Set',
  'Enable logging: Set',
  'Description: Set',
  'Subnet: Set',
  'Security group: Set',
  'Enable flow logs: Set',
  'I acknowledge the terms: Set',
];

class FieldRegistryDemoPage extends BasePageObject {
  async fillExampleValues() {
    await this.waitForVisible(fillButton);
    await this.click(fillButton);
    await this.waitForAssertion(async () => {
      await expect(this.getElementsCount(writeResult)).resolves.toBe(EXPECTED_RESULTS.length);
    });
    return this.getElementsText(writeResult);
  }

  async expectPageFormFilled() {
    await expect(
      this.getValue(formField('function-name').findControl().findInput().findNativeInput().toSelector())
    ).resolves.toBe('my function');
    await expect(this.getText(formField('function-name').findError().toSelector())).resolves.toBe(
      'Use only letters, numbers, hyphens and underscores'
    );
    await expect(
      this.getText(formField('runtime').findControl().findSelect().findTrigger().toSelector())
    ).resolves.toBe('Python 3.13');
    await expect(
      this.isDisplayed(wrapper.findExpandableSection('[data-testid="advanced"]').findExpandedContent().toSelector())
    ).resolves.toBe(true);
  }

  getRegisteredFields() {
    return this.getElementsText(wrapper.findTable().findRows().toSelector());
  }

  async reloadFrame() {
    await this.browser.execute(() =>
      (document.getElementById('field-registry-frame') as HTMLIFrameElement).contentWindow!.location.reload()
    );
    await this.runInsideIframe('#field-registry-frame', true, async () => {
      await this.waitForVisible(formField('subnet').toSelector());
    });
  }

  async expectFrameFormFilled() {
    await this.runInsideIframe('#field-registry-frame', true, async () => {
      await expect(
        this.getText(formField('subnet').findControl().findSelect().findTrigger().toSelector())
      ).resolves.toBe('subnet-b');
      await expect(
        this.getValue(formField('security-group').findControl().findInput().findNativeInput().toSelector())
      ).resolves.toBe('sg-web');
      await expect(
        this.isSelected(wrapper.findToggle('[data-testid="flow-logs"]').findNativeInput().toSelector())
      ).resolves.toBe(true);
    });
  }
}

const setupTest = (params: Record<string, string>, testFn: (page: FieldRegistryDemoPage) => Promise<void>) =>
  useBrowser({ width: 1440, height: 1000 }, async browser => {
    const page = new FieldRegistryDemoPage(browser);
    const query = new URLSearchParams({ visualRefresh: 'true', appLayoutToolbar: 'true', ...params });
    await browser.url(`#/light/app-layout/field-registry-demo?${query}`);
    await page.waitForVisible(formField('function-name').toSelector());
    await testFn(page);
  });

test(
  'fills fields rendered by a separate React and Cloudscape instance in a same-origin frame',
  setupTest({ frameForm: 'true' }, async page => {
    await expect(page.fillExampleValues()).resolves.toEqual(EXPECTED_RESULTS);
    await page.expectPageFormFilled();
    await page.expectFrameFormFilled();
  })
);

test(
  'an assistant in a cross-origin frame fills the page through a message bridge',
  setupTest({ frameForm: 'true', isolatedAssistant: 'true' }, async page => {
    await page.runInsideIframe('#isolated-assistant', true, async () => {
      await expect(page.fillExampleValues()).resolves.toEqual(EXPECTED_RESULTS);
    });
    await page.expectPageFormFilled();
    await page.expectFrameFormFilled();
  })
);

test(
  'drops the fields of a frame that reloads, and fills the reloaded frame',
  setupTest({ frameForm: 'true' }, async page => {
    await page.waitForAssertion(() => expect(page.getRegisteredFields()).resolves.toHaveLength(9));
    await page.reloadFrame();
    await page.waitForAssertion(() => expect(page.getRegisteredFields()).resolves.toHaveLength(9));
    await expect(page.fillExampleValues()).resolves.toEqual(EXPECTED_RESULTS);
    await page.expectFrameFormFilled();
  })
);
