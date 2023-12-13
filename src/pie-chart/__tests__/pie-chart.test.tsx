// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';
import createWrapper, { ElementWrapper } from '../../../lib/components/test-utils/dom';
import { PieChartWrapper } from '../../../lib/components/test-utils/dom';
import PieChart, { PieChartProps } from '../../../lib/components/pie-chart';
import styles from '../../../lib/components/pie-chart/styles.css.js';
import chartWrapperStyles from '../../../lib/components/internal/components/chart-wrapper/styles.css.js';
import * as colors from '../../../lib/design-tokens';
import { act } from 'react-dom/test-utils';
import TestI18nProvider from '../../../lib/components/i18n/testing';

const variants: Array<PieChartProps<PieChartProps.Datum>['variant']> = ['pie', 'donut'];
const sizes: Array<PieChartProps<PieChartProps.Datum>['size']> = ['small', 'medium', 'large'];
const statusTypes: Array<PieChartProps<PieChartProps.Datum>['statusType']> = ['finished', 'loading', 'error'];

function renderPieChart(jsx: React.ReactElement) {
  const { container, rerender } = render(jsx);
  return {
    rerender,
    wrapper: createWrapper(container.parentElement!).findPieChart()!,
  };
}

function expectToExist(wrapper: ElementWrapper | null, shouldExist: boolean) {
  if (shouldExist) {
    expect(wrapper).not.toBeNull();
  } else {
    expect(wrapper).toBeNull();
  }
}

const defaultData: Array<PieChartProps.Datum> = [
  {
    title: 'Segment 1',
    value: 20,
  },
  {
    title: 'Segment 2',
    value: 10,
  },
  {
    title: 'Segment 3',
    value: 8,
  },
];

const defaultSegmentDescription: PieChartProps.SegmentDescriptionFunction = datum =>
  datum.title === 'Segment 2' ? 'Segment description' : '';

const dataWithZero: Array<PieChartProps.Datum> = [
  { title: 'Segment 1', value: 20 },
  { title: 'Segment 2', value: 10 },
  { title: 'Segment 3', value: 0 },
];

// Mock support for CSS Custom Properties in Jest so that we assign the correct colors.
// Transformation to fallback colors for browsers that don't support them are covered by the `parseCssVariable` utility.
const originalCSS = window.CSS;
beforeEach(() => {
  window.CSS.supports = () => true;
});
afterEach(() => {
  window.CSS = originalCSS;
});

describe('Chart container', () => {
  test('can receive ARIA labels', () => {
    const { wrapper, rerender } = renderPieChart(<PieChart data={defaultData} />);
    expect(wrapper.findChart()?.getElement()).not.toHaveAttribute('aria-label');
    expect(wrapper.findChart()?.getElement()).not.toHaveAttribute('aria-labelledby');

    rerender(<PieChart data={defaultData} ariaLabel="Chart label" />);
    expect(wrapper.findChart()?.getElement()).toHaveAttribute('aria-label', 'Chart label');

    rerender(<PieChart data={defaultData} ariaLabelledby="label-id" />);
    expect(wrapper.findChart()?.getElement()).toHaveAttribute('aria-labelledby', 'label-id');
  });
});

