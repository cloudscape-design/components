// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import createWrapper, { LineChartWrapper } from '../../../lib/components/test-utils/selectors';

class LineChartPageObject extends BasePageObject {
  constructor(browser: ConstructorParameters<typeof BasePageObject>[0]) {
    super(browser);
  }
}

const chartWrapper = createWrapper().findLineChart('#chart');

const popoverHeaderSelector = (wrapper: LineChartWrapper = chartWrapper) =>
  wrapper.findDetailPopover().findHeader().toSelector();
const popoverContentSelector = (wrapper: LineChartWrapper = chartWrapper) =>
  wrapper.findDetailPopover().findContent().toSelector();

function setupTest(url: string, testFn: (page: LineChartPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new LineChartPageObject(browser);
    await browser.url(url);
    await testFn(page);
  });
}

describe('Keyboard navigation', () => {
  describe('with single series', () => {
    test(
      'line series is navigable with keyboard',
      setupTest('#/light/line-chart/single-series', async page => {
        await page.click('button');
        await page.keys(['Escape', 'Tab', 'ArrowRight']);

        // First series is highlighted
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');

        // Move horizontally to the next point
        await page.keys(['ArrowRight']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');

        // Move horizontally to the last point
        await page.keys(['ArrowLeft', 'ArrowLeft']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('31');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
      })
    );
  });

  describe('with multiple series', () => {
    test(
      'line series are navigable with keyboard',
      setupTest('#/light/line-chart/test', async page => {
        await page.click('button');
        await page.keys(['Escape', 'Tab', 'ArrowRight', 'ArrowDown']);

        // First series is highlighted
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Threshold');

        // Move horizontally to the next point
        await page.keys(['ArrowRight']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Threshold');

        // Move horizontally to the last point
        await page.keys(['ArrowLeft', 'ArrowLeft']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('31');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Threshold');
      })
    );

    test(
      'threshold series are navigable with keyboard',
      setupTest('#/light/line-chart/test', async page => {
        await page.click('button');
        await page.keys(['Escape', 'Tab', 'ArrowRight', 'ArrowUp']);

        // Threshold is highlighted
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');

        // Move horizontally to the next point
        await page.keys(['ArrowRight']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');

        // Move horizontally to the last point
        await page.keys(['ArrowLeft', 'ArrowLeft']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('31');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');
      })
    );

    test(
      'cycles through the different series',
      setupTest('#/light/line-chart/test', async page => {
        await page.click('button');
        await page.keys(['Escape', 'Tab', 'ArrowRight']);

        // All series are highlighted
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');

        // Move vertically to the first series
        await page.keys(['ArrowDown']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Threshold');

        // Move vertically to the next series
        await page.keys(['ArrowDown']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Threshold');

        // Move vertically to the next series
        await page.keys(['ArrowDown']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');

        // Circle back to initial state highlighting all series
        await page.keys(['ArrowDown']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');
      })
    );
  });
});
