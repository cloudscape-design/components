// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useState } from 'react';
import { useResizeObserver } from '../../internal/hooks/container-queries';

export default function useAppLayoutOffsets(element: HTMLDivElement | null): { left: number; right: number } {
  const [offsets, setOffsets] = useState({ left: 0, right: 0 });

  const updatePosition = useCallback(() => {
    if (!element) {
      return;
    }
    const { left, right } = element.getBoundingClientRect();
    const bodyWidth = document.body.clientWidth;

    setOffsets({ left, right: bodyWidth - right });
  }, [element]);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  const getElement = useCallback(() => element, [element]);
  useResizeObserver(getElement, updatePosition);

  return offsets;
}
