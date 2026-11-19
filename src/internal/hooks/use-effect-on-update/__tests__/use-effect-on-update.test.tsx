// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';

import { useEffectOnUpdate } from '../index';

describe('useEffectOnUpdate', () => {
  let mockCallback: jest.Mock;
  let mockCleanup: jest.Mock;

  beforeEach(() => {
    mockCallback = jest.fn().mockImplementation(() => mockCleanup);
    mockCleanup = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  function TestComponent({ deps, callback }: { deps: any[]; callback: () => void | (() => void) }) {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffectOnUpdate(callback, deps);
    return <div>Test Component</div>;
  }

  const obj = { 3: 3 };

  it.each([
    { first: [], second: [] },
    { first: [undefined], second: [undefined] },
    { first: [null], second: [null] },
    { first: [NaN], second: [NaN] },
    { first: [1], second: [1] },
    { first: ['1'], second: ['1'] },
    { first: [obj], second: [obj] },
    { first: [1], second: [1, 2] }, // React does not care as it expects the dependency list to be of constant length.
  ] as { first: any[]; second: any[] }[])('should not execute callback when dependencies remain the same: %s', deps => {
    const { rerender, unmount } = render(<TestComponent deps={deps.first} callback={mockCallback} />);
    expect(mockCallback).not.toHaveBeenCalled();

    rerender(<TestComponent deps={deps.second} callback={mockCallback} />);
    expect(mockCallback).not.toHaveBeenCalled();

    unmount();
    expect(mockCleanup).not.toHaveBeenCalled();
  });

  it.each([
    { first: [-0], second: [+1] },
    { first: ['1'], second: [undefined] },
    { first: [undefined], second: [null] },
    { first: [null], second: [NaN] },
    { first: [obj], second: [{ ...obj }] },
  ] as { first: any[]; second: any[] }[])('should execute callback when dependencies change: %s', deps => {
    const { rerender, unmount } = render(<TestComponent deps={deps.first} callback={mockCallback} />);
    expect(mockCallback).not.toHaveBeenCalled();

    rerender(<TestComponent deps={deps.second} callback={mockCallback} />);
    expect(mockCallback).toHaveBeenCalledTimes(1);

    unmount();
    expect(mockCleanup).toHaveBeenCalledTimes(1);
  });
});
