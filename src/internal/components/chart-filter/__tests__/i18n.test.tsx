// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import TestI18nProvider from '../../../../../lib/components/i18n/testing';
import ChartFilter, { ChartFilterProps } from '../../../../../lib/components/internal/components/chart-filter';
import createWrapper from '../../../../../lib/components/test-utils/dom';

const datum0 = {};
const datum1 = {};

const series: ChartFilterProps<any>['series'] = [
  { label: 'Chocolate', marker: <div />, datum: datum0 },
  { label: 'Apples', marker: <div />, datum: datum1 },
];

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
