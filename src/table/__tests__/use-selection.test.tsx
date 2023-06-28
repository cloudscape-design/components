// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useSelection } from '../../../lib/components/table/use-selection';
import { renderHook } from '../../__tests__/render-hook';

describe('useSelection', () => {
  it('satisfies istanbul coverage', () => {
    const { result } = renderHook(() => useSelection({ items: ['a', 'b', 'c'] }));

    expect(() => result.current.getSelectAllProps()).toThrow(
      'Invariant violation: calling selection props with missing selection type.'
    );

    expect(() => result.current.getItemSelectionProps('a')).toThrow(
      'Invariant violation: calling selection props with missing selection type.'
    );
  });
});
