// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useVisualRefresh } from '../index';
import { render, screen } from '@testing-library/react';

jest.mock('../../../environment', () => ({ ALWAYS_VISUAL_REFRESH: true }), { virtual: true });

describe('useVisualRefresh with locked visual refresh mode', () => {
  function App() {
    const isRefresh = useVisualRefresh();
    return <div data-testid="current-mode">{isRefresh.toString()}</div>;
  }

  test('should return true when the environment is locked in visual refresh mode', () => {
    render(<App />);
    expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
  });
});
