// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, useEffect } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { useStableEventHandler } from '../index';

interface Props {
  onChange: () => void;
}

interface Ref {
  stableHandleChange: (newValue: React.SetStateAction<string | undefined>) => void;
  getEffectRunsCount: () => string;
}

const Component = React.forwardRef(({ onChange }: Props, ref: React.Ref<Ref>) => {
  const stableHandleChange = useStableEventHandler(onChange);
  const effectRunsCount = useRef(0);
  const stableEffectRunsCount = useRef(0);
  useEffect(() => {
    effectRunsCount.current++;
  }, [onChange]);
  useEffect(() => {
    stableEffectRunsCount.current++;
  }, [stableHandleChange]);

  useImperativeHandle(ref, () => ({
    stableHandleChange,
    getEffectRunsCount: () => `${effectRunsCount.current}-${stableEffectRunsCount.current}`,
  }));

  return null;
});

let consoleWarnSpy: jest.SpyInstance;
afterEach(() => {
  consoleWarnSpy?.mockRestore();
});

describe('useStableEventHandler', () => {
  test('returns a stable handler (returned handler does not cause effects that have it as dependencies to run)', async () => {
    const ref = React.createRef<Ref>();
    const handleChange = jest.fn();
    const { rerender } = render(<Component onChange={handleChange} ref={ref} />);
    await waitFor(() => expect(ref.current?.getEffectRunsCount()).toEqual('1-1'));

    const updatedHandleChange = jest.fn();
    rerender(<Component onChange={updatedHandleChange} ref={ref} />);
    await waitFor(() => expect(ref.current?.getEffectRunsCount()).toEqual('2-1'));
  });

  test('runs the updated version of the handler passed by the customer, when invoked', () => {
    const ref = React.createRef<Ref>();
    const handleChange = jest.fn();
    const { rerender } = render(<Component onChange={handleChange} ref={ref} />);
    const updatedHandleChange = jest.fn();
    rerender(<Component onChange={updatedHandleChange} ref={ref} />);
    act(() => ref.current?.stableHandleChange('123'));
    expect(handleChange).not.toHaveBeenCalled();
    expect(updatedHandleChange).toHaveBeenCalledWith('123');
  });
});
