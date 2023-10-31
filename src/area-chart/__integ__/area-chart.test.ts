// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBrowser from '@cloudscape-design/browser-test-tools/use-browser';
import AreaChartPageObject from './page-objects/area-chart-page';

function setupTest(url: string, name: string, testFn: (page: AreaChartPageObject) => Promise<void>) {
  return useBrowser(async browser => {
    const id = '#' + name.toLowerCase().replace(/ /g, '-');
    const page = new AreaChartPageObject(browser, id);
    await browser.url(url);
    await testFn(page);
  });
}

describe('Filter', () => {
  test(
    'can hide/un-hide series with a filter',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await expect(page.getSeriesCount()).resolves.toBe(6);
      await expect(page.getSeriesLabel(1)).resolves.toEqual('p90');
      await expect(page.getSeriesLabel(2)).resolves.toEqual('p80');
      await expect(page.getSeriesLabel(3)).resolves.toEqual('Limit');
      await expect(page.getSeriesLabel(4)).resolves.toEqual('p70');
      await expect(page.getSeriesLabel(5)).resolves.toEqual('p60');
      await expect(page.getSeriesLabel(6)).resolves.toEqual('p50');

      await page.toggleFilterOption(1);
      await page.toggleFilterOption(3);

      await expect(page.getSeriesCount()).resolves.toBe(4);
      await expect(page.getSeriesLabel(1)).resolves.toEqual('p90');
      await expect(page.getSeriesLabel(2)).resolves.toEqual('p80');
      await expect(page.getSeriesLabel(3)).resolves.toEqual('Limit');
      await expect(page.getSeriesLabel(4)).resolves.toEqual('p60');

      await page.toggleFilterOption(1);

      await expect(page.getSeriesCount()).resolves.toBe(5);
      await expect(page.getSeriesLabel(1)).resolves.toEqual('p90');
      await expect(page.getSeriesLabel(2)).resolves.toEqual('p80');
      await expect(page.getSeriesLabel(3)).resolves.toEqual('Limit');
      await expect(page.getSeriesLabel(4)).resolves.toEqual('p60');
      await expect(page.getSeriesLabel(5)).resolves.toEqual('p50');
    })
  );
});

describe('Legend', () => {
  test(
    'can hover on the legend items to highlight the underlying series',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);

      // Scroll down to get access to the legend.
      await page.windowScrollTo({ top: 200 });
      await page.hoverLegendItem(1);

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p50');
    })
  );

  test(
    'can focus on the legend items to highlight the underlying series',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);

      await page.focusLegend();

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p50');

      await page.keys(['ArrowLeft']);
      await page.keys(['ArrowLeft']);

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p80');
    })
  );

  test(
    'when legend is focused series hover can move the focus target',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);

      await page.focusLegend();

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p50');

      await page.hoverLegendItem(4);
      await page.keys(['ArrowRight']);

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p80');
    })
  );
  test(
    'highlighted legend elements should be not be highlighted when user hovers away',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      // Scroll down to get access to the legend.
      await page.windowScrollTo({ top: 200 });

      await page.hoverLegendItem(1);

      await page.hoverElement(page.filter.toSelector());
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);
    })
  );
});

