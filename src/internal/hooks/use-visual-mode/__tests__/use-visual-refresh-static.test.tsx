// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render, screen } from '@testing-library/react';
import { useVisualRefresh } from '../../../../../lib/components/internal/hooks/use-visual-mode';

jest.mock('../../../../../lib/components/internal/environment', () => ({ ALWAYS_VISUAL_REFRESH: true }));

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
