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
  tokensRef: React.RefObject<HTMLElement>;
  inputRef: React.RefObject<HTMLElement>;
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
  tokensRef,
  inputRef,
  layoutKey,
}: UseTokenOverflowOptions): UseTokenOverflowResult {
  const [containerWidth, containerRef] = useContainerQuery(entry => entry.borderBoxWidth);
  const [visibleCount, setVisibleCount] = useState(tokenCount);

  useLayoutEffect(() => {
    const tokens = tokensRef.current;
    const input = inputRef.current;
    const measure = measureRef.current;
    if (!enabled || !tokens || !input || !measure || !containerWidth) {
      setVisibleCount(tokenCount);
      return;
    }
    measure.inert = true;

    // The tokens and the input share the available space, whatever the tokens currently take.
    const availableWidth = tokens.offsetWidth + input.offsetWidth;
    const gap = parseFloat(getComputedStyle(tokens).columnGap) || 0;
    const inputMinWidth = resolveLength(getComputedStyle(input).minInlineSize, containerWidth);
    const triggerWidth = measureTriggerRef.current?.offsetWidth ?? 0;
    const tokenWidths = Array.from(measure.querySelectorAll<HTMLElement>(`.${styles['measurement-token']}`)).map(
      el => el.offsetWidth
    );

    const budget = availableWidth - inputMinWidth;
    const totalWidth = tokenWidths.reduce((sum, width) => sum + width + gap, -gap);
    setVisibleCount(
      totalWidth <= budget ? tokenWidths.length : countFittingFromEnd(tokenWidths, budget - triggerWidth - gap, gap)
    );
  }, [
    enabled,
    tokenCount,
    tokenContentKey,
    containerWidth,
    layoutKey,
    measureRef,
    measureTriggerRef,
    tokensRef,
    inputRef,
  ]);

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
