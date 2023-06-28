// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';
import ChartFilter from '../../../../../lib/components/internal/components/chart-filter';
import createWrapper from '../../../../../lib/components/test-utils/dom';
import TestI18nProvider from '../../../../../lib/components/internal/i18n/testing';

const datum0 = {};
const datum1 = {};

const series = [
  { label: 'Chocolate', color: 'chocolate', type: 'line', datum: datum0 },
  { label: 'Apples', color: 'red', type: 'rectangle', datum: datum1 },
] as const;

const defaultProps = {
  series,
  selectedSeries: [datum0],
  onChange: jest.fn(),
};

function renderChartFilter(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return createWrapper(container);
}

it('uses filterLabel and filterPlaceholder from i18n provider', () => {
  const wrapper = renderChartFilter(
    <TestI18nProvider
      messages={{
        '[charts]': {
          'i18nStrings.filterLabel': 'Custom filter label',
          'i18nStrings.filterPlaceholder': 'Custom filter placeholder',
        },
      }}
    >
      <ChartFilter {...defaultProps} />
    </TestI18nProvider>
  );
  expect(wrapper.findFormField()!.findLabel()!.getElement()).toHaveTextContent('Custom filter label');
  expect(wrapper.findFormField()!.findControl()!.findMultiselect()!.findTrigger()!.getElement()).toHaveTextContent(
    'Custom filter placeholder'
  );
});
