// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useRef } from 'react';

export class PromiseCancelledSignal {}

/**
 * Wrap and provide a handle for a promise to provide cancellation information inside
 * callbacks. Takes a similar approach to how an AbortController works in modern fetch.
 *
 * @see https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 */
export function makeCancellable<T>(promise: Promise<T>): {
  promise: Promise<T>;
  cancel: () => void;
  isCancelled: () => boolean;
} {
  let cancelled = false;
  const wrapped = promise.then(
    value => {
      if (cancelled) {
        throw new PromiseCancelledSignal();
      }
      return value;
    },
    err => {
      if (cancelled) {
        throw new PromiseCancelledSignal();
      }
      throw err;
    }
  );

  return {
    promise: wrapped,
    cancel: () => {
      cancelled = true;
    },
    isCancelled: () => cancelled,
  };
}

/**
 * Returns a ref callback and promise that resolves when the ref is attached to a mounted element.
 * Useful for coordinating async operations that depend on DOM element availability, such as
 * setting focus or measuring dimensions after mount.
 *
 * @returns An object containing a ref callback and a promise that resolves with the mounted element
 */
export function useMountRefPromise<T extends HTMLElement>() {
  const promiseRef = useRef<{
    promise: Promise<T>;
    resolve: (element: T) => void;
  }>();

  if (!promiseRef.current) {
    let resolve: (element: T) => void;
    const promise = new Promise<T>(res => {
      resolve = res;
    });
    promiseRef.current = { promise, resolve: resolve! };
  }

  const ref = useCallback(element => {
    if (element) {
      promiseRef.current!.resolve(element);
    }
  }, []);

  return { ref, promise: promiseRef.current.promise };
}
