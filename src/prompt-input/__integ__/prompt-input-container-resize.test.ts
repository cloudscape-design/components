// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

import createWrapper from '../../../lib/components/test-utils/selectors/index.js';
import { isReact18 } from './utils';

const wrapper = createWrapper();
const promptInputSelector = wrapper.findPromptInput('[data-testid="prompt-input"]').toSelector();

class ContainerResizePage extends BasePageObject {
  async getPromptInputHeight() {
    const { height } = await this.getBoundingBox(promptInputSelector);
    return height;
  }

  async selectWidth(value: string) {
    await this.click(wrapper.findRadioGroup('[data-testid="width-radio"]').findInputByValue(value).toSelector());
  }
}

describe.each(isReact18 ? ['token', 'plain'] : ['plain'])('Prompt Input - Container Resize (mode=%s)', mode => {
  test(
    'adjusts height when container width changes',
    useBrowser(async browser => {
      const page = new ContainerResizePage(browser);
      await browser.url(`#/prompt-input/container-resize?inputMode=${mode}&containerWidth=400`);
      await page.waitForVisible(promptInputSelector);

      // Start at 400px — text should be wrapping, so height is tall
      const heightAt400 = await page.getPromptInputHeight();

      // Widen to 1200px — text should unwrap, height should decrease
      await page.selectWidth('1200');
      await page.pause(500);
      const heightAt1200 = await page.getPromptInputHeight();

      expect(heightAt1200).toBeLessThan(heightAt400);

      // Narrow back to 400px — height should increase again
      await page.selectWidth('400');
      await page.pause(500);
      const heightAt400Again = await page.getPromptInputHeight();

      expect(heightAt400Again).toBeGreaterThan(heightAt1200);
    })
  );
});
