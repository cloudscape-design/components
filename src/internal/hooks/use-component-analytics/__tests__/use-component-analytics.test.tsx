// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { setComponentMetrics } from '../../../analytics';
import { useComponentAnalytics } from '../index';

function Demo() {
  useComponentAnalytics('demo', () => ({
    key: 'value',
  }));

  return <div />;
}

describe('useComponentAnalytics', () => {
  let componentMounted: jest.Mock;

  beforeEach(() => {
    componentMounted = jest.fn();
    setComponentMetrics({
      componentMounted,
    });
  });

  test('should emit ComponentMount event on mount', () => {
    render(<Demo />);

    expect(componentMounted).toHaveBeenCalledTimes(1);
    expect(componentMounted).toHaveBeenCalledWith({ componentName: 'demo', details: { key: 'value' } });
  });
});
