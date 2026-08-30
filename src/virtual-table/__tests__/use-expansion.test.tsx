// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../__tests__/render-hook';
import { useExpansion } from '../use-expansion';

// Root owns the R-EXPAND expansion state for the compound VirtualTable. These tests pin the
// controlled/uncontrolled contract and the stable signature the windowing layout depends on.

interface Item {
  id: string;
}

const trackBy = (item: Item) => item.id;
const a: Item = { id: 'a' };

describe('VirtualTable (F1-A2 compound) useExpansion', () => {
  test('is empty by default (uncontrolled)', () => {
    const { result } = renderHook(() => useExpansion<Item>({ trackBy }));
    expect(result.current.expandedIds.size).toBe(0);
    expect(result.current.expandedSignature).toBe('');
    expect(result.current.isExpanded('a')).toBe(false);
  });

  test('honours defaultExpandedItems', () => {
    const { result } = renderHook(() => useExpansion<Item>({ trackBy, defaultExpandedItems: ['a'] }));
    expect(result.current.isExpanded('a')).toBe(true);
    expect(result.current.expandedSignature).toBe('a');
  });

  test('toggle adds then removes an id and fires onExpandChange with the resulting set', () => {
    const onExpandChange = jest.fn();
    const { result } = renderHook(() => useExpansion<Item>({ trackBy, onExpandChange }));

    act(() => result.current.toggle(a));
    expect(result.current.isExpanded('a')).toBe(true);
    expect(onExpandChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ item: a, expanded: true, expandedItems: ['a'] }) })
    );

    act(() => result.current.toggle(a));
    expect(result.current.isExpanded('a')).toBe(false);
    expect(onExpandChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ expanded: false, expandedItems: [] }) })
    );
  });

  test('expand is idempotent', () => {
    const { result } = renderHook(() => useExpansion<Item>({ trackBy }));
    act(() => result.current.expand(a));
    act(() => result.current.expand(a));
    expect(result.current.expandedIds.size).toBe(1);
  });

  test('controlled mode is driven by expandedItems, not internal state', () => {
    const onExpandChange = jest.fn();
    const { result } = renderHook(() => useExpansion<Item>({ trackBy, expandedItems: ['a'], onExpandChange }));
    expect(result.current.isExpanded('a')).toBe(true);

    // Toggling in controlled mode emits collapse intent but must not mutate local state: the
    // controlled prop is unchanged, so the row stays expanded until the consumer updates it.
    act(() => result.current.toggle(a));
    expect(onExpandChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ detail: expect.objectContaining({ expanded: false, expandedItems: [] }) })
    );
    expect(result.current.isExpanded('a')).toBe(true);
  });

  test('signature is order-independent and stable across identical sets', () => {
    const first = renderHook(() => useExpansion<Item>({ trackBy, defaultExpandedItems: ['b', 'a'] }));
    const second = renderHook(() => useExpansion<Item>({ trackBy, defaultExpandedItems: ['a', 'b'] }));
    expect(first.result.current.expandedSignature).toBe(second.result.current.expandedSignature);
  });
});