describe('i18nStrings', () => {
  test('are applied directly', () => {
    const i18nStrings: PieChartProps.I18nStrings = {
      detailsValue: 'Value',
      detailsPercentage: 'Percentage',
      filterLabel: 'Filter label',
      filterPlaceholder: 'Filter placeholder',
      filterSelectedAriaLabel: '(selected)',
      legendAriaLabel: 'Legend',
      detailPopoverDismissAriaLabel: 'dismiss',
      chartAriaRoleDescription: 'pie chart',
      segmentAriaRoleDescription: 'segment',
    };
    const { wrapper } = renderPieChart(<PieChart data={defaultData} i18nStrings={i18nStrings} />);

    expect(wrapper.findChart()?.getElement()).toHaveAttribute(
      'aria-roledescription',
      i18nStrings.chartAriaRoleDescription
    );
    expect(wrapper.findSegments()[0].getElement()).toHaveAttribute(
      'aria-roledescription',
      i18nStrings.segmentAriaRoleDescription
    );

    expect(wrapper.findFilterContainer()?.findFormField()?.findLabel()?.getElement()).toHaveTextContent(
      i18nStrings.filterLabel!
    );
    expect(wrapper.findFilterContainer()?.findMultiselect()?.findTrigger()?.getElement()).toHaveTextContent(
      i18nStrings.filterPlaceholder!
    );

    expect(wrapper.findLegend()?.getElement()).toHaveAttribute('aria-label', i18nStrings.legendAriaLabel);

    // Open and pin one popover
    wrapper.findApplication()!.focus();
    wrapper.findApplication()!.keydown(KeyCode.enter);

    const detailPopover = wrapper.findDetailPopover();
    expect(detailPopover?.findDismissButton()?.getElement()).toHaveAttribute(
      'aria-label',
      i18nStrings.detailPopoverDismissAriaLabel
    );
    expect(detailPopover?.getElement()).toHaveTextContent(i18nStrings.detailsValue!);
    expect(detailPopover?.getElement()).toHaveTextContent(i18nStrings.detailsPercentage!);
  });

  test('are applied from i18n provider', () => {
    const { wrapper } = renderPieChart(
      <TestI18nProvider
        messages={{
          '[charts]': {
            'i18nStrings.filterLabel': 'Custom filter label',
            'i18nStrings.filterPlaceholder': 'Custom filter placeholder',
            'i18nStrings.legendAriaLabel': 'Custom legend',
            'i18nStrings.chartAriaRoleDescription': 'Custom chart',
          },
          'pie-chart': {
            'i18nStrings.detailsValue': 'Custom value',
            'i18nStrings.detailsPercentage': 'Custom percentage',
            'i18nStrings.segmentAriaRoleDescription': 'Custom segment',
          },
        }}
      >
        <PieChart data={defaultData} />
      </TestI18nProvider>
    );

    expect(wrapper.findChart()?.getElement()).toHaveAttribute('aria-roledescription', 'Custom chart');
    expect(wrapper.findSegments()[0].getElement()).toHaveAttribute('aria-roledescription', 'Custom segment');

    expect(wrapper.findFilterContainer()!.findFormField()?.findLabel()?.getElement()).toHaveTextContent(
      'Custom filter label'
    );
    expect(wrapper.findFilterContainer()!.findMultiselect()?.findTrigger()?.getElement()).toHaveTextContent(
      'Custom filter placeholder'
    );

    expect(wrapper.findLegend()!.getElement()).toHaveAttribute('aria-label', 'Custom legend');

    // Open and pin one popover
    wrapper.findApplication()!.focus();
    wrapper.findApplication()!.keydown(KeyCode.enter);

    const detailPopover = wrapper.findDetailPopover();
    expect(detailPopover!.getElement()).toHaveTextContent('Custom value');
    expect(detailPopover!.getElement()).toHaveTextContent('Custom percentage');
  });
});

