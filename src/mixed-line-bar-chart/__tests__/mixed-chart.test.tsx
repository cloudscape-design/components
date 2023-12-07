// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ElementWrapper } from '../../../lib/components/test-utils/dom';
import { MixedLineBarChartWrapper } from '../../../lib/components/test-utils/dom';
import MixedLineBarChart, { MixedLineBarChartProps } from '../../../lib/components/mixed-line-bar-chart';
import styles from '../../../lib/components/mixed-line-bar-chart/styles.css.js';
import cartesianStyles from '../../../lib/components/internal/components/cartesian-chart/styles.css.js';
import chartWrapperStyles from '../../../lib/components/internal/components/chart-wrapper/styles.css.js';
import { lineSeries3 } from './common';
import createComputedTextLengthMock from './computed-text-length-mock';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';
import positions from '../../../lib/components/popover/utils/positions';

jest.mock('../../../lib/components/popover/utils/positions', () => {
  return {
    ...jest.requireActual('../../../lib/components/popover/utils/positions'),
    getOffsetDimensions: () => ({ offsetWidth: 200, offsetHeight: 300 }), // Approximate mock value for the popover dimensions
  };
});

const statusTypes: Array<MixedLineBarChartProps<number>['statusType']> = ['finished', 'loading', 'error'];

function expectToExist(wrapper: ElementWrapper | null, shouldExist: boolean) {
  if (shouldExist) {
    expect(wrapper).not.toBeNull();
  } else {
    expect(wrapper).toBeNull();
  }
}

function renderMixedChart(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  return {
    rerender,
    wrapper: new MixedLineBarChartWrapper(container),
  };
}

const lineSeries: MixedLineBarChartProps.DataSeries<number> = {
  type: 'line',
  title: 'Line Series 1',
  data: [
    { x: 0, y: 3 },
    { x: 1, y: 10 },
    { x: 2, y: 7 },
    { x: 3, y: 12 },
  ],
};

const dateSeries: MixedLineBarChartProps.DataSeries<Date> = {
  type: 'line',
  title: 'Line Series 1',
  data: [
    { x: new Date(2020, 5, 12), y: 3 },
    { x: new Date(2020, 5, 13), y: 10 },
    { x: new Date(2020, 5, 14), y: 7 },
    { x: new Date(2020, 5, 15), y: 12 },
  ],
};

const barSeries: MixedLineBarChartProps.DataSeries<string> = {
  type: 'bar',
  title: 'Bar Series 1',
  data: [
    { x: 'Group 1', y: 2 },
    { x: 'Group 2', y: 4 },
    { x: 'Group 3', y: 4 },
    { x: 'Group 4', y: 9 },
  ],
};

const barSeries2: MixedLineBarChartProps.DataSeries<string> = {
  type: 'bar',
  title: 'Bar Series 2',
  data: [
    { x: 'Group 1', y: 5 },
    { x: 'Group 2', y: 2 },
    { x: 'Group 3', y: 1 },
    { x: 'Group 4', y: 3 },
  ],
};

const logarithmicSeries: MixedLineBarChartProps.DataSeries<number> = {
  type: 'line',
  title: 'Logarithmic line',
  data: [
    { x: 1, y: 300 },
    { x: 2, y: 20040 },
    { x: 3, y: 60000 },
    { x: 4, y: 1000 },
    { x: 5, y: 600030 },
    { x: 6, y: 300 },
    { x: 7, y: 20040 },
    { x: 8, y: 60000 },
    { x: 9, y: 1000 },
  ],
};

const thresholdSeries: MixedLineBarChartProps.ThresholdSeries = {
  type: 'threshold',
  title: 'Threshold 1',
  y: 6,
};

// Mock support for CSS Custom Properties in Jest so that we assign the correct colors.
// Transformation to fallback colors for browsers that don't support them are covered by the `parseCssVariable` utility.
const originalCSS = window.CSS;

let originalGetComputedStyle: Window['getComputedStyle'];
const fakeGetComputedStyle: Window['getComputedStyle'] = (...args) => {
  const result = originalGetComputedStyle(...args);
  result.borderWidth = '2px'; // Approximate mock value for the popover body' border width
  result.width = '10px'; // Approximate mock value for the popover arrow's width
  result.height = '10px'; // Approximate mock value for the popover arrow's height
  return result;
};

beforeEach(() => {
  window.CSS.supports = () => true;
  originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = fakeGetComputedStyle;

  jest.resetAllMocks();
});
afterEach(() => {
  window.CSS = originalCSS;
  window.getComputedStyle = originalGetComputedStyle;
});

