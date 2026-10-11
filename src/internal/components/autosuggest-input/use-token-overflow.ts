// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useLayoutEffect, useState } from 'react';

import { useContainerQuery } from '@cloudscape-design/component-toolkit';

import styles from './styles.css.js';

interface UseTokenOverflowOptions {
  enabled: boolean;
  tokenCount: number;
  tokenContentKey: string;
  measureRef: React.RefObject<HTMLElement>;
  measureTriggerRef: React.RefObject<HTMLElement>;
  fieldRef: React.RefObject<HTMLElement>;
  leadingIconRef: React.RefObject<HTMLElement>;
  inputWrapperRef: React.RefObject<HTMLElement>;
  layoutKey: string;
}

interface UseTokenOverflowResult {
  containerRef: React.Ref<HTMLDivElement>;
  visibleCount: number;
}

/**
 * Returns how many trailing tokens fit fully next to the input; the rest collapse into the overflow trigger.
 */
export function useTokenOverflow({
  enabled,
  tokenCount,
  tokenContentKey,
  measureRef,
  measureTriggerRef,
  fieldRef,
  leadingIconRef,
  inputWrapperRef,
  layoutKey,
}: UseTokenOverflowOptions): UseTokenOverflowResult {
  const [containerWidth, containerRef] = useContainerQuery(entry => entry.borderBoxWidth);
  const [visibleCount, setVisibleCount] = useState(tokenCount);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    const measure = measureRef.current;
    if (!enabled || !field || !measure || !containerWidth) {
      setVisibleCount(tokenCount);
      return;
    }
    measure.inert = true;

    const fieldStyle = getComputedStyle(field);
    const paddingInline = parseFloat(fieldStyle.paddingInlineStart) + parseFloat(fieldStyle.paddingInlineEnd);
    const gap = parseFloat(fieldStyle.columnGap) || 0;
    const contentWidth = containerWidth - paddingInline;
    const inputMinWidth = resolveLength(
      inputWrapperRef.current ? getComputedStyle(inputWrapperRef.current).minInlineSize : '',
      contentWidth
    );
    const iconWidth = leadingIconRef.current?.offsetWidth ?? 0;
    const triggerWidth = measureTriggerRef.current?.offsetWidth ?? 0;
    const tokenWidths = Array.from(measure.querySelectorAll<HTMLElement>(`.${styles['measurement-token']}`)).map(
      el => el.offsetWidth
    );

    const budget = contentWidth - iconWidth - inputMinWidth - 2 * gap;
    const totalWidth = tokenWidths.reduce((sum, width) => sum + width + gap, -gap);
    setVisibleCount(
      totalWidth <= budget ? tokenWidths.length : countFittingFromEnd(tokenWidths, budget - triggerWidth - gap, gap)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tokenCount, tokenContentKey, containerWidth, layoutKey]);

  return { containerRef, visibleCount: Math.min(visibleCount, tokenCount) };
}

function countFittingFromEnd(widths: number[], budget: number, gap: number) {
  let used = -gap;
  let count = 0;
  for (let i = widths.length - 1; i >= 0 && used + gap + widths[i] <= budget; i--) {
    used += gap + widths[i];
    count++;
  }
  return count;
}

function resolveLength(value: string, base: number) {
  const number = parseFloat(value);
  if (isNaN(number)) {
    return 0;
  }
  return value.trim().endsWith('%') ? (base * number) / 100 : number;
}
