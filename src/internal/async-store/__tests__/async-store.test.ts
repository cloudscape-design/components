// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import AsyncStore, { useReaction, useSelector } from '../index';
import { renderHook, act } from '../../../__tests__/render-hook';

describe('AsyncStore', () => {
  it('notifies listeners when selected state is updated', () => {
    const store = new AsyncStore({ west: 1, east: 2 });

    let west = store.get().west;
    store.subscribe(
      state => state.west,
      newState => {
        west = newState.west;
      }
    );

    store.set(state => ({ ...state, west: state.west + 1 }));
    store.set(state => ({ ...state, east: state.east + 1 }));
    store.set(state => ({ ...state, west: state.west + 1 }));

    expect(store.get().west).toBe(3);
    expect(store.get().east).toBe(3);
    expect(west).toBe(3);
  });

  it('allows unsubscribing from updates', () => {
    const store = new AsyncStore({ west: 1, east: 2 });

    let west = store.get().west;
    const unsubscribeWest = store.subscribe(
      state => state.west,
      newState => {
        west = newState.west;
      }
    );

    store.set(state => ({ ...state, west: state.west + 1 }));
    unsubscribeWest();
    store.set(state => ({ ...state, west: state.west + 1 }));

    expect(store.get().west).toBe(3);
    expect(west).toBe(2);
  });

  it('can be used with useReaction to describe effects', () => {
    const store = new AsyncStore({ west: 1, east: 2 });

    const westIncrements: number[] = [];
    renderHook(() =>
      useReaction(
        store,
        s => s.west,
        west => {
          westIncrements.push(west);
        }
      )
    );

    act(() => store.set(state => ({ ...state, west: state.west + 1 })));
    act(() => store.set(state => ({ ...state, west: state.west + 1 })));

    expect(westIncrements).toEqual([2, 3]);
  });

  it('can be used with useSelector to make state from selected properties', () => {
    const store = new AsyncStore({ west: 1, east: 2 });

    const { result } = renderHook(() => useSelector(store, s => s.west));
    expect(result.current).toEqual(1);

    act(() => store.set(state => ({ ...state, west: state.west + 1 })));
    expect(result.current).toEqual(2);

    act(() => store.set(state => ({ ...state, west: state.west + 1 })));
    expect(result.current).toEqual(3);
  });
});
