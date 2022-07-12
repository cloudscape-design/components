// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
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
  function App() {
    const isRefresh = useVisualRefresh();
    return (
      <body>
        <div data-testid="current-mode">{isRefresh.toString()}</div>
      </body>
    );
  }

  test('should return true when the environment is locked in visual refresh mode', () => {
    render(<App />);
    expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
  });

  test('cannot not change visual refresh state', async () => {
    render(<App />);
    await mutate(() => document.body.classList.add('awsui-visual-refresh'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
    await mutate(() => document.body.classList.remove('awsui-visual-refresh'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
  });
});
