// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { useContainerQuery } from '../../internal/hooks/container-queries';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';

function getScrollableContainers(element: HTMLElement) {
  let node: HTMLElement | null = element;

  while ((node = node.parentElement) && node !== document.body) {
    if (['scroll', 'auto'].indexOf(getComputedStyle(node).overflow) > -1) {
      return node;
    }
  }
  return null;
}

export function useStickyPosition(topOffset = 0) {
  const [stickyHeight, stickyMeasureRef] = useContainerQuery(rect => rect.height);
  const stickyRefObject = useRef<HTMLDivElement>(null);
  const stickyRef = useMergeRefs(stickyMeasureRef, stickyRefObject);

  const [stickyWidth, placeholderMeasureRef] = useContainerQuery(rect => rect.width);
  const placeholderRefObject = useRef<HTMLDivElement>(null);
  const placeholderRef = useMergeRefs(placeholderMeasureRef, placeholderRefObject);

  const placeholder = <div ref={placeholderRef} />;

  useEffect(() => {
    if (!stickyRefObject.current || !placeholderRefObject.current) {
      return;
    }
    const stickyElement = stickyRefObject.current;
    const placeholder = placeholderRefObject.current;
    const scrollParent = getScrollableContainers(stickyElement);
    const handler = () => {
      const stickyBox = stickyElement.getBoundingClientRect();
      const containerBox = scrollParent ? scrollParent.getBoundingClientRect() : { top: 0 };
      if (stickyBox.top - containerBox.top <= topOffset) {
        stickyElement.style.position = 'fixed';
        stickyElement.style.width = `${stickyWidth}px`;
        stickyElement.style.top = `${topOffset}px`;
        placeholder.style.height = `${stickyHeight}px`;
      } else {
        stickyElement.style.position = '';
        stickyElement.style.width = ``;
        stickyElement.style.top = ``;
        placeholder.style.height = ``;
      }
    };
    const eventTarget = scrollParent || window;
    eventTarget.addEventListener('scroll', handler);
    handler();
    return () => eventTarget.removeEventListener('scroll', handler);
  }, [topOffset, stickyWidth, stickyHeight, stickyRefObject, placeholderRefObject]);

  return [stickyRef, placeholder] as const;
}
