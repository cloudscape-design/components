// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import ChartFilter, { ChartFilterProps } from '../../../../../lib/components/internal/components/chart-filter';
import createWrapper from '../../../../../lib/components/test-utils/dom';

import tokenGroupStyles from '../../../../../lib/components/token-group/styles.selectors.js';

const datum0 = {};
const datum1 = {};

const series = [
  { label: 'Chocolate', color: 'chocolate', type: 'line', datum: datum0 },
  { label: 'Apples', color: 'red', type: 'rectangle', datum: datum1 },
] as const;

const i18nStrings = {
  filterLabel: 'Filter displayed data',
  filterPlaceholder: 'Filter data',
};

const defaultProps = {
  series,
  i18nStrings,
  selectedSeries: [datum0],
  onChange: jest.fn(),
};

function renderChartFilter<T>(props: Partial<ChartFilterProps<T>> = {}) {
  const renderProps = { ...defaultProps, ...props };
  const { container } = render(<ChartFilter<any> {...renderProps} />);
  return createWrapper(container);
}

describe('Chart filter', () => {
  test('should pass options', () => {
    const wrapper = renderChartFilter();
    wrapper.findMultiselect()!.openDropdown();
    const dropdownWrapper = wrapper.findMultiselect()!.findDropdown()!;

    const labels = dropdownWrapper.findOptions().map(o => o.findLabel().getElement().textContent);
    const expectedLabels = series.map(s => s.label);
    expect(labels).toEqual(expectedLabels);
  });

  test('should pass selected options', () => {
    const wrapper = renderChartFilter();
    wrapper.findMultiselect()!.openDropdown();
    const dropdownWrapper = wrapper.findMultiselect()!.findDropdown()!;

    const labels = dropdownWrapper.findSelectedOptions().map(o => o.findLabel().getElement().textContent);
    const expectedLabels = [series[0].label];
    expect(labels).toEqual(expectedLabels);
  });

  test('should not display tokens', () => {
    const wrapper = renderChartFilter();
    const tokens = wrapper.findMultiselect()?.findByClassName(tokenGroupStyles.root);

    expect(tokens).toBeNull();
  });

  test('should emit data only', () => {
    const wrapper = renderChartFilter();

    wrapper.findMultiselect()?.openDropdown();
    wrapper.findMultiselect()?.selectOption(2);

    const expectedParam = series.map(s => s.datum);

    expect(defaultProps.onChange).toHaveBeenCalledWith(expectedParam);
  });
});
