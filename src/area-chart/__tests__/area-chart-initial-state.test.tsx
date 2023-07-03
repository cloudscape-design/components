// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import { AreaChartWrapper } from '../../../lib/components/test-utils/dom';
import AreaChart, { AreaChartProps } from '../../../lib/components/area-chart';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';
import popoverStyles from '../../../lib/components/popover/styles.css.js';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import TestI18nProvider from '../../../lib/components/internal/i18n/testing';
import { cloneDeep } from 'lodash';
import '../../__a11y__/to-validate-a11y';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

afterEach(() => {
  (warnOnce as jest.Mock).mockReset();
});

function renderAreaChart(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  return { container, rerender, wrapper: new AreaChartWrapper(container) };
}

const areaSeries1: AreaChartProps.Series<number> = {
  type: 'area',
  title: 'Area Series 1',
  data: [
    { x: 0, y: 3 },
    { x: 1, y: 10 },
    { x: 2, y: 7 },
    { x: 3, y: 12 },
  ],
};

const areaSeries2: AreaChartProps.Series<number> = {
  type: 'area',
  title: 'Area Series 2',
  data: [
    { x: 0, y: 2 },
    { x: 1, y: 6 },
    { x: 2, y: 10 },
    { x: 3, y: 4 },
  ],
};

const thresholdSeries1: AreaChartProps.ThresholdSeries = {
  type: 'threshold',
  title: 'Threshold 1',
  y: 8,
};

test('loading text is assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[]}
      statusType="loading"
      empty="No data"
      noMatch="No matched data"
      loadingText="Loading..."
      errorText="Ooops!"
      recoveryText="Try again"
    />
  );
  expect(wrapper.findStatusContainer()!.getElement()).toHaveTextContent('Loading...');
});

test('error and recovery texts are assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[]}
      statusType="error"
      empty="No data"
      noMatch="No matched data"
      loadingText="Loading..."
      errorText="Ooops!"
      recoveryText="Try again"
      onRecoveryClick={() => {}}
    />
  );
  expect(wrapper.findStatusContainer()!.getElement()).toHaveTextContent('Ooops! Try again');
});

test('chart height is assigned', () => {
  const { wrapper } = renderAreaChart(<AreaChart height={333} statusType="finished" series={[areaSeries1]} />);
  expect(wrapper.findChart()!.getElement()).toHaveAttribute('height', '333');
});

test('empty text is assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[]}
      statusType="finished"
      empty="No data"
      noMatch="No matched data"
      loadingText="Loading..."
      errorText="Ooops!"
      recoveryText="Try again"
    />
  );
  expect(wrapper.findStatusContainer()!.getElement()).toHaveTextContent('No data');
});

test('no-match text is assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      visibleSeries={[]}
      onFilterChange={jest.fn()}
      statusType="finished"
      empty="No data"
      noMatch="No matched data"
      loadingText="Loading..."
      errorText="Ooops!"
      recoveryText="Try again"
    />
  );

  expect(wrapper.findStatusContainer()!.getElement()).toHaveTextContent('No matched data');
});

test('chart plot ARIA attributes are assigned', () => {
  const attr = (wrapper: AreaChartWrapper, name: string) => wrapper.findChart()!.getElement().getAttribute(name);

  const { wrapper: w1 } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      ariaLabel="aria-label"
      ariaDescription="aria-description"
      i18nStrings={{
        chartAriaRoleDescription: 'aria-roledescription',
      }}
    />
  );
  expect(attr(w1, 'aria-label')).toBe('aria-label');
  expect(attr(w1, 'aria-describedby')).toBeTruthy();
  expect(attr(w1, 'aria-roledescription')).toBe('aria-roledescription');
  expect(w1.find(`#${attr(w1, 'aria-describedby')}`)!.getElement()).toHaveTextContent('aria-description');

  const { wrapper: w2 } = renderAreaChart(
    <AreaChart series={[areaSeries1]} statusType="finished" ariaLabelledby="aria-labelledby" />
  );
  expect(attr(w2, 'aria-labelledby')).toBe('aria-labelledby');
});

test('legend labels are assigned', () => {
  const { wrapper: w1 } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      legendTitle="Legend title"
      i18nStrings={{
        legendAriaLabel: 'Legend aria label',
      }}
    />
  );
  expect(w1.findLegend()!.findTitle()!.getElement()).toHaveTextContent('Legend title');

  const { wrapper: w2 } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      i18nStrings={{
        legendAriaLabel: 'Legend aria label',
      }}
    />
  );
  expect(w2.findLegend()!.getElement()).toHaveAttribute('aria-label', 'Legend aria label');
});