describe('Series', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('supports numeric line series', () => {
    const series = [[lineSeries], [thresholdSeries], [lineSeries, thresholdSeries]];
    const xDomain = [0, 10];
    const yDomain = [0, 20];

    let wrapper: MixedLineBarChartWrapper;

    series.forEach(s => {
      ({ wrapper } = renderMixedChart(<MixedLineBarChart series={s} xDomain={xDomain} yDomain={yDomain} />));

      expect(wrapper.findSeries()).toHaveLength(s.length);
      s.forEach((chartSeries, i) =>
        expect(wrapper.findSeries()[i].getElement()).toHaveAttribute('aria-label', chartSeries.title)
      );
    });

    expect(consoleSpy).not.toBeCalled();
  });

  test('supports time-based line series', () => {
    const series = [[dateSeries], [thresholdSeries], [dateSeries, thresholdSeries]];
    // We are deliberately creating new Date instances here to test that object inequality doesn't break the test
    const xDomain = dateSeries.data.map(({ x }) => new Date(x));
    const yDomain = [0, 20];

    let wrapper: MixedLineBarChartWrapper;

    series.forEach(s => {
      ({ wrapper } = renderMixedChart(
        <MixedLineBarChart series={s} xDomain={xDomain} xScaleType="time" yDomain={yDomain} />
      ));

      expect(wrapper.findSeries()).toHaveLength(s.length);
      s.forEach((chartSeries, i) =>
        expect(wrapper.findSeries()[i].getElement()).toHaveAttribute('aria-label', chartSeries.title)
      );
    });

    expect(consoleSpy).not.toBeCalled();
  });

  it('excludes invalid categorical data points from a line chart', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart
        series={[lineSeries3]}
        xScaleType="categorical"
        xDomain={['None', 'Of These', 'Match', 'The Data']}
        yDomain={[0, 10]}
      />
    );

    // Expect line path to be empty because no data points match the domain
    expect(wrapper.findSeries()).toHaveLength(1);
    expect(wrapper.findSeries()[0].find('path')?.getElement()).toHaveAttribute('d', '');
  });

  [false, true].forEach(horizontalBars =>
    describe(`supports ${horizontalBars ? 'horizontal' : 'vertical'} bar series`, () => {
      test('with string data', () => {
        const series = [[barSeries], [thresholdSeries], [barSeries, thresholdSeries]];
        const xDomain = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
        const yDomain = [0, 20];

        let wrapper: MixedLineBarChartWrapper;

        series.forEach(s => {
          ({ wrapper } = renderMixedChart(
            <MixedLineBarChart
              series={s}
              xScaleType="categorical"
              xDomain={xDomain}
              yDomain={yDomain}
              horizontalBars={horizontalBars && !s.some(({ type }) => type !== 'bar')}
            />
          ));

          expect(wrapper.findSeries()).toHaveLength(s.length);
          s.forEach((chartSeries, i) =>
            expect(wrapper.findSeries()[i].getElement()).toHaveAttribute('aria-label', chartSeries.title)
          );
        });

        expect(consoleSpy).not.toBeCalled();
      });

      test('with time data', () => {
        const timeBarSeries = { ...dateSeries, type: 'bar' as const };
        const series = [[timeBarSeries], [thresholdSeries], [timeBarSeries, thresholdSeries], [timeBarSeries]];
        const xDomain = timeBarSeries.data.map(({ x }) => new Date(x));
        const yDomain = [0, 20];

        let wrapper: MixedLineBarChartWrapper;

        series.forEach(s => {
          ({ wrapper } = renderMixedChart(
            <MixedLineBarChart
              series={s}
              xScaleType="categorical"
              xDomain={xDomain}
              yDomain={yDomain}
              horizontalBars={horizontalBars && !s.some(({ type }) => type !== 'bar')}
            />
          ));

          expect(wrapper.findSeries()).toHaveLength(s.length);
          s.forEach((chartSeries, i) =>
            expect(wrapper.findSeries()[i].getElement()).toHaveAttribute('aria-label', chartSeries.title)
          );
        });

        expect(consoleSpy).not.toBeCalled();
      });

      test('with number data', () => {
        const numericBarSeries = { ...lineSeries, type: 'bar' as const };
        const series = [[numericBarSeries], [thresholdSeries], [numericBarSeries, thresholdSeries], [numericBarSeries]];
        const xDomain = numericBarSeries.data.map(({ x }) => x);
        const yDomain = [0, 20];

        let wrapper: MixedLineBarChartWrapper;

        series.forEach(s => {
          ({ wrapper } = renderMixedChart(
            <MixedLineBarChart
              series={s}
              xScaleType="categorical"
              xDomain={xDomain}
              yDomain={yDomain}
              horizontalBars={horizontalBars && !s.some(({ type }) => type !== 'bar')}
            />
          ));

          expect(wrapper.findSeries()).toHaveLength(s.length);
          s.forEach((chartSeries, i) =>
            expect(wrapper.findSeries()[i].getElement()).toHaveAttribute('aria-label', chartSeries.title)
          );
        });

        expect(consoleSpy).not.toBeCalled();
      });
    })
  );

  describe('support multiple bar series', () => {
    const series = [barSeries, barSeries2];
    const xDomain = ['Group 1', 'Group 2', 'Group 3', 'Group 4'];
    const yDomain = [0, 20];

    [true, false].forEach(horizontalBars =>
      [true, false].forEach(stackedBars => {
        test(`${stackedBars ? 'stacked' : 'grouped'} ${horizontalBars ? 'horizontal' : 'vertical'} bars`, () => {
          const { wrapper } = renderMixedChart(
            <MixedLineBarChart
              series={series}
              xScaleType="categorical"
              xDomain={xDomain}
              yDomain={yDomain}
              horizontalBars={horizontalBars}
              stackedBars={stackedBars}
            />
          );

          expect(wrapper.findSeries()).toHaveLength(series.length);
          series.forEach((chartSeries, i) =>
            expect(wrapper.findSeries()[i].getElement()).toHaveAttribute('aria-label', chartSeries.title)
          );

          expect(consoleSpy).not.toBeCalled();
        });

        test(`${stackedBars ? 'stacked' : 'grouped'} ${
          horizontalBars ? 'horizontal' : 'vertical'
        } bars with negative values`, () => {
          const negativeSeries = [
            { ...barSeries, data: barSeries.data.map(({ x, y }) => ({ x, y: x === 'Group 2' ? -y : y })) },
            { ...barSeries2, data: barSeries2.data.map(({ x, y }) => ({ x, y: x === 'Group 2' ? -y : y })) },
          ];

          const { wrapper } = renderMixedChart(
            <MixedLineBarChart
              series={negativeSeries}
              xScaleType="categorical"
              xDomain={xDomain}
              yDomain={[-10, 10]}
              horizontalBars={horizontalBars}
              stackedBars={stackedBars}
            />
          );

          expect(wrapper.findSeries()).toHaveLength(series.length);
          series.forEach((chartSeries, i) =>
            expect(wrapper.findSeries()[i].getElement()).toHaveAttribute('aria-label', chartSeries.title)
          );

          expect(consoleSpy).not.toBeCalled();
        });
      })
    );
  });

  test('should log a warning when horizontalBars is used incorrectly', () => {
    renderMixedChart(
      <MixedLineBarChart series={[barSeries, thresholdSeries]} xScaleType="categorical" horizontalBars={true} />
    );
    expect(consoleSpy).not.toBeCalled();

    renderMixedChart(
      <MixedLineBarChart
        series={[barSeries, { ...barSeries, type: 'line' }]}
        xScaleType="categorical"
        horizontalBars={true}
      />
    );
    expect(consoleSpy).lastCalledWith(
      '[AwsUi] [MixedLineBarChart] Property horizontalBars can only be used with charts that contain only bar or threshold series.'
    );
  });

  describe('data gaps', () => {
    // Creating gaps by adding non-existing categories to the domain
    const xDomains = [
      ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
      ['Group 0', 'Group 1', 'Group 2', 'Group 3', 'Group 4'],
      ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'],
      ['Group 1', 'Group 2', 'Group 2b', 'Group 3', 'Group 4'],
      ['Group 1', 'Group 1b', 'Group 2', 'Group 3', 'Group 3b', 'Group 4'],
    ];

    (['line', 'bar'] as const).forEach(chartType => {
      const series1 = { ...barSeries, type: chartType };

      // Second series has the first element removed to create a gap
      const series2 = { ...barSeries2, type: chartType, data: barSeries2.data.slice(1, 4) };

      test(`are supported for single-series ${chartType} charts`, () => {
        xDomains.forEach(xDomain => {
          const { wrapper } = renderMixedChart(
            <MixedLineBarChart series={[series1]} xScaleType="categorical" xDomain={xDomain} yDomain={[0, 20]} />
          );

          // For line series we cannot count the number of data points because they're rendered as one continuous path.
          // In that case we simply check here that the series is present and rely on screenshot tests for the rest.
          if (chartType === 'bar') {
            expect(wrapper.findSeries()[0].findAll('rect')).toHaveLength(4);
          }
          expect(wrapper.findSeries()).toHaveLength(1);
        });
      });

      test(`are supported for multi-series ${chartType} charts`, () => {
        xDomains.forEach(xDomain => {
          const { wrapper } = renderMixedChart(
            <MixedLineBarChart
              series={[series1, series2]}
              xScaleType="categorical"
              xDomain={xDomain}
              yDomain={[0, 20]}
            />
          );

          if (chartType === 'bar') {
            expect(wrapper.findSeries()[0].findAll('rect')).toHaveLength(4);
            expect(wrapper.findSeries()[1].findAll('rect')).toHaveLength(3);
          }
          expect(wrapper.findSeries()).toHaveLength(2);
        });
      });
    });

    test('are supported for mixed categorical charts', () => {
      xDomains.forEach(xDomain => {
        const { wrapper } = renderMixedChart(
          <MixedLineBarChart
            series={[barSeries, { ...barSeries2, type: 'line', data: barSeries2.data.slice(1, 4) }]}
            xScaleType="categorical"
            xDomain={xDomain}
            yDomain={[0, 20]}
          />
        );

        expect(wrapper.findSeries()[0].findAll('rect')).toHaveLength(4);
        expect(wrapper.findSeries()).toHaveLength(2);
      });
    });
  });

  test('CSS color variables are changed to fallback values in unsupported browsers', () => {
    window.CSS.supports = () => false;

    const { wrapper } = renderMixedChart(
      <MixedLineBarChart series={[{ ...lineSeries, color: 'var(--mycolor, red)' }]} />
    );
    expect(wrapper.findSeries()[0].find('path')?.getElement()).toHaveAttribute('stroke', 'red');
  });

  test('should warn when `series` changes with uncontrolled `visibleSeries`', () => {
    const { rerender } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} />);
    expect(consoleSpy).not.toBeCalled();

    rerender(<MixedLineBarChart series={[lineSeries]} />);
    expect(consoleSpy).lastCalledWith(
      '[AwsUi] [MixedLineBarChart] The `series` value passed into the component changed. ' +
        'This may cause problems with filtering - we recommend that you make the `series` value constant, ' +
        'or provide a `visibleSeries` value that derives from the current `series` value.'
    );
  });

  test('should not warn when `series` is constant with uncontrolled `visibleSeries`', () => {
    const series = [lineSeries];
    const { rerender } = renderMixedChart(<MixedLineBarChart series={series} />);
    expect(consoleSpy).not.toBeCalled();

    rerender(<MixedLineBarChart series={series} />);
    expect(consoleSpy).not.toBeCalled();
  });

  test('should not warn about `series` changes when `visibleSeries` is controlled', () => {
    const { rerender } = renderMixedChart(
      <MixedLineBarChart series={[lineSeries]} visibleSeries={[lineSeries]} onFilterChange={() => {}} />
    );
    expect(consoleSpy).not.toBeCalled();

    rerender(<MixedLineBarChart series={[lineSeries]} visibleSeries={[lineSeries]} onFilterChange={() => {}} />);
    expect(consoleSpy).not.toBeCalled();
  });

  test('should not warn about `series` changes when filter is hidden', () => {
    const { rerender } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} hideFilter={true} />);
    expect(consoleSpy).not.toBeCalled();

    rerender(<MixedLineBarChart series={[lineSeries]} hideFilter={true} />);
    expect(consoleSpy).not.toBeCalled();
  });

  test('should warn when threshold series definition is incorrect', () => {
    renderMixedChart(<MixedLineBarChart series={[{ type: 'threshold', title: 'Threshold', x: 0 }]} />);
    expect(consoleSpy).not.toBeCalled();

    renderMixedChart(<MixedLineBarChart series={[{ type: 'threshold', title: 'Threshold', y: 0 }]} />);
    expect(consoleSpy).not.toBeCalled();

    renderMixedChart(<MixedLineBarChart series={[{ type: 'threshold', title: 'Threshold', x: 0, y: 0 }]} />);
    expect(consoleSpy).lastCalledWith(
      '[AwsUi] [MixedLineBarChart] Series of type "threshold" must contain either x or y property.'
    );

    renderMixedChart(<MixedLineBarChart series={[{ type: 'threshold', title: 'Threshold' }]} />);
    expect(consoleSpy).lastCalledWith(
      '[AwsUi] [MixedLineBarChart] Series of type "threshold" must contain either x or y property.'
    );
  });
});

