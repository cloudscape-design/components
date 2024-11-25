// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { act, renderHook } from '../../../__tests__/render-hook';
import AsyncStore, { useSelector } from '../async-store';

describe('AsyncStore', () => {
  test('subscribers are notified when selected state is updated', () => {
    const store = new AsyncStore({ west: 1, east: 2 });

    let west = store.get().west;
    store.subscribe(
      state => state.west,
      nextWest => {
        west += nextWest;
      }
    );

    let east = store.get().east * 2;
    store.subscribe(
      state => state.east,
      nextEast => {
        east += nextEast * 2;
      }
    );

    store.set(state => ({ ...state, west: state.west + 1 }));
    store.set(state => ({ ...state, east: state.east + 1 }));
    store.set(state => ({ ...state, west: state.west + 1 }));

    expect(store.get().west).toBe(3);
    expect(west).toBe(1 + 2 + 3);

    expect(store.get().east).toBe(3);
    expect(east).toBe(4 + 6);
  });

  test('subscribers can unsubscribe from updates', () => {
    const store = new AsyncStore({ west: 1, east: 2 });

    let west = store.get().west;
    const unsubscribeWest = store.subscribe(
      state => state.west,
      nextWest => {
        west = nextWest;
      }
    );

    store.set(state => ({ ...state, west: state.west + 1 }));
    unsubscribeWest();
    store.set(state => ({ ...state, west: state.west + 1 }));

    expect(store.get().west).toBe(3);
    expect(west).toBe(2);
  });
});

describe('useSelector', () => {
  test('selected state updates cause subscribed component to re-render', () => {
    const store = new AsyncStore({ west: 1, east: 2 });

    const { result } = renderHook(() => useSelector(store, s => s.west));
    expect(result.current).toEqual(1);

    act(() => store.set(state => ({ ...state, west: state.west + 1 })));
    expect(result.current).toEqual(2);

    act(() => store.set(state => ({ ...state, west: state.west + 1 })));
    expect(result.current).toEqual(3);
  });
});
