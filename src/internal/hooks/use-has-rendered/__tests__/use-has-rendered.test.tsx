// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { act, render } from '@testing-library/react';

import { useHasRendered } from '../index';

function Demo() {
  const renderCount = useRef(0);
  const hasRendered = useHasRendered();
  renderCount.current++;
  return (
    <div>
      <span data-testid="has-rendered">{String(hasRendered)}</span>
      <span data-testid="render-count">{renderCount.current}</span>
    </div>
  );
}

test('should be false on the initial render', () => {
  const { getByTestId } = render(<Demo />);

  expect(getByTestId('has-rendered')).toHaveTextContent('false');
  expect(getByTestId('render-count').textContent).toEqual('1');
});

test('should be false when the first frame is being prepared', async () => {
  const { getByTestId } = render(<Demo />);

  await act(async () => {
    await requestAnimationFramePromise();
  });

  expect(getByTestId('has-rendered')).toHaveTextContent('false');
  expect(getByTestId('render-count').textContent).toEqual('1');
});

test('should be true after the first frame has been rendered by the browser', async () => {
  const { getByTestId } = render(<Demo />);

  await act(async () => {
    await requestAnimationFramePromise();
    await requestAnimationFramePromise();
  });

  expect(getByTestId('has-rendered')).toHaveTextContent('true');
  expect(getByTestId('render-count').textContent).toEqual('2');
});

/**
 * Waits for the callback to `requestAnimationFrame` to fire.
 *
 * Since this callback is intended for preparing animations,
 * the actual frame has not yet been rendered by the browser when
 * this promise resolves. The frame will only be rendered
 * at some point in time before the _next_ callback to
 * `requestAnimationFrame` fires.
 */
function requestAnimationFramePromise() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}