describe('Scales', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'warn');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should log a warning when bar series are used incorrectly', () => {
    (['linear', 'time'] as const).forEach(scaleType => {
      renderMixedChart(<MixedLineBarChart series={[barSeries]} xScaleType={scaleType} />);

      expect(consoleSpy).lastCalledWith(
        `[AwsUi] [MixedLineBarChart] Bar series cannot be used with a ${scaleType} scale. Use a categorical x axis instead.`
      );
    });
  });
});

describe('Axes', () => {
  test('can be labelled', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} xTitle="Title X" yTitle="Title Y" />);

    expect(wrapper.findXAxisTitle()?.getElement()).toHaveTextContent('Title X');
    expect(wrapper.findYAxisTitle()?.getElement()).toHaveTextContent('Title Y');
  });

  test('can be categorical', () => {
    const domains = [
      ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
      ['Group 1', 'Group 2'],
      ['Group 1', 'Group 4'],
      ['Group 3'],
    ];

    let wrapper: MixedLineBarChartWrapper;

    domains.forEach(domain => {
      ({ wrapper } = renderMixedChart(
        <MixedLineBarChart series={[barSeries]} xDomain={domain} xScaleType="categorical" />
      ));
      expect(wrapper.findXTicks()).toHaveLength(domain.length);

      domain.forEach((value, i) => expect(wrapper.findXTicks()[i].getElement()).toHaveTextContent(value));
    });
  });

  test('can be logarithmic', () => {
    const { wrapper, rerender } = renderMixedChart(
      <MixedLineBarChart
        series={[logarithmicSeries]}
        height={250}
        xDomain={[1, 12]}
        yDomain={[100, 1000000]}
        yScaleType="log"
      />
    );

    expect(wrapper.findYTicks()[0].getElement()).toHaveTextContent('100');
    expect(wrapper.findYTicks()[1].getElement()).toHaveTextContent('1000');
    expect(wrapper.findYTicks()[2].getElement()).toHaveTextContent('10000');

    rerender(
      <MixedLineBarChart
        series={[logarithmicSeries]}
        height={250}
        xDomain={[1, 12]}
        yDomain={[100, 1000000]}
        xScaleType="log"
        yScaleType="log"
      />
    );

    expect(wrapper.findYTicks()[0].getElement()).toHaveTextContent('100');
    expect(wrapper.findYTicks()[1].getElement()).toHaveTextContent('1000');
    expect(wrapper.findYTicks()[2].getElement()).toHaveTextContent('10000');
  });

  test('can have tick formatter for y axis', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart
        series={[lineSeries]}
        height={250}
        xDomain={[0, 12]}
        yDomain={[0, 100]}
        i18nStrings={{ yTickFormatter: (value: number) => value.toFixed(2) }}
      />
    );

    expect(wrapper.findYTicks()[0].getElement()).toHaveTextContent('0.00');
    expect(wrapper.findYTicks()[1].getElement()).toHaveTextContent('20.00');
    expect(wrapper.findYTicks()[2].getElement()).toHaveTextContent('40.00');
  });

  describe('can have tick formatter for x axis', () => {
    test('numeric axis', () => {
      const { wrapper } = renderMixedChart(
        <MixedLineBarChart
          series={[lineSeries]}
          height={250}
          xDomain={[0, 12]}
          yDomain={[0, 100]}
          i18nStrings={{ xTickFormatter: (value: number) => value.toFixed(2) }}
        />
      );

      expect(wrapper.findXTicks()[0].getElement()).toHaveTextContent('0.00');
      expect(wrapper.findXTicks()[1].getElement()).toHaveTextContent('2.00');
      expect(wrapper.findXTicks()[2].getElement()).toHaveTextContent('4.00');
    });
  });

  test('users top-level tick formatters over i18nStrings tick formatters', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart
        series={[lineSeries]}
        height={250}
        xDomain={[0, 12]}
        yDomain={[0, 100]}
        xTickFormatter={(value: number) => value.toFixed(2) + ' sec'}
        yTickFormatter={(value: number) => value.toFixed(2) + ' kB'}
      />
    );
    expect(wrapper.findXTicks()[0].getElement()).toHaveTextContent('0.00 sec');
    expect(wrapper.findYTicks()[0].getElement()).toHaveTextContent('0.00 kB');
  });

  test('categorical axis', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart
        series={[barSeries]}
        height={250}
        xDomain={['Group 1', 'Group 2', 'Group 3', 'Group 4']}
        yDomain={[0, 20]}
        xScaleType="categorical"
        i18nStrings={{ xTickFormatter: (value: string) => value.toUpperCase() }}
      />
    );

    expect(wrapper.findXTicks()[0].getElement()).toHaveTextContent('GROUP 1');
    expect(wrapper.findXTicks()[1].getElement()).toHaveTextContent('GROUP 2');
    expect(wrapper.findXTicks()[2].getElement()).toHaveTextContent('GROUP 3');
  });

  test('time axis', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart
        series={[dateSeries]}
        height={250}
        xDomain={[new Date(dateSeries.data[0].x), new Date(dateSeries.data[3].x)]}
        yDomain={[0, 20]}
        xScaleType="time"
        i18nStrings={{
          xTickFormatter: (value: Date) => `${value.getDay()}-${value.getFullYear()}`,
        }}
      />
    );

    expect(wrapper.findXTicks()[0].getElement()).toHaveTextContent('5-2020');
    expect(wrapper.findXTicks()[1].getElement()).toHaveTextContent('5-2020');
    expect(wrapper.findXTicks()[2].getElement()).toHaveTextContent('6-2020');
  });

  describe('responsive text', () => {
    const computedTextLengthMock = createComputedTextLengthMock();

    beforeEach(() => {
      computedTextLengthMock.setup();
    });

    afterEach(() => {
      computedTextLengthMock.restore();
    });
    test('ticks can be partially hidden when there is not enough space', () => {
      computedTextLengthMock.value = 100;
      const { wrapper } = renderMixedChart(
        <MixedLineBarChart
          series={[barSeries]}
          height={250}
          xDomain={['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5']}
          yDomain={[0, 20]}
          xScaleType="categorical"
        />
      );

      expect(wrapper.findXTicks()).toHaveLength(3);
      expect(wrapper.findXTicks()[0].getElement()).toHaveTextContent('Group 1');
      expect(wrapper.findXTicks()[1].getElement()).toHaveTextContent('Group 3');
      expect(wrapper.findXTicks()[2].getElement()).toHaveTextContent('Group 5');
    });
  });

  test('have an emphasized baseline by default if it is part of scale', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} yDomain={[0, 15]} />);
    expect(wrapper.findByClassName(cartesianStyles['axis--emphasized'])).toBeTruthy();
  });

  test('can disable the emphasized baseline', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} emphasizeBaselineAxis={false} />);
    expect(wrapper.findByClassName(cartesianStyles['axis--emphasized'])).toBeFalsy();
  });

  test("do not have an emphasized baseline if it's not part of the scale", () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart series={[lineSeries]} emphasizeBaselineAxis={true} yDomain={[1, 10]} />
    );
    expect(wrapper.findByClassName(cartesianStyles['axis--emphasized'])).toBeFalsy();
  });

  test('have an emphasized baseline when the scale goes beyond zero', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} yDomain={[-10, 10]} />);
    expect(wrapper.findByClassName(cartesianStyles['axis--emphasized'])).toBeTruthy();
  });
});

