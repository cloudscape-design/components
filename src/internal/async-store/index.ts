// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useLayoutEffect, useState } from 'react';
import { usePrevious } from '../hooks/use-previous';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

type Selector<S, R> = (state: S) => R;
type Listener<S> = (state: S, prevState: S) => any;

export interface ReadonlyAsyncStore<S> {
  get(): S;
  subscribe<R>(selector: Selector<S, R>, listener: Listener<S>): () => void;
  unsubscribe(listener: Listener<any>): void;
}

/**
 * Async store utility can be used to distribute component state without using React context.
 * The state can be represented by an object of any shape. Components can subscribe to state changes
 * to be notified when the change of the entire state or particular properties occur.
 *
 * function WestSideComponent({ store }) {
 *   const westValue = useSelector(store, state => state.west)
 *   return <div>{westValue}</div>;
 * }
 *
 * function EastSideComponent({ store }) {
 *   const eastValue = useSelector(store, state => state.east)
 *   return <div>{eastValue}</div>;
 * }
 *
 * function SidesComponent() {
 *   const store = new AsyncStore<{ west: number, east: number }>({ west: 0, east: 0 });
 *   return (
 *     <>
 *       <WestSideComponent store={store} />
 *       <EastSideComponent store={store} />
 *     <>
 *   );
 * }
 */
export default class AsyncStore<S> implements ReadonlyAsyncStore<S> {
  _state: S;
  _listeners: [Selector<S, any>, Listener<any>][] = [];

  constructor(state: S) {
    this._state = state;
  }

  get(): S {
    return this._state;
  }

  set(cb: (state: S) => S): void {
    const prevState = this._state;
    const newState = cb(prevState);

    this._state = newState;

    for (const [selector, listener] of this._listeners) {
      if (selector(prevState) !== selector(newState)) {
        listener(newState, prevState);
      }
    }
  }

  subscribe<R>(selector: Selector<S, R>, listener: Listener<S>): () => void {
    this._listeners.push([selector, listener]);

    return () => this.unsubscribe(listener);
  }

  unsubscribe(listener: Listener<any>): void {
    for (let index = 0; index < this._listeners.length; index++) {
      const [, storedListener] = this._listeners[index];

      if (storedListener === listener) {
        this._listeners.splice(index, 1);
        break;
      }
    }
  }
}

/**
 * Triggers an effect when selected state changes.
 *
 * useReaction(store, state => state.east, (east) => console.log('east', east));
 */
export function useReaction<S, R>(store: ReadonlyAsyncStore<S>, selector: Selector<S, R>, effect: Listener<R>): void {
  useLayoutEffect(
    () => {
      const unsubscribe = store.subscribe(selector, (newState, prevState) =>
        effect(selector(newState), selector(prevState))
      );
      return unsubscribe;
    },
    // ignoring selector and effect as they are expected to stay constant
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store]
  );
}

/**
 * Transforms selected state to React state.
 *
 * const eastValue = useSelector(store, state => state.east);
 */
export function useSelector<S, R>(store: ReadonlyAsyncStore<S>, selector: Selector<S, R>): R {
  const [state, setState] = useState<R>(selector(store.get()));

  const stableSelector = useStableCallback(selector);
  useReaction(store, stableSelector, newState => {
    setState(newState);
  });

  // When store changes we need the state to be updated synchronously to avoid inconsistencies.
  const prevStore = usePrevious(store);
  if (prevStore !== null && prevStore !== store) {
    return selector(store.get());
  }

  return state;
}
