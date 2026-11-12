// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../../lib/components/test-utils/selectors';

const wrapper = createWrapper();
const writeResult = '[data-testid="write-result"]';
const allowForChat = '[data-testid="allow-for-chat"]';
const prompt = wrapper.findPromptInput('[data-testid="assistant-prompt"]');
const assistantFields = wrapper.findTable('[data-testid="assistant-fields"]');
const formField = (testId: string) => wrapper.findFormField(`[data-testid="${testId}"]`);

const EXPECTED_RESULTS = [
  'Function name: Use only letters, numbers, hyphens and underscores',
  'Runtime: Set',
  'Region: Set',
  "Architecture: arm64 isn't available in EU (Ireland)",
  'Account ID: The field is read-only.',
  'Execution role: Set',
  'Enable logging: Set',
  'Log level: Set',
  'Description: Set',
  'Ephemeral storage (MB): The field is disabled.',
  'Subnets: Set',
  'Security group: Set',
  'Enable flow logs: Set',
  'I acknowledge the terms: Set',
];

const FIELDS_BEFORE_FILLING = 13;

class FieldRegistryDemoPage extends BasePageObject {
  async send(command: string) {
    await this.setValue(prompt.findNativeTextarea().toSelector(), command);
    await this.click(prompt.findActionButton().toSelector());
  }

  async fillExampleValues() {
    await this.waitForAssertion(() =>
      expect(this.getText(assistantFields.toSelector())).resolves.not.toContain('Loading options')
    );
    await this.send('fill example values');
    await this.waitForVisible(allowForChat);
    await this.click(allowForChat);
    await this.waitForAssertion(async () => {
      await expect(this.getElementsCount(writeResult)).resolves.toBe(EXPECTED_RESULTS.length);
    });
    return this.getElementsText(writeResult);
  }

  getVisibleFields() {
    return this.getElementsText(assistantFields.findRows().toSelector());
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
    await expect(this.getText(formField('architecture').findError().toSelector())).resolves.toBe(
      "arm64 isn't available in EU (Ireland)"
    );
    await expect(
      this.getValue(formField('account-id').findControl().findInput().findNativeInput().toSelector())
    ).resolves.toBe('123456789012');
    await expect(
      this.getText(formField('execution-role').findControl().findSelect().findTrigger().toSelector())
    ).resolves.toBe('lambda-basic-execution');
    await expect(
      this.getText(formField('log-level').findControl().findSelect().findTrigger().toSelector())
    ).resolves.toBe('DEBUG');
    await expect(
      this.isDisplayed(wrapper.findExpandableSection('[data-testid="advanced"]').findExpandedContent().toSelector())
    ).resolves.toBe(true);
  }

  async reloadFrame() {
    await this.browser.execute(() =>
      (document.getElementById('field-registry-frame') as HTMLIFrameElement).contentWindow!.location.reload()
    );
    await this.runInsideIframe('#field-registry-frame', true, async () => {
      await this.waitForVisible(formField('subnets').toSelector());
    });
  }

  async expectFrameFormFilled() {
    await this.runInsideIframe('#field-registry-frame', true, async () => {
      const subnets = await this.getText(formField('subnets').findControl().toSelector());
      expect(subnets).toContain('subnet-a');
      expect(subnets).toContain('subnet-b');
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
    const query = new URLSearchParams({
      visualRefresh: 'true',
      appLayoutToolbar: 'true',
      frameForm: 'true',
      ...params,
    });
    await browser.url(`#/light/app-layout/field-registry-demo?${query}`);
    await page.waitForVisible(formField('function-name').toSelector());
    await testFn(page);
  });

test(
  'fills the page and a frame with its own React and Cloudscape instance, the way Q would',
  setupTest({}, async page => {
    await expect(page.fillExampleValues()).resolves.toEqual(EXPECTED_RESULTS);
    await page.expectPageFormFilled();
    await page.expectFrameFormFilled();
  })
);

test(
  'an assistant in a frame with its own React and Cloudscape instance fills the page with the same code',
  setupTest({ assistantInFrame: 'true' }, async page => {
    await page.runInsideIframe('#field-registry-assistant-frame', true, async () => {
      await expect(page.fillExampleValues()).resolves.toEqual(EXPECTED_RESULTS);
    });
    await page.expectPageFormFilled();
    await page.expectFrameFormFilled();
  })
);

test(
  'drops the fields of a frame that reloads, and fills the reloaded frame',
  setupTest({}, async page => {
    await page.waitForAssertion(() => expect(page.getVisibleFields()).resolves.toHaveLength(FIELDS_BEFORE_FILLING));
    await page.reloadFrame();
    await page.waitForAssertion(() => expect(page.getVisibleFields()).resolves.toHaveLength(FIELDS_BEFORE_FILLING));
    await expect(page.fillExampleValues()).resolves.toEqual(EXPECTED_RESULTS);
    await page.expectFrameFormFilled();
  })
);
