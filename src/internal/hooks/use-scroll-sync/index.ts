// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useRef } from 'react';
import { supportsStickyPosition } from '../../utils/dom';

/**
 * useScrollSync returns scroll event handler to be attached to synchronized scroll elements.
 *
 * For example
 *    const handleScroll = useScrollSync([ref1, ref2]);
 *    <div ref={ref1} onScroll={handleScroll}/>
 *    <div ref={ref2} onScroll={handleScroll}/>
 */
export function useScrollSync(refs: Array<RefObject<any>>, disabled = !supportsStickyPosition()) {
  const activeElement = useRef<HTMLElement | null>(null);
  const onScroll = (event: React.UIEvent) => {
    const targetElement = event.target as HTMLElement;
    // remembers the first element that fires onscroll to align with other elements against it
    if (targetElement && (activeElement.current === null || activeElement.current === targetElement)) {
      requestAnimationFrame(() => {
        activeElement.current = targetElement;
        refs.forEach(ref => {
          const element = ref.current;
          if (element && element !== targetElement) {
            element.scrollLeft = targetElement.scrollLeft;
          }
        });
        // unblock the ability to scroll the synced elements
        requestAnimationFrame(() => {
          activeElement.current = null;
        });
      });
    }
  };

  return !disabled ? onScroll : undefined;
}