describe('Popover', () => {
  test(
    'popover is shown when mouseover non-empty chart plot',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await expect(page.hasPopover()).resolves.toBe(false);

      await page.hoverElement(page.chart.toSelector());

      await expect(page.hasPopover()).resolves.toBe(true);
    })
  );

  test(
    'popover is shown when chart plot is focused',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await expect(page.hasPopover()).resolves.toBe(false);

      await page.focusPlot();

      await expect(page.hasPopover()).resolves.toBe(true);
    })
  );

  test(
    'popover is shown when mouse is over popover',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.setWindowSize({ width: 2000, height: 800 });
      await expect(page.hasPopover()).resolves.toBe(false);

      await page.focusPlot();
      await expect(page.getPopoverTitle()).resolves.toBe('1s');

      await page.hoverElement(page.chart.findDetailPopover().findHeader().toSelector());
      await expect(page.getPopoverTitle()).resolves.toBe('1s');
    })
  );

  test(
    'popover can be pinned/unpinned by clicking on the plot',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();

      await expect(page.hasPopover()).resolves.toBe(true);
      await expect(page.isPopoverPinned()).resolves.toBe(false);

      await page.click(page.chart.toSelector());
      await new Promise(resolve => setTimeout(resolve, 10));

      await expect(page.hasPopover()).resolves.toBe(true);
      await expect(page.isPopoverPinned()).resolves.toBe(true);

      await page.click(page.chart.toSelector());
      await new Promise(resolve => setTimeout(resolve, 10));

      await expect(page.hasPopover()).resolves.toBe(true);
      await expect(page.isPopoverPinned()).resolves.toBe(false);
    })
  );

  test(
    'popover can be pinned by pressing Enter when plot point is focused',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();
      await page.keys(['Enter']);

      await expect(page.hasPopover()).resolves.toBe(true);
      await expect(page.isPopoverPinned()).resolves.toBe(true);
    })
  );

  test(
    'popover should have the same details order as declared series do',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();
      await page.keys(['ArrowRight']);

      await expect(page.hasPopover()).resolves.toBe(true);
      await expect(page.getPopoverDetail(1)).resolves.toBe('p50');
      await expect(page.getPopoverDetail(2)).resolves.toBe('p60');
      await expect(page.getPopoverDetail(3)).resolves.toBe('p70');
      await expect(page.getPopoverDetail(4)).resolves.toBe('Limit');
      await expect(page.getPopoverDetail(5)).resolves.toBe('p80');
      await expect(page.getPopoverDetail(6)).resolves.toBe('p90');
    })
  );

  test(
    'popover stays in the same position after dismissed',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();
      await page.keys(['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight']);
      await page.keys(['Enter']);

      await expect(page.isPopoverPinned()).resolves.toBe(true);
      await expect(page.getPopoverTitle()).resolves.toBe('5s');

      await page.dismissPopover();

      await expect(page.isPopoverPinned()).resolves.toBe(false);
      await expect(page.getPopoverTitle()).resolves.toBe('5s');
    })
  );

  test(
    'popover can be closed when Escape is pressed after hover',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await expect(page.hasPopover()).resolves.toBe(false);
      await page.hoverElement(page.chart.toSelector());
      await expect(page.hasPopover()).resolves.toBe(true);
      await page.keys(['Escape']);
      await expect(page.hasPopover()).resolves.toBe(false);
    })
  );

  test(
    'popover can be closed when Escape is pressed after chart plot is focused',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();
      await expect(page.hasPopover()).resolves.toBe(true);
      await page.keys(['Escape']);
      await expect(page.hasPopover()).resolves.toBe(false);
    })
  );

  test(
    'popover can be closed by moving focus away',
    setupTest('#/light/area-chart/test', 'Controlled linear latency chart', async page => {
      await page.focusPlot();
      await expect(page.hasPopover()).resolves.toBe(true);
      const popover = page.getPopover();
      const buttonDropdown = popover.findContent().findButtonDropdown();
      expect(page.getElementsCount(buttonDropdown.toSelector())).resolves.toBe(1);
      await page.keys(['Tab']);
      expect(await page.getFocusedElementText()).toBe('Actions');
      await page.keys(['Tab']);
      expect(await page.getFocusedElementText()).toBe('p50');
      await expect(page.hasPopover()).resolves.toBe(false);
    })
  );
});

describe('Keyboard navigation', () => {
  test(
    'can navigate between data points within series',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.setWindowSize({ width: 2000, height: 800 });
      await page.focusPlot();

      await expect(page.getPopoverTitle()).resolves.toBe('1s');

      await page.keys(['ArrowRight']);

      await expect(page.getPopoverTitle()).resolves.toBe('2s');

      await page.keys(['ArrowLeft', 'ArrowLeft']);

      await expect(page.getPopoverTitle()).resolves.toBe('120s');
    })
  );

  test(
    'can navigate between series',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);

      await page.keys(['ArrowUp']);

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p50');

      await page.keys(['ArrowUp']);

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p60');

      await page.keys(['ArrowDown', 'ArrowDown']);

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);

      await page.keys(['ArrowDown']);

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p90');
    })
  );

  test(
    'maintains X coordinate after switching between focusing a single series and all series',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();

      await expect(page.getPopoverTitle()).resolves.toBe('1s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);

      await page.keys(['ArrowRight']);
      await expect(page.getPopoverTitle()).resolves.toBe('2s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);

      await page.keys(['ArrowDown']);
      await expect(page.getPopoverTitle()).resolves.toBe('2s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p90');

      await page.keys(['ArrowRight']);
      await expect(page.getPopoverTitle()).resolves.toBe('3s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p90');

      await page.keys(['ArrowUp']);
      await expect(page.getPopoverTitle()).resolves.toBe('3s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);

      await page.keys(['ArrowRight']);
      await expect(page.getPopoverTitle()).resolves.toBe('4s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);
    })
  );
});

