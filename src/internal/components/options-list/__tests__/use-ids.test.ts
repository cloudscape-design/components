// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { renderHook } from '../../../../__tests__/render-hook';
import { useIds } from '../utils/use-ids';

describe('useIds', () => {
  test('should generate selectedOptionId when selectedOption is present', () => {
    const hook = renderHook(useIds, {
      initialProps: {
        hasSelectedOption: true,
      },
    });

    expect(hook.result.current.selectedOptionId).not.toBe(undefined);
  });

  test('should generate menuId', () => {
    const hook = renderHook(useIds, {
      initialProps: {
        hasSelectedOption: false,
      },
    });

    expect(hook.result.current.menuId).not.toBe(undefined);
  });
});
