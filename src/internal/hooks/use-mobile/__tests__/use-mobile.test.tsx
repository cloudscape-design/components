// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { act, render } from '@testing-library/react';

import { useMobile } from '../index';

function Demo() {
  const renderCount = useRef(0);
  const isMobile = useMobile();
  renderCount.current++;
  return (
    <div>
      <span data-testid="mobile">{String(isMobile)}</span>
      <span data-testid="render-count">{renderCount.current}</span>
    </div>
  );
}

function resizeWindow(width: number) {
  act(() => {
    Object.defineProperty(window, 'innerWidth', { value: width });
    window.dispatchEvent(new CustomEvent('resize'));
  });
}

test('should report mobile width on the initial render', () => {
  resizeWindow(400);
  const { getByTestId } = render(<Demo />);
  expect(getByTestId('mobile')).toHaveTextContent('true');
});

test('should report desktop width on the initial render', () => {
  resizeWindow(1200);
  const { getByTestId } = render(<Demo />);
  expect(getByTestId('mobile')).toHaveTextContent('false');
});

test('should report the updated value after resize', () => {
  resizeWindow(400);
  const { getByTestId } = render(<Demo />);
  const countBefore = getByTestId('render-count').textContent;
  resizeWindow(1200);
  const countAfter = getByTestId('render-count').textContent;
  expect(getByTestId('mobile')).toHaveTextContent('false');
  expect(countBefore).not.toEqual(countAfter);
});

test('no renders when resize does not hit the breakpoint', () => {
  resizeWindow(1000);
  const { getByTestId } = render(<Demo />);
  const countBefore = getByTestId('render-count').textContent;
  resizeWindow(1200);
  const countAfter = getByTestId('render-count').textContent;
  expect(countBefore).toEqual(countAfter);
});
