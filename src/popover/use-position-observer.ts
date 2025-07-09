// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useRef } from 'react';

interface Coords {
  x?: number;
  y?: number;
}

export default function usePopoverObserver(popoverRef: React.RefObject<HTMLElement>, callback: () => void) {
  const lastPosition = useRef<Coords>();

  useEffect(() => {
    let observer: MutationObserver;
    if (popoverRef.current) {
      observer = new MutationObserver(() => {
        if (!popoverRef.current?.parentElement) {
          return;
        }
        const { x, y } = popoverRef.current.parentElement.getBoundingClientRect();
        if (x !== lastPosition.current?.x || y !== lastPosition.current?.y) {
          lastPosition.current = { x, y };
          callback();
        }
      });
      observer.observe(popoverRef.current.ownerDocument, { attributes: true, subtree: true, childList: true });
    }
    return () => observer?.disconnect();
  }, [popoverRef, callback]);
}
