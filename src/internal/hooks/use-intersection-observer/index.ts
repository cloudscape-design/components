// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { RefCallback, useCallback, useRef, useState } from 'react';

/**
 * A hook that uses an Intersection Observer on the target element ref
 * and detects if the element is intersecting with its parent.
 */
export function useIntersectionObserver<T extends HTMLElement>() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

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
      observerRef.current = new IntersectionObserver(([entry]) => setIsIntersecting(entry.isIntersecting));
      observerRef.current.observe(targetElement);
    }
  }, []);

  return { ref, isIntersecting };
}