describe('Legend', () => {
  test('is rendered by default', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} />);
    expect(wrapper.findLegend()).not.toBeNull();
  });

  test('is not rendered when there is no data', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[]} legendTitle="Legend title" />);
    expect(wrapper.findLegend()).toBeNull();
  });

  test('is not rendered when hideLegend is set', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} hideLegend={true} />);
    expect(wrapper.findLegend()).toBeNull();
  });

  test('can have a title', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} legendTitle="Legend title" />);
    expect(wrapper.findLegend()?.findTitle()?.getElement()).toHaveTextContent('Legend title');
    expect(wrapper.findLegend()?.getElement()).toHaveAttribute('aria-label', 'Legend title');
  });

  test('shows same series as the chart', () => {
    const series = [[lineSeries], [thresholdSeries], [lineSeries, thresholdSeries]];

    series.forEach(s => {
      const { wrapper } = renderMixedChart(<MixedLineBarChart series={s} legendTitle="Legend title" />);
      const legendItems = wrapper.findLegend()!.findItems()!;

      expect(legendItems).toHaveLength(s.length);
      legendItems.forEach((legendItem, i) => expect(legendItem.getElement()).toHaveTextContent(s[i].title));
    });
  });

  test('has no highlighted items by default', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries, thresholdSeries]} />);
    expect(wrapper.findLegend()?.findHighlightedItem()).toBeNull();
  });

  test('highlights same segments as the component', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart
        series={[lineSeries, thresholdSeries]}
        highlightedSeries={thresholdSeries}
        onHighlightChange={jest.fn()}
      />
    );
    expect(wrapper.findLegend()?.findHighlightedItem()?.getElement()).toHaveTextContent(thresholdSeries.title);
  });
});

