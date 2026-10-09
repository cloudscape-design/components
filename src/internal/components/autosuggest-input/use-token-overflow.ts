// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useLayoutEffect, useRef, useState } from 'react';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

interface UseTokenOverflowResult {
  containerRef: React.RefObject<HTMLDivElement>;
  visibleCount: number | undefined;
  tokenListMaxWidth: number | undefined;
}

/**
 * Measures token and container widths to determine how many tokens can be shown
 * inline before the rest must collapse into the overflow "+N" pill.
 *
 * @param measureRef - ref to the invisible measurement container
 * @param triggerRowRef - ref to the visible token trigger row (for padding/gap CSS)
 * @param tokenCount - current total token count; changing it re-triggers measurement
 * @param tokenContentKey - stable string derived from token labels/icons; changing it re-triggers measurement when content changes without count changing
 * @param enabled - set to false in non-token mode to skip all measurement work
 */
export function useTokenOverflow(
  measureRef: React.RefObject<HTMLDivElement>,
  triggerRowRef: React.RefObject<HTMLDivElement>,
  tokenCount: number,
  tokenContentKey: string,
  enabled: boolean
): UseTokenOverflowResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState<number | undefined>(undefined);
  const [tokenListMaxWidth, setTokenListMaxWidth] = useState<number | undefined>(undefined);
  const lastOverflowResultRef = useRef<{ count: number | undefined; maxWidth: number | undefined }>({
    count: undefined,
    maxWidth: undefined,
  });

  const [containerResizeCount, setContainerResizeCount] = useState(0);
  const lastContainerWidthRef = useRef(0);
  useResizeObserver(
    () => (enabled ? containerRef.current : null),
    entry => {
      if (entry.borderBoxWidth > 0 && entry.borderBoxWidth !== lastContainerWidthRef.current) {
        lastContainerWidthRef.current = entry.borderBoxWidth;
        setContainerResizeCount(n => n + 1);
      }
    }
  );

  useLayoutEffect(() => {
    if (!enabled || !measureRef.current || !containerRef.current || !triggerRowRef.current) {
      return;
    }
    measureRef.current.inert = true;
    const containerWidth = containerRef.current.offsetWidth ?? 0;
    if (containerWidth <= 0) {
      return;
    }

    const tokenEls = Array.from(measureRef.current.querySelectorAll<HTMLElement>('[data-measure-token]'));
    if (tokenEls.length === 0) {
      if (lastOverflowResultRef.current.count !== 0) {
        lastOverflowResultRef.current = { count: 0, maxWidth: undefined };
        setVisibleCount(0);
        setTokenListMaxWidth(undefined);
      }
      return;
    }

    const pillEl = measureRef.current.querySelector<HTMLElement>('[data-measure-pill]');
    const pillWidth = pillEl?.offsetWidth ?? 0;

    const triggerEl = triggerRowRef.current!;
    const triggerStyle = getComputedStyle(triggerEl);
    const paddingInline = parseFloat(triggerStyle.paddingInlineStart) + parseFloat(triggerStyle.paddingInlineEnd);
    const gap = parseFloat(triggerStyle.gap) || parseFloat(triggerStyle.columnGap);

    const iconEl = triggerEl.querySelector<HTMLElement>('[data-search-icon]')!;
    const iconWidth = iconEl.offsetWidth;

    const inputMinWidth = Math.floor(containerWidth * 0.2);

    const tokenWidths = tokenEls.map(el => el.offsetWidth);
    const totalAll = tokenWidths.reduce((s, w) => s + w, 0) + gap * Math.max(tokenWidths.length - 1, 0);
    const budgetWithoutPill = containerWidth - paddingInline - iconWidth - inputMinWidth - gap;
    const budgetWithPill = budgetWithoutPill - pillWidth - gap;

    let newCount: number;
    let newMaxWidth: number | undefined;

    if (totalAll <= budgetWithoutPill) {
      newCount = tokenCount;
      newMaxWidth = undefined;
    } else {
      let used = 0;
      let count = 0;
      for (let i = tokenWidths.length - 1; i >= 0; i--) {
        const cost = count === 0 ? tokenWidths[i] : gap + tokenWidths[i];
        if (used + cost > budgetWithPill) {
          break;
        }
        used += cost;
        count++;
      }
      newCount = count;
      newMaxWidth = budgetWithPill + gap + pillWidth;
    }

    if (newCount !== lastOverflowResultRef.current.count || newMaxWidth !== lastOverflowResultRef.current.maxWidth) {
      lastOverflowResultRef.current = { count: newCount, maxWidth: newMaxWidth };
      setVisibleCount(newCount);
      setTokenListMaxWidth(newMaxWidth);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, tokenCount, tokenContentKey, containerResizeCount]);

  return { containerRef, visibleCount, tokenListMaxWidth };
}
