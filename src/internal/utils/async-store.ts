// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useLayoutEffect, useState } from 'react';

import { usePrevious } from '../../internal/hooks/use-previous';

type Selector<S, R> = (state: S) => R;
type Listener<R> = (state: R, prevState: R) => void;

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
export interface ReadonlyAsyncStore<S> {
  get(): S;
  subscribe<R>(selector: Selector<S, R>, listener: Listener<R>): () => void;
  unsubscribe(listener: Listener<any>): void;
}

export default class AsyncStore<S> implements ReadonlyAsyncStore<S> {
  #state: S;
  #listeners: [Selector<S, unknown>, Listener<any>][] = [];

  constructor(state: S) {
    this.#state = state;
  }

  get(): S {
    return this.#state;
  }

  set(cb: (state: S) => S): void {
    const prevState = this.#state;
    const nextState = cb(prevState);

    this.#state = nextState;

    for (const [selector, listener] of this.#listeners) {
      const nextSelected = selector(nextState);
      const prevSelected = selector(prevState);
      if (nextSelected !== prevSelected) {
        listener(nextSelected, prevSelected);
      }
    }
  }

  subscribe<R>(selector: Selector<S, R>, listener: Listener<R>): () => void {
    this.#listeners.push([selector, listener]);
    return () => this.unsubscribe(listener);
  }

  unsubscribe(listener: Listener<any>): void {
    for (let index = 0; index < this.#listeners.length; index++) {
      const [, storedListener] = this.#listeners[index];

      if (storedListener === listener) {
        this.#listeners.splice(index, 1);
        break;
      }
    }
  }
}

/**
 * Synchronizes selected state to React state.
 *
 * const eastValue = useSelector(store, state => state.east);
 */
export function useSelector<S, R>(store: ReadonlyAsyncStore<S>, selector: Selector<S, R>): R {
  const [state, setState] = useState<R>(() => selector(store.get()));

  useLayoutEffect(() => {
    setState(selector(store.get()));
    return store.subscribe(selector, setState);
    // Not including selector because it is expected to be stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  // When store changes we need the state to be updated synchronously to avoid inconsistencies.
  const prevStore = usePrevious(store);
  if (prevStore !== null && prevStore !== store) {
    return selector(store.get());
  }

  return state;
}
