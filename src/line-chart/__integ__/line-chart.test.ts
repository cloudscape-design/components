// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BasePageObject } from '@cloudscape-design/browser-test-tools/page-objects';
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';

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
const popoverDismissButtonSelector = (wrapper: LineChartWrapper = chartWrapper) =>
  wrapper.findDetailPopover().findDismissButton().toSelector();

function setupTest(url: string, testFn: (page: LineChartPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const page = new LineChartPageObject(browser);
    await browser.url(url);
    await testFn(page);
  });
}

describe('Keyboard navigation', () => {
  describe('with one single series', () => {
    const testPath = '#/light/line-chart/single-series';

    test(
      'line series is navigable with keyboard',
      setupTest(testPath, async page => {
        await focusChart(page);

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

    test(
      'retains focus after dismissing popover',
      setupTest('#/light/line-chart/single-series', async page => {
        await focusChart(page);

        // First series is highlighted
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');

        // Pin popover
        await page.keys(['Space']);
        await expect(page.isExisting(popoverDismissButtonSelector())).resolves.toBe(true);

        // Dismiss popover
        await page.keys(['Space']);
        await expect(page.isExisting(popoverDismissButtonSelector())).resolves.toBe(false);

        // Pin popover again, to prove that the focus on the element was not lost
        await page.keys(['Space']);
        await expect(page.isExisting(popoverDismissButtonSelector())).resolves.toBe(true);
      })
    );
  });

  describe('with multiple series', () => {
    const testPath = '#/light/line-chart/test';

    test(
      'line series are navigable with keyboard',
      setupTest(testPath, async page => {
        await focusChart(page);
        await page.keys(['ArrowDown']);

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
      setupTest(testPath, async page => {
        await focusChart(page);
        await page.keys(['ArrowUp']);

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
      setupTest(testPath, async page => {
        await focusChart(page);

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

    test(
      'retains focus after dismissing popover',
      setupTest(testPath, async page => {
        await focusChart(page);

        // All series are highlighted
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');

        // Pin popover
        await page.keys(['Space']);
        await expect(page.isExisting(popoverDismissButtonSelector())).resolves.toBe(true);

        // Dismiss popover
        await page.keys(['Space']);
        await expect(page.isExisting(popoverDismissButtonSelector())).resolves.toBe(false);

        // Pin popover again, to prove that the focus on the element was not lost
        await page.keys(['Space']);
        await expect(page.isExisting(popoverDismissButtonSelector())).resolves.toBe(true);
      })
    );

    test(
      'maintains X coordinate after switching between focusing a single series and all series',
      setupTest(testPath, async page => {
        await focusChart(page);

        // All series are highlighted
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('0');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');

        // Move horizontally to the next X coordinate
        await page.keys(['ArrowRight']);
        await expect(page.getText(popoverHeaderSelector())).resolves.not.toContain('0');
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('1');

        // Move vertically to the first series
        await page.keys(['ArrowDown']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.not.toContain('Threshold');

        // Move horizontally to the next X coordinate
        await page.keys(['ArrowRight']);
        await expect(page.getText(popoverHeaderSelector())).resolves.not.toContain('1');
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('2');

        // Move back up to highlight all series
        await page.keys(['ArrowUp']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');

        // Move horizontally to the next X coordinate
        await page.keys(['ArrowRight']);
        await expect(page.getText(popoverHeaderSelector())).resolves.toContain('3');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 1');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Series 2');
        await expect(page.getText(popoverContentSelector())).resolves.toContain('Threshold');
      })
    );
  });
});

async function focusChart(page: LineChartPageObject) {
  await page.click('button');
  await page.keys(['Escape', 'Tab', 'ArrowRight']);
}