describe('Filter', () => {
  test('is rendered with default filter', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} />);
    expect(wrapper.findFilterContainer()).not.toBeNull();
    expect(wrapper.findDefaultFilter()).not.toBeNull();
  });

  test('is not rendered when hideFilter is set', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} hideFilter={true} />);
    expect(wrapper.findFilterContainer()).toBeNull();
    expect(wrapper.findDefaultFilter()).toBeNull();
  });

  test('contains additional custom filters from the additionalFilters slot', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart series={[lineSeries]} additionalFilters={<span>Custom filter</span>} />
    );
    expect(wrapper.findDefaultFilter()).not.toBeNull();
    expect(wrapper.findFilterContainer()?.getElement()).toHaveTextContent('Custom filter');
  });

  test('can render custom filters without the default one', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart series={[lineSeries]} hideFilter={true} additionalFilters={<span>Custom filter</span>} />
    );
    expect(wrapper.findDefaultFilter()).toBeNull();
    expect(wrapper.findFilterContainer()?.getElement()).toHaveTextContent('Custom filter');
  });

  describe('Dropdown', () => {
    const openDropdown = (wrapper: MixedLineBarChartWrapper) => {
      wrapper.findDefaultFilter()!.openDropdown();
      return wrapper.findDefaultFilter()!.findDropdown()!;
    };

    const defaultData = [lineSeries, thresholdSeries];

    test('contains all data segments', () => {
      const { wrapper } = renderMixedChart(<MixedLineBarChart series={defaultData} />);

      const dropdownWrapper = openDropdown(wrapper);
      expect(dropdownWrapper.getElement()).not.toBeNull();
      expect(dropdownWrapper.findOptions()).toHaveLength(defaultData.length);
      expect(dropdownWrapper.findSelectedOptions()).toHaveLength(defaultData.length);
      defaultData.forEach((segment, i) =>
        expect(dropdownWrapper.findOption(i + 1)?.getElement()).toHaveTextContent(segment.title)
      );
    });

    test('visible segments are controllable', () => {
      const { wrapper, rerender } = renderMixedChart(
        <MixedLineBarChart series={defaultData} visibleSeries={[]} onFilterChange={jest.fn()} />
      );

      const dropdownWrapper = openDropdown(wrapper);
      expect(dropdownWrapper.findOptions()).toHaveLength(defaultData.length);
      expect(dropdownWrapper.findSelectedOptions()).toHaveLength(0);

      rerender(<MixedLineBarChart series={defaultData} visibleSeries={[defaultData[1]]} onFilterChange={jest.fn()} />);
      expect(dropdownWrapper.findOptions()).toHaveLength(defaultData.length);
      expect(dropdownWrapper.findSelectedOptions()).toHaveLength(1);
      expect(dropdownWrapper.findSelectedOptions()[0].getElement()).toHaveTextContent(defaultData[1].title);
    });

    test('allows filtering segments', () => {
      const { wrapper } = renderMixedChart(<MixedLineBarChart series={defaultData} />);

      expect(wrapper.findSeries()).toHaveLength(2);

      wrapper.findDefaultFilter()!.openDropdown();
      wrapper.findDefaultFilter()!.selectOption(1);
      wrapper.findDefaultFilter()!.closeDropdown();
      expect(wrapper.findSeries()).toHaveLength(1);
    });
  });
});

