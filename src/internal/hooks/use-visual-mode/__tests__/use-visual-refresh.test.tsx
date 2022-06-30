// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { useVisualRefresh } from '../index';
import { render, screen } from '@testing-library/react';
import { mutate } from './utils';

jest.mock('../../../environment', () => ({ ALWAYS_VISUAL_REFRESH: true }), { virtual: true });

const originalFn = window.CSS.supports;
beforeEach(() => {
  window.CSS.supports = jest.fn().mockReturnValue(true);
});

afterEach(() => {
  window.CSS.supports = originalFn;
});

describe('useVisualRefresh with locked visual refresh mode', () => {
  function RefreshRender() {
    const ref = useRef(null);
    const isRefresh = useVisualRefresh(ref);
    return (
      <div ref={ref} data-testid="current-mode">
        {isRefresh.toString()}
      </div>
    );
  }

  test('should return true when the environment is locked in visual refresh mode', () => {
    render(<RefreshRender />);

    expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
  });

  test('cannot not change visual refresh state', async () => {
    const { container } = render(<RefreshRender />);

    await mutate(() => container.classList.add('awsui-visual-refresh'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
    await mutate(() => container.classList.remove('awsui-visual-refresh'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
  });
});