describe('Legend', () => {
  test('is rendered by default', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    expect(wrapper.findLegend()).not.toBeNull();
  });

  test('is not rendered when there is no data', () => {
    const { wrapper } = renderPieChart(<PieChart data={[]} />);
    expect(wrapper.findLegend()).toBeNull();
  });

  test('is not rendered when hideLegend is set', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} hideLegend={true} />);
    expect(wrapper.findLegend()).toBeNull();
  });

  test('can have a title', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} legendTitle="Legend title" />);
    expect(wrapper.findLegend()?.findTitle()?.getElement()).toHaveTextContent('Legend title');
    expect(wrapper.findLegend()?.getElement()).toHaveAttribute('aria-label', 'Legend title');
  });

  test('shows same segments as the chart', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} legendTitle="Legend title" />);
    const legendItems = wrapper.findLegend()!.findItems()!;

    expect(legendItems).toHaveLength(defaultData.length);
    defaultData.forEach((segment, i) => expect(legendItems[i].getElement()).toHaveTextContent(segment.title));
  });

  test('has no highlighted items by default', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    expect(wrapper.findLegend()?.findHighlightedItem()).toBeNull();
  });

  test('highlights same segments as the component', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} highlightedSegment={defaultData[1]} />);
    expect(wrapper.findLegend()?.findHighlightedItem()?.getElement()).toHaveTextContent(defaultData[1].title);
  });

  test('has item for segment with zero value', () => {
    const { wrapper } = renderPieChart(<PieChart data={dataWithZero} />);
    expect(wrapper.findLegend()?.findItems()).toHaveLength(dataWithZero.length);
  });

  test('hovering over segment with zero value highlights it in legend', () => {
    const { wrapper } = renderPieChart(<PieChart data={dataWithZero} highlightedSegment={dataWithZero[2]} />);
    expect(wrapper.findLegend()?.findHighlightedItem()?.getElement()).toHaveTextContent(dataWithZero[2].title);
  });
});

describe('Filter container', () => {
  test('is rendered with default filter', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    expect(wrapper.findFilterContainer()).not.toBeNull();
    expect(wrapper.findDefaultFilter()).not.toBeNull();
  });

  test('is not rendered when hideFilter is set', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} hideFilter={true} />);
    expect(wrapper.findFilterContainer()).toBeNull();
    expect(wrapper.findDefaultFilter()).toBeNull();
  });

  test('contains additional custom filters from the additionalFilters slot', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} additionalFilters={<span>Custom filter</span>} />);
    expect(wrapper.findDefaultFilter()).not.toBeNull();
    expect(wrapper.findFilterContainer()?.getElement()).toHaveTextContent('Custom filter');
  });

  test('can render custom filters without the default one', () => {
    const { wrapper } = renderPieChart(
      <PieChart data={defaultData} hideFilter={true} additionalFilters={<span>Custom filter</span>} />
    );
    expect(wrapper.findDefaultFilter()).toBeNull();
    expect(wrapper.findFilterContainer()?.getElement()).toHaveTextContent('Custom filter');
  });

  describe('Dropdown', () => {
    const openDropdown = (wrapper: PieChartWrapper) => {
      wrapper.findDefaultFilter()?.openDropdown();
      return wrapper.findDefaultFilter()!.findDropdown()!;
    };

    test('contains all data segments', () => {
      const { wrapper } = renderPieChart(<PieChart data={defaultData} />);

      const dropdownWrapper = openDropdown(wrapper);
      expect(dropdownWrapper.getElement()).not.toBeNull();
      expect(dropdownWrapper.findOptions()).toHaveLength(defaultData.length);
      expect(dropdownWrapper.findSelectedOptions()).toHaveLength(defaultData.length);
      defaultData.forEach((segment, i) =>
        expect(dropdownWrapper.findOption(i + 1)?.getElement()).toHaveTextContent(segment.title)
      );
    });

    test('visible segments are controllable', () => {
      const { wrapper, rerender } = renderPieChart(<PieChart data={defaultData} visibleSegments={[]} />);

      const dropdownWrapper = openDropdown(wrapper);
      expect(dropdownWrapper.findOptions()).toHaveLength(defaultData.length);
      expect(dropdownWrapper.findSelectedOptions()).toHaveLength(0);

      rerender(<PieChart data={defaultData} visibleSegments={[defaultData[1]]} />);
      expect(dropdownWrapper.findOptions()).toHaveLength(defaultData.length);
      expect(dropdownWrapper.findSelectedOptions()).toHaveLength(1);
      expect(dropdownWrapper.findSelectedOptions()[0].getElement()).toHaveTextContent(defaultData[1].title);
    });

    test('highlighted segment is controllable', () => {
      const { wrapper, rerender } = renderPieChart(<PieChart data={defaultData} highlightedSegment={defaultData[1]} />);

      expect(wrapper.findHighlightedSegment()?.getElement()).toEqual(wrapper.findSegments()[1].getElement());
      expect(wrapper.findLegend()?.findHighlightedItem()?.getElement()).toEqual(
        wrapper.findLegend()?.findItems()[1].getElement()
      );

      rerender(<PieChart data={defaultData} highlightedSegment={defaultData[2]} />);
      expect(wrapper.findHighlightedSegment()?.getElement()).toEqual(wrapper.findSegments()[2].getElement());
      expect(wrapper.findLegend()?.findHighlightedItem()?.getElement()).toEqual(
        wrapper.findLegend()?.findItems()[2].getElement()
      );
    });

    test('contains segments with zero values', () => {
      const { wrapper } = renderPieChart(<PieChart data={dataWithZero} />);

      const dropdownWrapper = openDropdown(wrapper);
      expect(dropdownWrapper.findOptions()).toHaveLength(dataWithZero.length);
      expect(dropdownWrapper.findSelectedOptions()).toHaveLength(dataWithZero.length);
    });
  });
});

