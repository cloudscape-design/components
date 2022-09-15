// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { useCurrentMode, useDensityMode, useVisualRefresh } from '../index';
import { render, screen } from '@testing-library/react';
import { mutate } from './utils';

const originalFn = window.CSS.supports;
beforeEach(() => {
  window.CSS.supports = jest.fn().mockReturnValue(true);
});

afterEach(() => {
  window.CSS.supports = originalFn;
});

jest.mock('../../../environment', () => ({ ALWAYS_VISUAL_REFRESH: false }), { virtual: true });

describe('useCurrentMode', () => {
  function ModeRender() {
    const ref = useRef(null);
    const mode = useCurrentMode(ref);
    return (
      <div ref={ref} data-testid="current-mode">
        {mode}
      </div>
    );
  }

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
      /*do not print anything to browser logs*/
    });
  });

  afterEach(() => {
    // ensure there are no react warnings
    expect(console.error).not.toHaveBeenCalled();
  });

  test('should detect light mode by default', () => {
    render(<ModeRender />);
    expect(screen.getByTestId('current-mode')).toHaveTextContent('light');
  });

  test('should detect dark mode', () => {
    render(
      <div className="awsui-polaris-dark-mode">
        <ModeRender />
      </div>
    );
    expect(screen.getByTestId('current-mode')).toHaveTextContent('dark');
  });

  test('should detect alternative dark mode class name', () => {
    render(
      <div className="awsui-dark-mode">
        <ModeRender />
      </div>
    );
    expect(screen.getByTestId('current-mode')).toHaveTextContent('dark');
  });

  test('should detect mode switch both ways', async () => {
    const { container } = render(<ModeRender />);
    expect(screen.getByTestId('current-mode')).toHaveTextContent('light');
    await mutate(() => container.classList.add('awsui-dark-mode'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('dark');
    await mutate(() => container.classList.remove('awsui-dark-mode'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('light');
  });

  test('should unmount properly', async () => {
    const { rerender, container } = render(<ModeRender />);
    rerender(<>empty content</>);
    await mutate(() => container.classList.add('awsui-dark-mode'));
  });
});

describe('useVisualRefresh', () => {
  function App() {
    const isRefresh = useVisualRefresh();
    return <div data-testid="current-mode">{isRefresh.toString()}</div>;
  }

  test('should return false when CSS-variables are not supported', () => {
    (window.CSS.supports as jest.Mock).mockReturnValue(false);
    render(<App />);
    expect(screen.getByTestId('current-mode')).toHaveTextContent('false');
  });
});

// The above suites cover majority of cases
describe('useDensityMode', () => {
  function ModeRender() {
    const ref = useRef(null);
    const mode = useDensityMode(ref);
    return (
      <div ref={ref} data-testid="current-mode">
        {mode}
      </div>
    );
  }

  test('should detect density modes', async () => {
    const { container } = render(<ModeRender />);

    // Default
    expect(screen.getByTestId('current-mode')).toHaveTextContent('comfortable');

    // External class
    await mutate(() => container.classList.add('awsui-compact-mode'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('compact');
    await mutate(() => container.classList.remove('awsui-compact-mode'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('comfortable');

    // Internal class
    await mutate(() => container.classList.add('awsui-polaris-compact-mode'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('compact');
    await mutate(() => container.classList.remove('awsui-polaris-compact-mode'));
    expect(screen.getByTestId('current-mode')).toHaveTextContent('comfortable');
  });
});
