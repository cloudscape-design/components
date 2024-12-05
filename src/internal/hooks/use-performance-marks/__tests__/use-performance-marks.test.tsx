// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { render } from '@testing-library/react';

import { usePerformanceMarks } from '../index';

function Demo({ enabled }: { enabled: () => boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const attributes = usePerformanceMarks('test-component', enabled, ref, () => ({}), []);
  return <div {...attributes} ref={ref} data-testid="element" />;
}

describe('Data attribute', () => {
  test('the attribute should be present after the first render', () => {
    const { getByTestId } = render(<Demo enabled={() => true} />);

    expect(getByTestId('element')).toHaveAttribute('data-analytics-performance-mark');
  });

  test('the attribute should be present after re-rendering', () => {
    const { getByTestId, rerender } = render(<Demo enabled={() => true} />);

    const attributeValueBefore = getByTestId('element').getAttribute('data-analytics-performance-mark');
    rerender(<Demo enabled={() => true} />);

    expect(getByTestId('element')).toHaveAttribute('data-analytics-performance-mark');

    const attributeValueAfter = getByTestId('element').getAttribute('data-analytics-performance-mark');

    expect(attributeValueAfter).toBe(attributeValueBefore);
  });

  test('should not render the attribute during server-side rendering', () => {
    const markup = renderToStaticMarkup(<Demo enabled={() => true} />);

    expect(markup).toBe('<div data-testid="element"></div>');
  });
});