describe('States', () => {
  const stateProps = {
    empty: 'No data',
    noMatch: 'No matches',
    loadingText: 'Loading',
    errorText: 'Error',
    recoveryText: 'Recover',
  };

  test('empty state is shown when there is no data', () => {
    const { wrapper } = renderPieChart(<PieChart {...stateProps} data={[]} />);
    expect(wrapper.findStatusContainer()?.getElement()).toHaveTextContent('No data');
  });

  test('empty state shows no other components', () => {
    const { wrapper } = renderPieChart(<PieChart {...stateProps} data={[]} />);
    expect(wrapper.findLegend()).toBeNull();
    expect(wrapper.findFilterContainer()).toBeNull();
  });

  test('no match state is shown when all segments are filtered out', () => {
    const { wrapper } = renderPieChart(<PieChart {...stateProps} data={defaultData} visibleSegments={[]} />);
    expect(wrapper.findStatusContainer()?.getElement()).toHaveTextContent('No matches');
  });

  test('loading state is shown when loading data', () => {
    const { wrapper } = renderPieChart(<PieChart {...stateProps} data={[]} statusType="loading" />);
    expect(wrapper.findStatusContainer()?.getElement()).toHaveTextContent('Loading');
  });

  test('error state is shown when error occurred', () => {
    const { wrapper } = renderPieChart(
      <PieChart {...stateProps} data={[]} statusType="error" onRecoveryClick={() => {}} />
    );
    expect(wrapper.findStatusContainer()?.getElement()).toHaveTextContent('Error');
    expect(wrapper.findStatusContainer()?.getElement()).toHaveTextContent('Recover');
  });

  test('empty state is shown when chart contains only zero value segments', () => {
    const { wrapper } = renderPieChart(<PieChart {...stateProps} data={[{ title: 'Segment', value: 0 }]} />);
    expect(wrapper.findStatusContainer()?.getElement()).toHaveTextContent('No data');
  });

  test('no match state is shown when all segments except zero-value segments are filtered out', () => {
    const { wrapper } = renderPieChart(
      <PieChart {...stateProps} data={dataWithZero} visibleSegments={[dataWithZero[2]]} />
    );
    expect(wrapper.findStatusContainer()?.getElement()).toHaveTextContent('No matches');
  });
});