describe('Focus delegation', () => {
  test(
    'when unpinning the popover the previously highlighted data point is focused',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();

      await page.keys(['ArrowUp', 'ArrowRight', 'ArrowRight', 'Enter']);

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p50');
      await expect(page.getPopoverTitle()).resolves.toBe('3s');
      await expect(page.isPopoverPinned()).resolves.toBe(true);

      await page.dismissPopover();

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p50');
      await expect(page.getPopoverTitle()).resolves.toBe('3s');
      await expect(page.isPopoverPinned()).resolves.toBe(false);
    })
  );

  test(
    'when unpinning the popover the previously highlighted data point group is focused',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();

      await page.keys(['ArrowRight', 'ArrowRight', 'Enter']);

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);
      await expect(page.getPopoverTitle()).resolves.toBe('3s');
      await expect(page.isPopoverPinned()).resolves.toBe(true);

      await page.dismissPopover();

      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);
      await expect(page.getPopoverTitle()).resolves.toBe('3s');
      await expect(page.isPopoverPinned()).resolves.toBe(false);
    })
  );

  test(
    'preserves series highlight when focused away from plot',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.setWindowSize({ width: 2000, height: 800 });
      await page.focusPlot();

      await page.keys(['ArrowDown', 'ArrowRight']);

      await expect(page.getPopoverTitle()).resolves.toBe('2s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p90');

      await page.focusPlot();

      await expect(page.getPopoverTitle()).resolves.toBe('1s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p90');
    })
  );

  test(
    'clears series highlight when focused away from chart',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();

      await page.keys(['ArrowDown', 'ArrowRight']);

      await expect(page.getPopoverTitle()).resolves.toBe('2s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p90');

      await page.keys(['Tab', 'Tab']);
      await page.focusPlot();

      await expect(page.getPopoverTitle()).resolves.toBe('1s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);
    })
  );

  test(
    'when focusing away from plot and popover is pinned the highlight stays',
    setupTest('#/light/area-chart/test', 'Linear latency chart', async page => {
      await page.focusPlot();

      await page.keys(['ArrowDown', 'ArrowRight', 'Enter']);

      await expect(page.getPopoverTitle()).resolves.toBe('2s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p90');

      await page.keys(['Tab', 'Shift', 'Tab']);

      await expect(page.getPopoverTitle()).resolves.toBe('2s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p90');
    })
  );
});

describe('Controlled', () => {
  test(
    'can use filter series same as in uncontrolled chart',
    setupTest('#/light/area-chart/test', 'Controlled linear latency chart', async page => {
      await expect(page.getSeriesCount()).resolves.toBe(6);

      await page.toggleFilterOption(1);
      await page.toggleFilterOption(3);

      await expect(page.getSeriesCount()).resolves.toBe(4);

      await page.toggleFilterOption(1);

      await expect(page.getSeriesCount()).resolves.toBe(5);
    })
  );

  test(
    'can use highlight X same as in uncontrolled chart',
    setupTest('#/light/area-chart/test', 'Controlled linear latency chart', async page => {
      await page.focusPlot();

      await expect(page.getPopoverTitle()).resolves.toBe('1s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe(null);

      await page.keys(['ArrowRight', 'ArrowUp']);

      await expect(page.getPopoverTitle()).resolves.toBe('2s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p50');
    })
  );

  test(
    'can use highlight series same as in uncontrolled chart',
    setupTest('#/light/area-chart/test', 'Controlled linear latency chart', async page => {
      await page.focusPlot();

      await page.keys(['ArrowUp']);

      await expect(page.getPopoverTitle()).resolves.toBe('1s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p50');

      await page.keys(['ArrowRight', 'ArrowUp']);

      await expect(page.getPopoverTitle()).resolves.toBe('2s');
      await expect(page.getHighlightedSeriesLabel()).resolves.toBe('p60');
    })
  );
});

describe('Labels', () => {
  test(
    'log labels have no intersections',
    setupTest('#/light/area-chart/test', 'Log-x latency chart', async page => {
      await page.setWindowSize({ width: 500, height: 800 });

      let lastEdge = 0;

      for (let index = 1; index <= 100; index++) {
        const selector = page.chart.findXTicks().get(index).toSelector();
        const isExisting = await page.isExisting(selector);

        if (!isExisting) {
          break;
        }

        const bbox = await page.getBoundingBox(selector);

        expect(lastEdge).toBeLessThanOrEqual(bbox.left);

        lastEdge = bbox.right;
      }
    })
  );
});
