// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { useStableEventHandler } from '../use-stable-event-handler';
import { createSingletonHandler, UseSingleton } from '../use-singleton-handler';

// Map of selector -> use-mutation-singleton.
const observerSingletons = new Map<string, UseSingleton<void>>();

const useAttributesMutationSingleton = createSingletonHandler<void>(handler => {
  const observer = new MutationObserver(() => handler());
  observer.observe(document.body, { attributes: true, subtree: true });
  return () => observer.disconnect();
});

/**
 * Fires onChange with the given target element as an argument every time any DOM node attribute changes.
 *
 * @deprecated The hook has significant performance implications. Consider alternatives.
 */
export function useAttributesMutationObserver(
  elementRef: React.RefObject<HTMLElement>,
  onChange: (element: HTMLElement) => void
) {
  const handler = useStableEventHandler(() => {
    if (elementRef.current) {
      onChange(elementRef.current);
    }
  });
  useAttributesMutationSingleton(handler);

  useEffect(() => {
    handler();
  }, [handler]);
}

/**
 * Attaches mutation observer to a node described by the given selector. Only one mutation observer
 * instance is created per selector. When callbacks are no longer attached the observer is disconnected.
 * When the target node is removed from the DOM the observer is disconnected.
 *
 * Note: the observers are cached by selector. Using different selectors for the same node will result in
 * creation of multiple observer instances.
 *
 * @param selector - DOM selector of the target element. Use unique IDs for arbitrary elements.
 * @param onObserve - callback fired when the mutation is observed.
 * @param options - MutationObserver options.
 */
export function useMutationObserver(
  selector: string,
  onObserve: (element: HTMLElement) => void,
  options: MutationObserverInit = { attributes: true }
) {
  const elementRef = useRef<HTMLElement | null>(null);

  const handler = useStableEventHandler(() => {
    if (elementRef.current) {
      onObserve(elementRef.current);
    }
  });

  useEffect(() => {
    elementRef.current = document.querySelector(selector);
    handler();
  }, [handler, selector]);

  const useMutationSingleton =
    observerSingletons.get(selector) ||
    createSingletonHandler(handler => {
      const element = document.querySelector(selector);
      if (element) {
        const observer = new MutationObserver(() => handler());
        observer.observe(element, options);
        return () => observer.disconnect();
      }
      return () => undefined;
    });

  observerSingletons.set(selector, useMutationSingleton);

  useMutationSingleton(handler);
}