describe('Segments', () => {
  variants.forEach(variant =>
    sizes.forEach(size => {
      describe(`variant "${variant}" with size "${size}"`, () => {
        test('are displayed for each data point', () => {
          const { wrapper } = renderPieChart(<PieChart data={defaultData} variant={variant} size={size} />);
          expect(wrapper.findSegments()).toHaveLength(defaultData.length);
        });

        test('are not displayed when data is empty', () => {
          const { wrapper } = renderPieChart(<PieChart data={[]} variant={variant} size={size} />);
          expect(wrapper.findSegments()).toHaveLength(0);
        });
      });
    })
  );

  test('have correct ARIA semantics', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);

    wrapper.findSegments().forEach((segment, i) => {
      expect(segment.getElement()).toHaveAttribute('role', 'button');
      expect(segment.getElement()).toHaveAttribute('aria-label', `${defaultData[i].title} (${defaultData[i].value})`);
    });
  });

  test('use categorical color palette by default', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    const segments = wrapper.findSegments();

    expect(segments[0].find('path')?.getElement()).toHaveAttribute('fill', colors.colorChartsPaletteCategorical1);
    expect(segments[1].find('path')?.getElement()).toHaveAttribute('fill', colors.colorChartsPaletteCategorical2);
    expect(segments[2].find('path')?.getElement()).toHaveAttribute('fill', colors.colorChartsPaletteCategorical3);
  });

  test('can use custom colors', () => {
    const coloredData = [
      {
        title: 'Segment 1',
        value: 20,
        color: 'red',
      },
      {
        title: 'Segment 2',
        value: 10,
        color: 'blue',
      },
      {
        title: 'Segment 3',
        value: 8,
        color: '#dedeaa',
      },
    ];
    const { wrapper } = renderPieChart(<PieChart data={coloredData} />);

    wrapper
      .findSegments()
      .forEach((segment, i) =>
        expect(segment.find('path')?.getElement()).toHaveAttribute('fill', coloredData[i].color)
      );
  });

  test('CSS color variables are changed to fallback values in unsupported browsers', () => {
    window.CSS.supports = () => false;

    const { wrapper } = renderPieChart(
      <PieChart data={[{ title: 'Segment', value: 1, color: 'var(--mycolor, red)' }]} />
    );
    expect(wrapper.findSegments()[0].find('path')?.getElement()).toHaveAttribute('fill', 'red');
  });

  test('nothing is highlighted by default', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    expect(wrapper.findHighlightedSegment()).toBeNull();
  });

  test('highlighted segmented can be controlled', () => {
    const { wrapper, rerender } = renderPieChart(<PieChart data={defaultData} highlightedSegment={defaultData[1]} />);
    expect(wrapper.findHighlightedSegment()?.getElement()).toEqual(wrapper.findSegments()[1].getElement());

    rerender(<PieChart data={defaultData} highlightedSegment={defaultData[0]} />);
    expect(wrapper.findHighlightedSegment()?.getElement()).toEqual(wrapper.findSegments()[0].getElement());

    rerender(<PieChart data={defaultData} highlightedSegment={null} />);
    expect(wrapper.findHighlightedSegment()).toBeNull();
  });

  test('focusing the first segment highlights it', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    wrapper.findApplication()!.focus();

    expect(wrapper.findHighlightedSegment()?.getElement()).toBe(wrapper.findSegments()[0].getElement());
  });

  test('not shown for zero value segments', () => {
    const { wrapper } = renderPieChart(<PieChart data={dataWithZero} />);
    expect(wrapper.findSegments()).toHaveLength(2);
  });

  test('no highlighted segment for zero value segments', () => {
    const { wrapper } = renderPieChart(<PieChart data={dataWithZero} highlightedSegment={dataWithZero[2]} />);
    expect(wrapper.findHighlightedSegment()).toBeNull();
  });

  test('no highlighted segment when pressing outside', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    act(() => {
      fireEvent.mouseDown(wrapper!.findSegments()[0].getElement());
    });
    expect(wrapper.findHighlightedSegment()).not.toBeNull();

    wrapper.findDefaultFilter()?.openDropdown();
    expect(wrapper.findHighlightedSegment()).toBeNull();
  });
});

