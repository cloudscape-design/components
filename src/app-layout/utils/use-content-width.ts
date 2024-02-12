// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';
import { useCallback, useEffect, useState } from 'react';

interface AppLayoutOffsets {
  left: number;
  right: number;
  width: number;
}

export default function useAppLayoutOffsets(element: HTMLDivElement | null): AppLayoutOffsets {
  const [offsets, setOffsets] = useState({ left: 0, right: 0, width: Number.POSITIVE_INFINITY });

  const updatePosition = useCallback(() => {
    // skip reading sizes in JSDOM
    if (!element || !document.body.clientWidth) {
      return;
    }
    const { left, right } = element.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;

    setOffsets({ left, right: bodyWidth - right, width: bodyWidth });
  }, [element]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  const getElement = useCallback(() => element, [element]);
  useResizeObserver(getElement, updatePosition);

  return offsets;
}
