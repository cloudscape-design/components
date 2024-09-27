// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';

import { setComponentMetrics } from '../../../analytics';
import { useComponentAnalytics } from '../index';

function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const { attributes } = useComponentAnalytics('demo', ref, () => ({
    key: 'value',
  }));

  return <div {...attributes} ref={ref} data-testid="element" />;
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
    expect(componentMounted).toHaveBeenCalledWith({
      taskInteractionId: expect.any(String),
      componentName: 'demo',
      details: { key: 'value' },
    });
  });

  test('data attribute should be present after the first render', () => {
    const { getByTestId } = render(<Demo />);

    expect(getByTestId('element')).toHaveAttribute('data-analytics-task-interaction-id');
  });

  test('data attribute should be present after re-rendering', () => {
    const { getByTestId, rerender } = render(<Demo />);
    const attributeValueBefore = getByTestId('element').getAttribute('data-analytics-task-interaction-id');
    rerender(<Demo />);

    expect(getByTestId('element')).toHaveAttribute('data-analytics-task-interaction-id');

    const attributeValueAfter = getByTestId('element').getAttribute('data-analytics-task-interaction-id');
    expect(attributeValueAfter).toBe(attributeValueBefore);
  });

  test('should not render the attribute during server-side rendering', () => {
    const markup = renderToStaticMarkup(<Demo />);

    expect(markup).toBe('<div data-testid="element"></div>');
  });
});