test('legend is hidden', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart series={[areaSeries1]} statusType="finished" legendTitle="Legend title" hideLegend={true} />
  );
  expect(wrapper.findLegend()).toBe(null);
});

test('filter labels are assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      i18nStrings={{
        filterLabel: 'Filter',
        filterPlaceholder: 'Filter series',
      }}
    />
  );
  expect(wrapper.findDefaultFilter()!.findTrigger()!.getElement()).toHaveTextContent('Filter');
  expect(wrapper.findDefaultFilter()!.getElement()).toContainHTML('Filter series');
  expect(wrapper.findDefaultFilter()!.findPlaceholder()!.getElement()).toHaveTextContent('Filter series');
});

test('filter is hidden', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      visibleSeries={[]}
      onFilterChange={jest.fn()}
      statusType="finished"
      i18nStrings={{
        filterLabel: 'Filter',
      }}
      hideFilter={true}
    />
  );
  expect(wrapper.findDefaultFilter()).toBe(null);
});

test('additional filters are assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart series={[areaSeries1]} statusType="finished" additionalFilters={<div id="extra-filters"></div>} />
  );
  expect(wrapper.findDefaultFilter()).not.toBe(null);
  expect(wrapper.find('#extra-filters')).not.toBe(null);
});

test('visibleSeries is assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1, areaSeries2]}
      statusType="finished"
      visibleSeries={[areaSeries1]}
      onFilterChange={jest.fn()}
    />
  );
  expect(wrapper.findSeries()).toHaveLength(1);
});

test('axes labels are assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      xTitle="x values"
      yTitle="y values"
      i18nStrings={{
        xAxisAriaRoleDescription: 'x-axis',
        yAxisAriaRoleDescription: 'y-axis',
      }}
    />
  );
  expect(wrapper.findXAxisTitle()!.getElement()).toHaveTextContent('x values');
  expect(wrapper.findYAxisTitle()!.getElement()).toHaveTextContent('y values');
  expect(wrapper.find('[aria-roledescription="x-axis"]')).not.toBe(null);
  expect(wrapper.find('[aria-roledescription="y-axis"]')).not.toBe(null);
});

test('a11y', async () => {
  const { container, wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      i18nStrings={{
        filterLabel: 'Filter displayed data',
        filterPlaceholder: 'Filter data',
        filterSelectedAriaLabel: '(selected)',
        detailTotalLabel: 'Total',
        detailPopoverDismissAriaLabel: 'Dismiss',
        legendAriaLabel: 'Legend',
        chartAriaRoleDescription: 'area chart',
        xAxisAriaRoleDescription: 'x axis',
        yAxisAriaRoleDescription: 'y axis',
      }}
    />
  );

  // Show popover for the first data point.
  wrapper.findApplication()!.focus();
  // Pin popover.
  wrapper.findApplication()!.keydown(KeyCode.enter);

  await expect(container).toValidateA11y();
});

test('popover labels are assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      i18nStrings={{
        detailPopoverDismissAriaLabel: 'Dismiss',
        detailTotalLabel: 'Total',
      }}
    />
  );

  // Show popover for the first data point.
  wrapper.findApplication()!.focus();
  // Pin popover.
  wrapper.findApplication()!.keydown(KeyCode.enter);

  expect(wrapper.findDetailPopover()!.findDismissButton()!.getElement()).toHaveAttribute('aria-label', 'Dismiss');
  expect(wrapper.findDetailPopover()!.findContent()!.getElement()).toHaveTextContent('Area Series 13Total3');
});

test('popover size is assigned', () => {
  for (const size of ['small', 'large'] as const) {
    const { wrapper } = renderAreaChart(
      <AreaChart series={[areaSeries1]} statusType="finished" detailPopoverSize={size} />
    );

    // Show popover for the first data point.
    wrapper.findApplication()!.focus();

    expect(wrapper.findByClassName(popoverStyles[`container-body-size-${size}`])).not.toBe(null);
  }
});

test('value formatters are assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      detailPopoverFooter={xValue => <span>Details about {xValue}</span>}
    />
  );

  // Show popover for the first data point.
  wrapper.findApplication()!.focus();

  expect(wrapper.findDetailPopover()!.findContent()!.getElement()).toHaveTextContent('Details about 0');
});

