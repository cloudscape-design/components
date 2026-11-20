// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { calculatePosition } from '../../../lib/components/dropdown/dropdown-fit-handler';
import PropertyFilter from '../../../lib/components/property-filter';
import createWrapper from '../../../lib/components/test-utils/dom';
import { createDefaultProps } from './common';

jest.mock('../../../lib/components/dropdown/dropdown-fit-handler', () => {
  const originalModule = jest.requireActual('../../../lib/components/dropdown/dropdown-fit-handler');
  return {
    ...originalModule,
    calculatePosition: jest.fn(originalModule.calculatePosition),
  };
});

const filteringProperties = [
  { key: 'id', propertyLabel: 'Identifier', operators: [':', '='], groupValuesLabel: 'Identifier values' },
  { key: 'service', propertyLabel: 'Service', operators: [':', '='], groupValuesLabel: 'Service values' },
] as const;

const filteringOptions = [
  {
    propertyKey: 'id',
    value: 'arn:aws:apprunner:ap-southeast-2:123456789012:autoscalingconfiguration/DefaultConfiguration/1/0001',
  },
  { propertyKey: 'service', value: 'apprunner' },
];

async function flushContentChanges() {
  await act(async () => {
    await Promise.resolve();
    jest.runOnlyPendingTimers();
  });
}

function renderPropertyFilter() {
  const props = createDefaultProps([...filteringProperties], filteringOptions);
  const { container, rerender } = render(<PropertyFilter {...props} expandToViewport={true} />);
  const wrapper = createWrapper(container).findPropertyFilter()!;
  return { wrapper, rerender, props };
}

describe('property filter dropdown position', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (calculatePosition as jest.Mock).mockClear();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  test('recalculates dropdown position when value suggestions appear in an open dropdown', async () => {
    const { wrapper } = renderPropertyFilter();
    wrapper.findNativeInput().focus();
    expect(wrapper.findDropdown({ expandToViewport: true }).findOpenDropdown()).not.toBe(null);

    (calculatePosition as jest.Mock).mockClear();
    wrapper.setInputValue('ap');
    await flushContentChanges();
    expect(wrapper.findDropdown({ expandToViewport: true }).findOpenDropdown()).not.toBe(null);
    expect(calculatePosition).toHaveBeenCalled();
  });
});
