// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { RefCallback, useCallback, useRef, useState } from 'react';

interface UseIntersectionObserverConfig {
  initialState?: boolean;
}

/**
 * A hook that uses an Intersection Observer on the target element ref
 * and detects if the element is intersecting with its parent.
 */
export function useIntersectionObserver<T extends HTMLElement>({
  initialState = false,
}: UseIntersectionObserverConfig = {}) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(initialState);

  const ref = useCallback<RefCallback<T>>(targetElement => {
    if (typeof IntersectionObserver === 'undefined') {
      // Do nothing in environments like JSDOM
      return;
    }

    if (observerRef.current) {
      // Dismiss previous observer because the target changed
      observerRef.current.disconnect();
    }

    // Create a new observer with the target element
    if (targetElement) {
      // Fix for AWSUI-60898: In Firefox, IntersectionObserver instances inside an
      //   iframe context can't detect visibility changes caused by changes to elements
      //   outside the iframe (e.g. if an element wrapping the iframe is set to `display: none`).
      let TopLevelIntersectionObserver = IntersectionObserver;
      try {
        if (window.top) {
          TopLevelIntersectionObserver = (window.top as typeof window).IntersectionObserver;
        }
      } catch {
        // Tried to access a cross-origin iframe. Fall back to current IntersectionObserver.
      }
      observerRef.current = new TopLevelIntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting));
      observerRef.current.observe(targetElement);
    }
  }, []);

  return { ref, isIntersecting };
}