describe('Reserve space', () => {
  const reserveFilterClass = chartWrapperStyles['content--reserve-filter'];
  const reserveLegendClass = chartWrapperStyles['content--reserve-legend'];

  test('by applying the correct minimum height when fitHeight=false', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[]} height={100} fitHeight={false} />);
    expect(wrapper.findByClassName(chartWrapperStyles.content)?.getElement()).toHaveStyle({ minHeight: '100px' });
  });

  test.each([false, true])('when fitHeight=%s plot min-height is explicitly set', fitHeight => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart series={[lineSeries]} height={100} fitHeight={fitHeight} />
    );
    const selector = fitHeight ? cartesianStyles['chart-container-plot-wrapper'] : chartWrapperStyles.content;
    const chartElement = wrapper.findByClassName(selector)!.getElement();
    expect(chartElement.style.minHeight).toBeDefined();
    expect(parseInt(chartElement.style.minHeight)).toBeGreaterThanOrEqual(100);
  });

  test('unless there is a chart showing', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart series={[lineSeries]} />);

    expect(wrapper.findByClassName(reserveFilterClass)).toBeNull();
    expect(wrapper.findByClassName(reserveLegendClass)).toBeNull();
  });

  statusTypes.forEach(statusType => {
    describe(`in ${statusType === 'finished' ? 'noMatch' : statusType} state`, () => {
      const props = {
        statusType,
        series: [lineSeries],
        visibleSeries: statusType === 'finished' ? [] : [lineSeries],
        onFilterChange: jest.fn(),
      };

      test('for legend, unless it is hidden', () => {
        const { wrapper, rerender } = renderMixedChart(<MixedLineBarChart {...props} />);
        expect(wrapper.findByClassName(reserveLegendClass)).not.toBeNull();

        rerender(<MixedLineBarChart {...props} hideLegend={true} />);
        expect(wrapper.findByClassName(reserveLegendClass)).toBeNull();
      });

      test('for filtering when using any type of filtering', () => {
        // Just the default filtering
        const { wrapper, rerender } = renderMixedChart(<MixedLineBarChart {...props} />);
        expectToExist(wrapper.findByClassName(reserveFilterClass), statusType !== 'finished');

        // Default filtering plus custom filters
        rerender(<MixedLineBarChart {...props} additionalFilters={<div />} />);
        expectToExist(wrapper.findByClassName(reserveFilterClass), statusType !== 'finished');

        // Only custom filters
        rerender(<MixedLineBarChart {...props} additionalFilters={<div />} hideFilter={true} />);
        expectToExist(wrapper.findByClassName(reserveFilterClass), statusType !== 'finished');
      });

      test('no filtering whatsoever', () => {
        const { wrapper } = renderMixedChart(<MixedLineBarChart {...props} hideFilter={true} />);
        expect(wrapper.findByClassName(reserveFilterClass)).toBeNull();
      });
    });
  });
});

