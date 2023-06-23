// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useLayoutEffect, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { usePrevious } from '../hooks/use-previous';

type Selector<S, R> = (state: S) => R;
type Listener<S> = (state: S, prevState: S) => any;

export interface ReadonlyAsyncStore<S> {
  get(): S;
  subscribe<R>(selector: Selector<S, R>, listener: Listener<S>): () => void;
  unsubscribe(listener: Listener<any>): void;
}

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

    unstable_batchedUpdates(() => {
      for (const [selector, listener] of this._listeners) {
        if (selector(prevState) !== selector(newState)) {
          listener(newState, prevState);
        }
      }
    });
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

export function useSelector<S, R>(store: ReadonlyAsyncStore<S>, selector: Selector<S, R>): R {
  const [state, setState] = useState<R>(selector(store.get()));

  useReaction(store, selector, newState => {
    setState(newState);
  });

  // When store changes we need the state to be updated synchronously to avoid inconsistencies.
  const prevStore = usePrevious(store);
  if (prevStore !== null && prevStore !== store) {
    return selector(store.get());
  }

  return state;
}