describe('Details popover', () => {
  test('not shown by default', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    expect(wrapper.findDetailPopover()).toBeNull();
  });

  test('not shown when programatically setting the highlighted segment', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} highlightedSegment={defaultData[0]} />);
    expect(wrapper.findDetailPopover()).toBeNull();
  });

  test('focusing the first segment shows details popover', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    wrapper.findApplication()!.focus();

    const detailPopover = wrapper.findDetailPopover();
    expect(detailPopover?.findHeader()?.getElement()).toHaveTextContent(defaultData[0].title);
    expect(detailPopover?.findContent()?.getElement()).toHaveTextContent('' + defaultData[0].value);
  });

  test('blurring the chart hides the details popover', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    wrapper.findApplication()!.focus();
    expect(wrapper.findDetailPopover()).toBeTruthy();
    wrapper.findApplication()!.blur();
    expect(wrapper.findDetailPopover()).toBeNull();
  });

  test('pressing escape closes the popover', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    wrapper.findApplication()!.focus();

    const detailPopover = wrapper.findDetailPopover();
    expect(detailPopover?.findHeader()?.getElement()).toHaveTextContent(defaultData[0].title);

    act(() => {
      fireEvent.mouseOver(wrapper!.findSegments()[0].getElement());
    });

    act(() => {
      fireEvent.keyDown(document, { key: 'Escape' });
    });

    expect(wrapper.findDetailPopover()).toBeNull();

    act(() => {
      fireEvent.mouseOver(wrapper!.findSegments()[0].getElement());
    });

    expect(wrapper.findDetailPopover()).toBeNull();
  });

  test('allow mouse to be over details popover ', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    wrapper.findApplication()!.focus();

    const detailPopover = wrapper.findDetailPopover();
    expect(detailPopover?.findHeader()?.getElement()).toHaveTextContent(defaultData[0].title);

    act(() => {
      fireEvent.mouseOver(wrapper!.findSegments()[0].getElement());
    });

    expect(detailPopover?.findHeader()?.getElement()).toHaveTextContent(defaultData[0].title);
  });

  test('allow mouse to be move between segment and popover ', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    fireEvent.mouseOver(wrapper!.findSegments()[0].getElement());

    expect(wrapper.findDetailPopover()).toBeTruthy();

    fireEvent.mouseOut(wrapper.findDetailPopover()!.getElement(), {
      relatedTarget: wrapper!.findSegments()[0].getElement(),
    });

    expect(wrapper.findDetailPopover()).toBeTruthy();

    fireEvent.mouseOut(wrapper!.findSegments()[0].getElement(), {
      relatedTarget: wrapper.findDetailPopover()!.getElement(),
    });

    expect(wrapper.findDetailPopover()).toBeTruthy();

    fireEvent.mouseOut(wrapper!.findSegments()[0].getElement(), { relatedTarget: window });

    expect(wrapper.findDetailPopover()).toBeFalsy();
  });

  test('close popover when mouse leaves it ', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    wrapper.findApplication()!.focus();

    const detailPopover = wrapper.findDetailPopover();
    expect(detailPopover?.findHeader()?.getElement()).toHaveTextContent(defaultData[0].title);

    act(() => {
      fireEvent.mouseLeave(wrapper!.findDetailPopover()!.getElement(), {
        relatedTarget: wrapper.findApplication()?.getElement(),
      });
    });

    expect(wrapper.findDetailPopover()).toBeNull();
  });

  test('shows value and percentage by default', () => {
    const { wrapper } = renderPieChart(
      <PieChart data={defaultData} i18nStrings={{ detailsValue: 'Value', detailsPercentage: 'Percentage' }} />
    );
    wrapper.findApplication()!.focus();

    const detailPopover = wrapper.findDetailPopover()?.findContent()?.getElement();
    expect(detailPopover).toHaveTextContent('Value20');
    expect(detailPopover).toHaveTextContent('Percentage53%');
  });

  test('has dismiss button when pinned', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    wrapper.findApplication()!.focus();
    wrapper.findApplication()!.keydown(KeyCode.enter);

    expect(createWrapper(wrapper.getElement()).findPopover()?.findDismissButton()).not.toBeNull();
  });

  test('dismisses when clicking same segment', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);

    fireEvent.mouseDown(wrapper.findSegments()[0].getElement());
    expect(wrapper.findDetailPopover()).toBeTruthy();

    fireEvent.mouseDown(wrapper.findSegments()[0].getElement());
    expect(wrapper.findDetailPopover()).toBeNull();
  });

  test('stays open with mouseleave events when pinned', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);

    fireEvent.mouseDown(wrapper.findSegments()[0].getElement());
    expect(wrapper.findDetailPopover()).toBeTruthy();

    fireEvent.mouseOut(wrapper.findSegments()[0].getElement());
    expect(wrapper.findDetailPopover()).toBeTruthy();
  });

  test('can be dismissed with click on the dismiss button', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    wrapper.findSegments()[1].click();
    wrapper.findDetailPopover()?.findDismissButton()?.click();

    expect(wrapper.findDetailPopover()).toBeNull();
  });

  test('pressing spase on a focused segment opens the popover', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    wrapper.findSegments()[1].click();
    wrapper.findDetailPopover()?.findDismissButton()?.click();

    wrapper.findApplication()!.keydown(KeyCode.space);

    expect(createWrapper(wrapper.getElement()).findPopover()?.findDismissButton()).not.toBeNull();
  });

  test('details popover can be customized', () => {
    const { wrapper } = renderPieChart(
      <PieChart
        data={defaultData}
        detailPopoverContent={datum => [
          { key: 'My value', value: datum.value },
          { key: 'Custom', value: 'Static content' },
        ]}
      />
    );
    wrapper.findApplication()!.focus();

    const detailPopover = wrapper.findDetailPopover();
    expect(detailPopover?.findHeader()?.getElement()).toHaveTextContent(defaultData[0].title);
    expect(detailPopover?.findContent()?.getElement()).toHaveTextContent('' + defaultData[0].value);
    expect(detailPopover?.findContent()?.getElement()).toHaveTextContent('My value');
    expect(detailPopover?.findContent()?.getElement()).toHaveTextContent('Custom');
    expect(detailPopover?.findContent()?.getElement()).toHaveTextContent('Static content');
  });

  test('can contain custom content in the footer', () => {
    const { wrapper } = renderPieChart(
      <PieChart data={defaultData} detailPopoverFooter={segment => <span>Details about {segment.title}</span>} />
    );
    wrapper.findApplication()!.focus();

    const detailPopover = wrapper.findDetailPopover();
    expect(detailPopover?.findContent()?.getElement()).toHaveTextContent(`Details about ${defaultData[0].title}`);
  });
});

