// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import AsyncStore, { useReaction, useSelector } from '../index';
import { renderHook, act } from '../../../__tests__/render-hook';

describe('AsyncStore', () => {
  it('notifies listeners when selected state is updated', () => {
    const store = new AsyncStore({ a: 1, b: 2 });

    let a = store.get().a;
    store.subscribe(
      state => state.a,
      newState => {
        a = newState.a;
      }
    );

    store.set(state => ({ ...state, a: state.a + 1 }));
    store.set(state => ({ ...state, b: state.b + 1 }));
    store.set(state => ({ ...state, a: state.a + 1 }));

    expect(store.get().a).toBe(3);
    expect(store.get().b).toBe(3);
    expect(a).toBe(3);
  });

  it('allows unsubscribing from updates', () => {
    const store = new AsyncStore({ a: 1, b: 2 });

    let a = store.get().a;
    const unsubscribeA = store.subscribe(
      state => state.a,
      newState => {
        a = newState.a;
      }
    );

    store.set(state => ({ ...state, a: state.a + 1 }));
    unsubscribeA();
    store.set(state => ({ ...state, a: state.a + 1 }));

    expect(store.get().a).toBe(3);
    expect(a).toBe(2);
  });

  it('can be used with useReaction to describe effects', () => {
    const store = new AsyncStore({ a: 1, b: 2 });

    const aIncrements: number[] = [];
    renderHook(() =>
      useReaction(
        store,
        s => s.a,
        a => {
          aIncrements.push(a);
        }
      )
    );

    act(() => store.set(state => ({ ...state, a: state.a + 1 })));
    act(() => store.set(state => ({ ...state, a: state.a + 1 })));

    expect(aIncrements).toEqual([2, 3]);
  });

  it('can be used with useSelector to make state from selected properties', () => {
    const store = new AsyncStore({ a: 1, b: 2 });

    const { result } = renderHook(() => useSelector(store, s => s.a));
    expect(result.current).toEqual(1);

    act(() => store.set(state => ({ ...state, a: state.a + 1 })));
    expect(result.current).toEqual(2);

    act(() => store.set(state => ({ ...state, a: state.a + 1 })));
    expect(result.current).toEqual(3);
  });
});
