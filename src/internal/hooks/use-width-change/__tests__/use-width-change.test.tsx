// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef } from 'react';

import { renderHook } from '../../../../__tests__/render-hook';
import { useWidthChange } from '../index';

describe('useWidthChange', () => {
  test('does not throw when ref is null', () => {
    const onWidthChange = jest.fn();

    expect(() => {
      renderHook(() => {
        const ref = useRef<HTMLElement>(null);
        useWidthChange(ref, onWidthChange);
      });
    }).not.toThrow();

    expect(onWidthChange).not.toHaveBeenCalled();
  });
});
