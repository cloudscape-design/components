// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

type Callback = (inViewport: boolean) => void;
const map = new WeakMap<Element, Callback>();

const MANUAL_TRIGGER_DELAY = 150;

/**
 * This function determines whether an element is in the viewport. The callback
 * is batched with other elements that also use this function, in order to improve
 * performance.
 */
export function isInViewport(element: Element, callback: Callback) {
  let resolve = (value: boolean) => {
    resolve = () => {}; // Prevent multiple execution
    callback(value);
  };

  map.set(element, inViewport => resolve(inViewport));
  observer.observe(element);

  /*
	 If the IntersectionObserver does not fire in reasonable time (for example
	 in a background page in Chrome), we need to call the callback manually.
  
	 See https://issues.chromium.org/issues/41383759
	 */
  const timeoutHandle = setTimeout(() => resolve(false), MANUAL_TRIGGER_DELAY);

  // Cleanup
  return () => {
    clearTimeout(timeoutHandle);
    map.delete(element);
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

const observer = createIntersectionObserver(function isInViewportObserver(entries) {
  for (const entry of entries) {
    observer.unobserve(entry.target); // We only want the first run of the observer for each element.
    map.get(entry.target)?.(entry.isIntersecting);
    map.delete(entry.target);
  }
});