describe('Labels', () => {
  test('are displayed by default', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);
    expect(wrapper.findSegmentLabels()).toHaveLength(defaultData.length);
  });

  test('contain titles and optional descriptions', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} segmentDescription={defaultSegmentDescription} />);

    wrapper.findSegmentLabels().forEach((label, i) => {
      expect(label.getElement()).toHaveTextContent(defaultData[i].title);
      const description = defaultSegmentDescription(defaultData[i], 0);
      if (description) {
        expect(label.getElement()).toHaveTextContent(description);
      }
    });
  });

  test('can be hidden completely', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} hideTitles={true} hideDescriptions={true} />);
    expect(wrapper.findSegmentLabels()).toHaveLength(0);
  });

  test('can hide descriptions', () => {
    const { wrapper } = renderPieChart(
      <PieChart data={defaultData} hideDescriptions={true} segmentDescription={defaultSegmentDescription} />
    );
    wrapper.findSegmentLabels().forEach((label, i) => {
      expect(label.getElement()).not.toHaveTextContent(defaultSegmentDescription(defaultData[i], 0));
    });
  });

  test('can hide titles', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} hideTitles={true} />);
    wrapper.findSegmentLabels().forEach((label, i) => {
      expect(label.getElement()).not.toHaveTextContent(defaultData[i].title);
    });
  });
});

