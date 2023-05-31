// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { render, act } from '@testing-library/react';
import { ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import { KeyCode } from '@cloudscape-design/test-utils-core/dist/utils';
import ChartLegend from '../../../../../lib/components/internal/components/chart-legend';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import styles from '../../../../../lib/components/internal/components/chart-legend/styles.selectors.js';

const series = [
  { label: 'Chocolate', color: 'chocolate', type: 'line', datum: { title: 's1' } },
  { label: 'Apples', color: 'red', type: 'rectangle', datum: { title: 's2' } },
  { label: 'Oranges', color: 'orange', type: 'rectangle', datum: { title: 's3' } },
] as const;

function getTextContent(wrapper: ElementWrapper) {
  return wrapper.getElement().textContent!.trim();
}

function renderChartLegend() {
  function App() {
    const [highlightedSeries, setHighlightedSeries] = useState<any>(series[1].datum);
    const onChange = (value: any) => {
      setHighlightedSeries(value);
    };
    return <ChartLegend series={series} highlightedSeries={highlightedSeries} onHighlightChange={onChange} />;
  }
  const { container } = render(<App />);
  const wrapper = createWrapper(container).findByClassName(styles.root)!;

  const focus = () =>
    act(() => {
      wrapper.find('[tabindex="0"]')?.focus();
    });

  const mouseover = (index: number) =>
    act(() => {
      wrapper.findAllByClassName(styles.marker)[index]!.fireEvent(new MouseEvent('mouseleave', { bubbles: true }));
      wrapper.findAllByClassName(styles.marker)[index]!.fireEvent(new MouseEvent('mouseover', { bubbles: true }));
    });

  const pressLeft = () =>
    act(() => {
      wrapper.keyup(KeyCode.left);
      wrapper.keydown(KeyCode.left);
    });

  const pressRight = () =>
    act(() => {
      wrapper.keyup(KeyCode.right);
      wrapper.keydown(KeyCode.right);
    });

  const findAllLabels = () => wrapper.findAllByClassName(styles.marker).map(getTextContent);
  const findHighlightedLabels = () => wrapper.findAllByClassName(styles['marker--highlighted']).map(getTextContent);
  const findDimmedLabels = () => wrapper.findAllByClassName(styles['marker--dimmed']).map(getTextContent);
  const findFocusedLabel = () =>
    document.activeElement && document.activeElement !== document.body
      ? document.activeElement.textContent?.trim()
      : undefined;

  return {
    wrapper,
    focus,
    mouseover,
    pressLeft,
    pressRight,
    findAllLabels,
    findHighlightedLabels,
    findDimmedLabels,
    findFocusedLabel,
  };
}

describe('Chart legend', () => {
  test('should pass options', () => {
    const legend = renderChartLegend();

    expect(legend.findAllLabels()).toEqual(series.map(s => s.label));
    expect(legend.findHighlightedLabels()).toEqual([series[1].label]);
    expect(legend.findDimmedLabels()).toEqual([series[0].label, series[2].label]);
    expect(legend.findFocusedLabel()).toEqual(undefined);
  });

  test('should highlight on mouseover', () => {
    const legend = renderChartLegend();

    legend.focus();
    legend.mouseover(2);

    expect(legend.findHighlightedLabels()).toEqual([series[2].label]);
    expect(legend.findDimmedLabels()).toEqual([series[0].label, series[1].label]);
    expect(legend.findFocusedLabel()).toEqual(series[1].label);
  });

  test('should highlight elements to the right', () => {
    const legend = renderChartLegend();

    legend.focus();
    legend.pressRight();
    expect(legend.findFocusedLabel()).toEqual(series[2].label);

    legend.pressRight();
    expect(legend.findFocusedLabel()).toEqual(series[0].label);
  });

  test('should highlight elements to the left', () => {
    const legend = renderChartLegend();

    legend.focus();
    legend.pressLeft();
    expect(legend.findFocusedLabel()).toEqual(series[0].label);

    legend.pressLeft();
    expect(legend.findFocusedLabel()).toEqual(series[2].label);
  });

  test('should set aria-pressed as true when the button is selected', () => {
    const legend = renderChartLegend();

    legend.focus();
    legend.pressLeft();
    expect(legend.wrapper.find('[role="button"]')!.getElement().getAttribute('aria-pressed')).toBe('true');
    legend.pressLeft();
    expect(legend.wrapper.find('[role="button"]')!.getElement().getAttribute('aria-pressed')).toBe('false');
  });
});

describe('i18n', () => {
  test('ariaRole', () => {
    const legend = renderChartLegend();

    expect(legend.findAllLabels()).toEqual(series.map(s => s.label));
    expect(legend.findHighlightedLabels()).toEqual([series[1].label]);
    expect(legend.findDimmedLabels()).toEqual([series[0].label, series[2].label]);
    expect(legend.findFocusedLabel()).toEqual(undefined);
  });
});
