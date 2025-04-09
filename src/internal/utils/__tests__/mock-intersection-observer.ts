// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
 When this file is imported, it automatically mocks the global `IntersectionObserver` class.
 The callbacks of all IntersectionObservers are only run when the `runAllIntersectionObservers`
 function is called.
*/

const allCallbacks = new Set<(entries: IntersectionObserverEntry[]) => void>();

global.IntersectionObserver = class IntersectionObserverMock {
  private elements = new Set<Element>();

  constructor(callback: IntersectionObserverCallback) {
    allCallbacks.add(entries => {
      const observedEntries = entries.filter(r => this.elements.has(r.target));

      callback(observedEntries, this as unknown as IntersectionObserver);
    });
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }
} as unknown as typeof IntersectionObserver;

/**
 * Runs all registered IntersectionObserver callbacks.
 * The callback will only contain entries for elements that are currently being observed.
 * If an element is not being observed or not included in the `results` parameter, it
 * will not be included in the callback.
 */
export function runAllIntersectionObservers(entries: Array<PartialEntry>) {
  allCallbacks.forEach(callback => callback(entries as IntersectionObserverEntry[]));
}

interface PartialEntry extends Partial<IntersectionObserverEntry> {
  target: Element;
  isIntersecting: boolean;
}