describe('Inner content', () => {
  const innerContentProps = {
    variant: 'donut' as const,
    data: defaultData,
    innerMetricValue: 'Header',
    innerMetricDescription: 'Description',
  };

  test('is not available for the pie variant', () => {
    const { wrapper } = renderPieChart(<PieChart {...innerContentProps} variant="pie" />);
    expect(wrapper.findInnerContent()).toBeNull();
  });

  test('exclusive to the donut variant', () => {
    const { wrapper } = renderPieChart(<PieChart {...innerContentProps} />);
    expect(wrapper.findInnerContent()?.getElement()).toHaveTextContent(innerContentProps.innerMetricValue);
    expect(wrapper.findInnerContent()?.getElement()).toHaveTextContent(innerContentProps.innerMetricDescription);
  });

  test('serves as aria-described content', () => {
    const { wrapper } = renderPieChart(<PieChart {...innerContentProps} />);
    const id = wrapper.findInnerContent()?.getElement().id;
    expect(id).toBeTruthy();
    expect(wrapper.findChart()?.getElement()).toHaveAttribute('aria-describedby', id);
  });

  test('inner description is shown in all sizes except small', () => {
    const { wrapper, rerender } = renderPieChart(<PieChart {...innerContentProps} />);

    sizes.forEach(size => {
      rerender(<PieChart {...innerContentProps} size={size} />);

      if (size === 'small') {
        expect(wrapper.findInnerContent()?.getElement()).not.toHaveTextContent(
          innerContentProps.innerMetricDescription
        );
      } else {
        expect(wrapper.findInnerContent()?.getElement()).toHaveTextContent(innerContentProps.innerMetricDescription);
      }
    });
  });
});

describe('Reserve space', () => {
  const reserveFilterClass = chartWrapperStyles['content--reserve-filter'];
  const reserveLegendClass = chartWrapperStyles['content--reserve-legend'];

  test('by applying the correct size class', () => {
    const { wrapper, rerender } = renderPieChart(<PieChart data={defaultData} />);

    sizes.forEach(size => {
      rerender(<PieChart data={defaultData} size={size} />);
      expect(wrapper.findByClassName(styles[`content--${size}`])).not.toBeNull();
    });
  });

  test('unless there is a chart showing', () => {
    const { wrapper } = renderPieChart(<PieChart data={defaultData} />);

    expect(wrapper.findByClassName(reserveFilterClass)).toBeNull();
    expect(wrapper.findByClassName(reserveLegendClass)).toBeNull();
  });

  statusTypes.forEach(statusType => {
    describe(`in ${statusType === 'finished' ? 'noMatch' : statusType} state`, () => {
      const props = {
        statusType,
        data: defaultData,
        visibleSegments: statusType === 'finished' ? [] : defaultData,
      };

      test('for legend, unless it is hidden', () => {
        const { wrapper, rerender } = renderPieChart(<PieChart {...props} />);
        expect(wrapper.findByClassName(reserveLegendClass)).not.toBeNull();

        rerender(<PieChart {...props} hideLegend={true} />);
        expect(wrapper.findByClassName(reserveLegendClass)).toBeNull();
      });

      test('for filtering when using any type of filtering', () => {
        // Just the default filtering
        const { wrapper, rerender } = renderPieChart(<PieChart {...props} />);
        expectToExist(wrapper.findByClassName(reserveFilterClass), statusType !== 'finished');

        // Default filtering plus custom filters
        rerender(<PieChart {...props} additionalFilters={<div />} />);
        expectToExist(wrapper.findByClassName(reserveFilterClass), statusType !== 'finished');

        // Only custom filters
        rerender(<PieChart {...props} additionalFilters={<div />} hideFilter={true} />);
        expectToExist(wrapper.findByClassName(reserveFilterClass), statusType !== 'finished');
      });

      test('no filtering whatsoever', () => {
        const { wrapper } = renderPieChart(<PieChart {...props} hideFilter={true} />);
        expect(wrapper.findByClassName(reserveFilterClass)).toBeNull();
      });
    });
  });
});
