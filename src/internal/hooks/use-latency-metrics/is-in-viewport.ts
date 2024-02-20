// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

type Callback = (inViewport: boolean) => void;
let map = new WeakMap<Element, Callback>();

const MAX_DELAY_MS = 1000;
const MANUAL_TRIGGER_DELAY = 2000;

/**
 * This function determines whether an element is in the viewport. The callback
 * is batched with other elements that also use this function, in order to improve
 * performance.
 */
export function isInViewport(element: Element, callback: Callback) {
  const mapSnapshot = map;
  let called = false;

  mapSnapshot.set(element, entry => {
    if (!called) {
      called = true;
      callback(entry);
    }
  });

  /*
   If the IntersectionObserver does not fire in reasonable time (for example
   in a background page in Chrome), we need to call the callback manually.

   See https://issues.chromium.org/issues/41383759
   */
  const timeoutHandle = setTimeout(() => {
    if (!called) {
      called = true;
      callback(false);
    }
  }, MANUAL_TRIGGER_DELAY);

  observer.observe(element);

  // Cleanup
  return () => {
    clearTimeout(timeoutHandle);
    mapSnapshot.delete(element);
    observer.unobserve(element);
  };
}

function createIntersectionObserver(callback: IntersectionObserverCallback) {
  if (typeof IntersectionObserver === 'undefined') {
    return {
      observe: () => {},
      unobserve: () => {},
    };
  }
  return new IntersectionObserver(callback);
}

const observer = createIntersectionObserver(function emitPerformanceMarks(entries) {
  // This avoids interference when the IntersectionObserver is called again during the delay.
  const mapSnapshot = map;
  map = new Map();

  // We only want the first run of the observer.
  for (const entry of entries) {
    observer.unobserve(entry.target);
  }

  // We yield the event loop, since these events are low priority and not time critical.
  defer(() => {
    for (const entry of entries) {
      mapSnapshot.get(entry.target)?.(entry.isIntersecting);
    }
  }, MAX_DELAY_MS);
});

function defer(callback: () => void, maxDelayMs: number) {
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(callback, { timeout: maxDelayMs });
  } else {
    // requestIdleCallback is not supported in Safari
    setTimeout(callback, maxDelayMs);
  }
}
