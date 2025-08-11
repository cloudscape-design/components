// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useMemo, useRef, useState } from 'react';

import { useMergeRefs, useReducedMotion, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { isDevelopment } from '../internal/is-development.js';
import { focusFlashById, focusFlashFocusableArea } from './flash.js';
import { FlashbarProps } from './interfaces.js';

import styles from './styles.css.js';

// Exported for testing
export const handleFlashDismissedInternal = (
  dismissedId: string | undefined,
  items: ReadonlyArray<FlashbarProps.MessageDefinition> | undefined,
  refCurrent: HTMLDivElement | null,
  flashRefsCurrent: Record<string | number, HTMLDivElement | null>
) => {
  if (!items || !dismissedId || !refCurrent) {
    return;
  }

  const dismissedIndex = items.findIndex(item => (item.id ?? '') === dismissedId);
  if (dismissedIndex === -1) {
    return;
  }

  let nextItemIndex = dismissedIndex + 1;
  if (nextItemIndex >= items.length) {
    nextItemIndex = dismissedIndex - 1;
  }

  // If there's no next item, focus the first instance of the main element (or element with role=main)
  if (nextItemIndex < 0 || nextItemIndex >= items.length) {
    const mainElement = document.querySelector('main') ?? document.querySelector('[role="main"]');
    mainElement?.focus();
    return;
  }

  const nextItemId = items[nextItemIndex].id ?? nextItemIndex;

  // Try to focus on the next item, but with a small delay to ensure the DOM is updated
  // This is especially important for collapsible flashbars where the next item might become visible
  const attemptFocus = () => {
    const nextFlashElement = flashRefsCurrent[nextItemId];
    if (!nextFlashElement) {
      // If the next flash element is not available, it might be because the flashbar is collapsed
      // In that case, try to focus on the notification bar button or the main element
      const notificationBarButton = refCurrent?.querySelector(`.${styles.button}`);
      if (notificationBarButton) {
        (notificationBarButton as HTMLElement).focus();
        return;
      }

      const mainElement = document.querySelector('main') ?? document.querySelector('[role="main"]');
      mainElement?.focus();
      return;
    }
    focusFlashFocusableArea(nextFlashElement);
  };

  setTimeout(attemptFocus, 0);
};

// Common logic for collapsible and non-collapsible Flashbar
export function useFlashbar({
  items,
  onItemsAdded,
  onItemsChanged,
  onItemsRemoved,
  ...restProps
}: FlashbarProps & {
  onItemsAdded?: (items: FlashbarProps.MessageDefinition[]) => void;
  onItemsRemoved?: (items: FlashbarProps.MessageDefinition[]) => void;
  onItemsChanged?: (options?: { allItemsHaveId?: boolean; isReducedMotion?: boolean }) => void;
}) {
  const { __internalRootRef } = useBaseComponent('Flashbar', {
    props: { stackItems: restProps.stackItems },
  });
  const allItemsHaveId = useMemo(() => items.every(item => 'id' in item), [items]);
  const baseProps = getBaseProps(restProps);
  const ref = useRef<HTMLDivElement | null>(null);
  const flashRefs = useRef<Record<string | number, HTMLDivElement | null>>({});
  const mergedRef = useMergeRefs(ref, __internalRootRef);
  const isReducedMotion = useReducedMotion(ref);
  const isVisualRefresh = useVisualRefresh();
  const [previousItems, setPreviousItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>(items);
  const [nextFocusId, setNextFocusId] = useState<string | null>(null);

  if (isDevelopment) {
    if (items?.some(item => item.ariaRole === 'alert' && !item.id)) {
      warnOnce(
        'Flashbar',
        `You provided \`ariaRole="alert"\` for a flashbar item without providing an \`id\`. Focus will not be moved to the newly added flash message.`
      );
    }
  }

  // Track new or removed item IDs in state to only trigger focus changes for newly added items.
  // https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-getderivedstatefromprops
  if (items) {
    const newItems = items.filter(({ id }) => id && !previousItems.some(item => item.id === id));
    const removedItems = previousItems.filter(({ id }) => id && !items.some(item => item.id === id));
    if (newItems.length > 0 || removedItems.length > 0) {
      setPreviousItems(items);
      onItemsAdded?.(newItems);
      onItemsRemoved?.(removedItems);
      onItemsChanged?.({ allItemsHaveId, isReducedMotion });

      const newFocusItems = newItems.filter(({ ariaRole }) => ariaRole === 'alert');
      if (newFocusItems.length > 0) {
        setNextFocusId(newFocusItems[0].id!);
      }
    }
  }

  useEffect(() => {
    if (nextFocusId) {
      focusFlashById(ref.current, nextFocusId);
    }
  }, [nextFocusId, ref]);

  const handleFlashDismissed = (dismissedId?: string) => {
    handleFlashDismissedInternal(dismissedId, items, ref.current, flashRefs.current);
  };

  return {
    allItemsHaveId,
    baseProps,
    isReducedMotion,
    isVisualRefresh,
    mergedRef,
    ref,
    flashRefs,
    handleFlashDismissed,
  };
}
