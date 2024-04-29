// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback, useEffect, useRef, useState } from 'react';
import { useObservedElement } from './use-observed-element';
import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';
import { getLogicalBoundingClientRect } from '../../internal/direction';

export function useAppLayoutPlacement(headerSelector: string, footerSelector: string) {
  const mainElementRef = useRef<HTMLElement>(null);
  const headerHeight = useObservedElement(headerSelector);
  const footerHeight = useObservedElement(footerSelector);
  const [offsets, setOffsets] = useState({
    insetInlineStart: 0,
    insetInlineEnd: 0,
    inlineSize: Number.POSITIVE_INFINITY,
  });

  const updatePosition = useCallback(() => {
    if (!mainElementRef.current) {
      return;
    }
    const { insetInlineStart, insetInlineEnd, inlineSize } = getLogicalBoundingClientRect(mainElementRef.current);

    // skip reading sizes in JSDOM
    if (inlineSize === 0) {
      return;
    }

    setOffsets({ insetInlineStart, insetInlineEnd: inlineSize - insetInlineEnd, inlineSize });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [updatePosition]);

  useResizeObserver(mainElementRef, updatePosition);

  return [mainElementRef, { ...offsets, insetBlockStart: headerHeight, insetBlockEnd: footerHeight }] as const;
}
