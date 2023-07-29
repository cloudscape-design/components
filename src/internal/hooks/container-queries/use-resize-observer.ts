// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ResizeObserver, ResizeObserverEntry } from '@juggle/resize-observer';
import React, { useEffect, useLayoutEffect } from 'react';
import { useStableEventHandler } from '../use-stable-event-handler';
import { ContainerQueryEntry } from '@cloudscape-design/component-toolkit';
import { convertResizeObserverEntry } from './utils';

type ElementReference = (() => Element | null) | React.RefObject<Element>;

/**
 * Attaches resize-observer to the referenced element.
 *
 * Examples:
 *     // With React reference
 *     const ref = useRef(null)
 *     useResizeObserver(ref, (entry) => setState(getWidth(entry)))
 *
 *     // With ID reference
 *     const getElement = useCallback(() => document.getElementById(id), [id])
 *     useResizeObserver(getElement, (entry) => setState(getWidth(entry)))
 *
 * @param elementRef React reference or memoized getter for the target element
 * @param onObserve Function to fire when observation occurs
 */
export function useResizeObserver(elementRef: ElementReference, onObserve: (entry: ContainerQueryEntry) => void) {
  const stableOnObserve = useStableEventHandler(onObserve);

  // This effect provides a synchronous update required to prevent flakiness when initial state and first observed state are different.
  // Can potentially conflict with React concurrent mode: https://17.reactjs.org/docs/concurrent-mode-intro.html.
  // A possible solution would be to make consumers not render any content until the first (asynchronous) observation is available.
  useLayoutEffect(
    () => {
      const element = typeof elementRef === 'function' ? elementRef() : elementRef?.current;
      if (element) {
        onObserve(convertResizeObserverEntry(new ResizeObserverEntry(element)));
      }
    },
    // This effect is only needed for the first render to provide a synchronous update.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    const element = typeof elementRef === 'function' ? elementRef() : elementRef?.current;
    if (element) {
      let connected = true;
      const observer = new ResizeObserver(entries => {
        // Prevent observe notifications on already unmounted component.
        if (connected) {
          stableOnObserve(convertResizeObserverEntry(entries[0]));
        }
      });
      observer.observe(element);
      return () => {
        connected = false;
        observer.disconnect();
      };
    }
  }, [elementRef, stableOnObserve]);
}