describe('Details popover', () => {
  const lineChartProps = {
    series: [lineSeries, thresholdSeries] as ReadonlyArray<MixedLineBarChartProps.ChartSeries<string>>,
    height: 250,
    yDomain: [0, 20],
    xScaleType: 'linear' as const,
  };

  const barChartProps = {
    series: [barSeries, { ...barSeries2, type: 'line' }, thresholdSeries] as ReadonlyArray<
      MixedLineBarChartProps.ChartSeries<string>
    >,
    height: 250,
    xDomain: ['Group 1', 'Group 2', 'Group 3', 'Group 4'],
    yDomain: [0, 20],
    xScaleType: 'categorical' as const,
  };

  test('uses the formatters when available', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart
        {...barChartProps}
        series={[{ ...barSeries, valueFormatter: (value, x) => `${value.toFixed(2)} @ ${x}` }]}
        i18nStrings={{ xTickFormatter: value => value.toUpperCase() }}
      />
    );

    wrapper.findApplication()!.focus();

    expect(wrapper.findDetailPopover()).not.toBeNull();
    expect(wrapper.findDetailPopover()?.findHeader()?.getElement()).toHaveTextContent('GROUP 1');
    expect(wrapper.findDetailPopover()?.findContent()?.getElement()).toHaveTextContent('2.00 @ Group 1');
  });

  test('can be shown on focus in a mixed chart', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart {...barChartProps} />);

    wrapper.findApplication()!.focus();

    expect(wrapper.findDetailPopover()).not.toBeNull();
    expect(wrapper.findDetailPopover()?.findHeader()?.getElement()).toHaveTextContent('Group 1');
    expect(wrapper.findDetailPopover()?.findContent()?.getElement()).toHaveTextContent('Bar Series 1');
    expect(wrapper.findDetailPopover()?.findContent()?.getElement()).toHaveTextContent('Bar Series 2');
    expect(wrapper.findDetailPopover()?.findContent()?.getElement()).toHaveTextContent('Threshold 1');
  });

  test('can be pinned and unpinned in a mixed chart', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart {...barChartProps} />);

    wrapper.findApplication()!.focus();

    // Should be visible but unpinned first
    expect(wrapper.findDetailPopover()).not.toBeNull();
    expect(wrapper.findDetailPopover()?.findDismissButton()).toBeNull();

    // Can be pinned
    wrapper.findChart()!.fireEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(wrapper.findDetailPopover()?.findDismissButton()).not.toBeNull();
    expect(wrapper.findByClassName(styles.exiting)).toBeNull();

    // Can be unpinned
    wrapper.findDetailPopover()?.findDismissButton()?.click();
    expect(wrapper.findByClassName(styles.exiting)).not.toBeNull();
  });

  test('delegates focus back to chart when unpinned in a non-grouped chart', async () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart {...lineChartProps} />);

    wrapper.findApplication()!.focus();

    expect(wrapper.findApplication()!.getElement()).toHaveFocus();

    wrapper.findChart()!.fireEvent(new MouseEvent('mousedown', { bubbles: true }));

    wrapper.findDetailPopover()!.findDismissButton()!.keydown(KeyCode.escape);

    await waitFor(() => {
      expect(wrapper.findApplication()!.getElement()).toHaveFocus();
    });
  });

  test('delegates focus back to chart when unpinned in a grouped chart', async () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart {...barChartProps} />);

    wrapper.findApplication()!.focus();

    expect(wrapper.findApplication()!.getElement()).toHaveFocus();

    wrapper.findChart()!.fireEvent(new MouseEvent('mousedown', { bubbles: true }));

    wrapper.findDetailPopover()!.findDismissButton()!.keydown(KeyCode.escape);

    await waitFor(() => {
      expect(wrapper.findApplication()!.getElement()).toHaveFocus();
    });
  });

  test('no highlighted segment when pressing outside', () => {
    const { wrapper } = renderMixedChart(<MixedLineBarChart {...barChartProps} />);

    wrapper.findApplication()!.focus();
    wrapper.findChart()!.fireEvent(new MouseEvent('mousedown', { bubbles: true }));

    expect(wrapper.findByClassName(styles['series--dimmed'])).not.toBeNull();

    wrapper.findDefaultFilter()?.openDropdown();
    expect(wrapper.findByClassName(styles['series--dimmed'])).toBeNull();
  });

  test('can contain custom content in the footer', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart {...barChartProps} detailPopoverFooter={xValue => <span>Details about {xValue}</span>} />
    );

    wrapper.findApplication()!.focus();
    expect(wrapper.findDetailPopover()?.findContent()?.getElement()).toHaveTextContent('Details about Group 1');
  });

  test('highlights relevant x-thresholds when navigating line series', () => {
    const { wrapper } = renderMixedChart(
      <MixedLineBarChart series={[lineSeries, { type: 'threshold', title: 'X-Threshold 1', x: 0 }]} />
    );
    wrapper.findApplication()!.focus();

    expect(wrapper.findDetailPopover()!.findContent()!.getElement().textContent).toContain('Line Series 1');
    expect(wrapper.findDetailPopover()!.findContent()!.getElement().textContent).toContain('X-Threshold 1');
  });

  describe('does not recalculate position when interacting with the popover', () => {
    let spy: jest.SpyInstance | undefined;

    beforeEach(() => {
      spy = jest.spyOn(positions, 'calculatePosition');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    test('on click', () => {
      const { wrapper } = renderMixedChart(<MixedLineBarChart {...barChartProps} />);
      wrapper.findApplication()!.focus();
      spy!.mockClear();
      wrapper.findDetailPopover()!.click();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

test('highlighted series are controllable', () => {
  const { wrapper, rerender } = renderMixedChart(
    <MixedLineBarChart series={[lineSeries, thresholdSeries]} highlightedSeries={lineSeries} />
  );

  expect(wrapper.findHighlightedSeries()?.getElement()).toEqual(wrapper.findSeries()[0].getElement());
  expect(wrapper.findLegend()?.findHighlightedItem()?.getElement()).toEqual(
    wrapper.findLegend()?.findItems()[0].getElement()
  );

  rerender(<MixedLineBarChart series={[lineSeries, thresholdSeries]} highlightedSeries={thresholdSeries} />);
  expect(wrapper.findHighlightedSeries()?.getElement()).toEqual(wrapper.findSeries()[1].getElement());
  expect(wrapper.findLegend()?.findHighlightedItem()?.getElement()).toEqual(
    wrapper.findLegend()?.findItems()[1].getElement()
  );
});