test('can contain custom content in the footer', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[
        {
          ...areaSeries1,
          valueFormatter: (y: number, x: number) => `[${x}${y}]`,
        },
        {
          ...thresholdSeries1,
          valueFormatter: (y: number) => `[${y}]`,
        },
      ]}
      statusType="finished"
    />
  );

  // Show popover for the first data point.
  wrapper.findApplication()!.focus();

  expect(wrapper.findDetailPopover()!.findContent()!.getElement()).toHaveTextContent(
    'Area Series 1[03]Threshold 1[8]3'
  );
});

test('tick formatters are assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      i18nStrings={{
        xTickFormatter: (x: number) => `x${x}`,
        yTickFormatter: (y: number) => `y${y}`,
      }}
    />
  );

  // Show popover for the first data point.
  wrapper.findApplication()!.focus();

  expect(wrapper.findChart()!.getElement()).toContainHTML('x2');
  expect(wrapper.findChart()!.getElement()).toContainHTML('y7');
  expect(wrapper.findDetailPopover()!.findHeader()!.getElement()).toHaveTextContent('x0');
});

test('detail total formatter is assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      i18nStrings={{
        detailTotalFormatter: (y: number) => `=${y}`,
      }}
    />
  );

  // Show popover for the first data point.
  wrapper.findApplication()!.focus();

  expect(wrapper.findDetailPopover()!.findContent()!.getElement()).toHaveTextContent('Area Series 13=3');
});

test('detail total formatter falls back to tick formatter', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1]}
      statusType="finished"
      i18nStrings={{
        yTickFormatter: (y: number) => `y${y}`,
      }}
    />
  );

  // Show popover for the first data point.
  wrapper.findApplication()!.focus();

  expect(wrapper.findDetailPopover()!.findContent()!.getElement()).toHaveTextContent('Area Series 13y3');
});

test('filter selected aria label is assigned', () => {
  const { wrapper } = renderAreaChart(
    <AreaChart
      series={[areaSeries1, areaSeries2]}
      statusType="finished"
      i18nStrings={{
        filterSelectedAriaLabel: 'Series:',
      }}
    />
  );

  // Focus series-2 in filter.
  wrapper.findDefaultFilter()!.openDropdown();
  wrapper.findDefaultFilter()!.findDropdown()!.findOption(1)!.focus();

  expect(wrapper.findDefaultFilter()!.findDropdown()!.getElement()).toContainHTML('Series:');
});

test('warns when visibleSeries is provided without onFilterChange', () => {
  renderAreaChart(<AreaChart series={[areaSeries1]} statusType="finished" visibleSeries={[areaSeries1]} />);

  expect(warnOnce).toHaveBeenCalledTimes(1);
});

test('warns when highlightedSeries is provided without onHighlightChange', () => {
  renderAreaChart(<AreaChart series={[areaSeries1]} statusType="finished" highlightedSeries={areaSeries1} />);

  expect(warnOnce).toHaveBeenCalledTimes(1);
});

test('warns when data series are of different lengths', () => {
  const s1 = areaSeries1;
  const s2 = cloneDeep(areaSeries2);
  s2.data = s2.data.slice(0, -1);
  renderAreaChart(<AreaChart series={[s1, s2]} statusType="finished" />);

  expect(warnOnce).toHaveBeenCalledTimes(1);
});

test('warns when data series have different x values', () => {
  const s1 = areaSeries1;
  const s2 = cloneDeep(areaSeries2);
  s2.data[2].x++;
  renderAreaChart(<AreaChart series={[s1, s2]} statusType="finished" />);

  expect(warnOnce).toHaveBeenCalledTimes(1);
});

describe('i18n', () => {
  test('detailTotalLabel can be provided through provider', () => {
    const { wrapper } = renderAreaChart(
      <TestI18nProvider
        messages={{
          'area-chart': { 'i18nStrings.detailTotalLabel': 'Custom total label' },
          popover: { dismissAriaLabel: 'Custom dismiss' },
        }}
      >
        <AreaChart series={[areaSeries1]} statusType="finished" />
      </TestI18nProvider>
    );

    // Show popover for the first data point.
    wrapper.findApplication()!.focus();
    // Pin popover.
    wrapper.findApplication()!.keydown(KeyCode.enter);

    expect(wrapper.findDetailPopover()!.findDismissButton()!.getElement()).toHaveAttribute(
      'aria-label',
      'Custom dismiss'
    );
    expect(wrapper.findDetailPopover()!.findContent()!.getElement()).toHaveTextContent('Custom total label');
  });
});
