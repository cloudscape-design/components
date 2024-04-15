// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useRef, useState } from 'react';
import { useObservedElement } from './use-observed-element';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

export function useAppLayoutPlacement(headerSelector: string, footerSelector: string) {
  const mainElementRef = useRef<HTMLElement>(null);
  const headerHeight = useObservedElement(headerSelector);
  const footerHeight = useObservedElement(footerSelector);
  const [offsets, setOffsets] = useState({ left: 0, right: 0, width: Number.POSITIVE_INFINITY });

  const updatePosition = useCallback(() => {
    if (!mainElementRef.current) {
      return;
    }
    const { left, right, width } = mainElementRef.current.getBoundingClientRect();

    // skip reading sizes in JSDOM
    if (width === 0) {
      return;
    }

    setOffsets({ left, right: width - right, width });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  useResizeObserver(mainElementRef, updatePosition);

  return [mainElementRef, { ...offsets, top: headerHeight, bottom: footerHeight }] as const;
}
