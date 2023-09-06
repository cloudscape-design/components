// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useVisualRefresh, clearVisualRefreshState } from '../index';
import { render, screen } from '@testing-library/react';

const awsuiVisualRefreshFlag = Symbol.for('awsui-visual-refresh-flag');
interface ExtendedWindow extends Window {
  [awsuiVisualRefreshFlag]?: () => boolean;
}
declare const window: ExtendedWindow;

jest.mock('../../../environment', () => ({ ALWAYS_VISUAL_REFRESH: false }), { virtual: true });

describe('useVisualRefresh', () => {
  function App() {
    const isRefresh = useVisualRefresh();
    return <div data-testid="current-mode">{isRefresh.toString()}</div>;
  }

  beforeEach(() => clearVisualRefreshState());
  afterEach(() => document.body.classList.remove('awsui-visual-refresh'));
  afterEach(() => jest.restoreAllMocks());

  test('should return false when class name is not present', () => {
    render(<App />);
    expect(screen.getByTestId('current-mode')).toHaveTextContent('false');
  });

  test('should return true when class name is present', () => {
    document.body.classList.add('awsui-visual-refresh');
    render(<App />);
    expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
  });

  test('should print a warning when late visual refresh class name was detected', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { rerender } = render(<App />);
    expect(screen.getByTestId('current-mode')).toHaveTextContent('false');
    expect(console.warn).not.toHaveBeenCalled();

    document.body.classList.add('awsui-visual-refresh');
    rerender(<App />);
    expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/Dynamic visual refresh change detected/));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('false');
  });

  describe('Window Symbol awsui-visual-refresh-flag', () => {
    afterEach(() => {
      window[awsuiVisualRefreshFlag] = undefined;
    });

    test('should return true when Window Symbol awsui-visual-refresh-flag returns true', () => {
      window[awsuiVisualRefreshFlag] = () => true;
      render(<App />);
      expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
    });

    test('should return false when Window Symbol awsui-visual-refresh-flag returns false', () => {
      window[awsuiVisualRefreshFlag] = () => false;
      render(<App />);
      expect(screen.getByTestId('current-mode')).toHaveTextContent('false');
    });

    test('should not change theme when Window Symbol awsui-visual-refresh-flag is set later', () => {
      const { rerender } = render(<App />);
      expect(screen.getByTestId('current-mode')).toHaveTextContent('false');

      window[awsuiVisualRefreshFlag] = () => true;
      rerender(<App />);
      expect(screen.getByTestId('current-mode')).toHaveTextContent('false');
    });

    test('should return true when Window Symbol awsui-visual-refresh-flag returns false but class name is present', () => {
      document.body.classList.add('awsui-visual-refresh');
      window[awsuiVisualRefreshFlag] = () => false;
      render(<App />);
      expect(screen.getByTestId('current-mode')).toHaveTextContent('true');
    });
  });
});
