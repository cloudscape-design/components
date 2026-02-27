// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useMemo, useRef, useState } from 'react';

import { useMergeRefs, useReducedMotion, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { useDebounceCallback } from '../internal/hooks/use-debounce-callback';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { isDevelopment } from '../internal/is-development';
import { persistFlashbarDismiss, retrieveFlashbarDismiss } from '../internal/persistence';
import { focusFlashById, focusFlashFocusableArea } from './flash';
import { FlashbarProps, InternalFlashbarProps } from './interfaces';
import { FOCUS_DEBOUNCE_DELAY } from './utils';

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

  // If there's no next item, focus the first instance of the h1 element
  if (nextItemIndex < 0 || nextItemIndex >= items.length) {
    const h1Element = document.querySelector('h1');
    h1Element?.focus();
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

      const h1Element = document.querySelector('h1');
      h1Element?.focus();
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
  __internalRootRef,
  ...restProps
}: InternalFlashbarProps & {
  onItemsAdded?: (items: FlashbarProps.MessageDefinition[]) => void;
  onItemsRemoved?: (items: FlashbarProps.MessageDefinition[]) => void;
  onItemsChanged?: (options?: { allItemsHaveId?: boolean; isReducedMotion?: boolean }) => void;
}) {
  // eslint-disable-next-line no-restricted-syntax -- Optional property existence check
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

  const debouncedFocus = useDebounceCallback(focusFlashById, FOCUS_DEBOUNCE_DELAY);

  useEffect(() => {
    if (nextFocusId) {
      debouncedFocus(ref.current, nextFocusId);
    }
  }, [debouncedFocus, nextFocusId, ref]);

  const handleFlashDismissed = (dismissedId?: string, persistenceConfig?: FlashbarProps.PersistenceConfig) => {
    handleFlashDismissedInternal(dismissedId, items, ref.current, flashRefs.current);
    if (persistenceConfig?.uniqueKey) {
      persistFlashbarDismiss(persistenceConfig);
    }
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

// Hook for managing flashbar items visibility with persistence
export function useFlashbarVisibility(items: ReadonlyArray<FlashbarProps.MessageDefinition>) {
  const [checkedPersistenceKeys, setCheckedPersistenceKeys] = useState<Set<string>>(() => new Set());
  const [persistentItemsVisibility, setPersistentItemsVisibility] = useState<Map<string, boolean>>(() => new Map());

  const visibleItems = items.filter(
    item =>
      !item.persistenceConfig?.uniqueKey || persistentItemsVisibility.get(item.persistenceConfig.uniqueKey) === true
  );

  useEffect(() => {
    const newPersistentItems = items.filter(
      item => item.persistenceConfig?.uniqueKey && !checkedPersistenceKeys.has(item.persistenceConfig.uniqueKey)
    );

    if (newPersistentItems.length === 0) {
      return;
    }

    let isMounted = true;

    const checkNewPersistentItems = async () => {
      try {
        const results = await Promise.all(
          newPersistentItems.map(async item => {
            try {
              const isDismissed = await retrieveFlashbarDismiss(item.persistenceConfig!);
              return {
                key: item.persistenceConfig!.uniqueKey,
                visible: !isDismissed,
              };
            } catch {
              return {
                key: item.persistenceConfig!.uniqueKey,
                visible: true,
              };
            }
          })
        );

        if (!isMounted) {
          return;
        }

        setPersistentItemsVisibility(prev => {
          const updated = new Map(prev);
          results.forEach(({ key, visible }) => updated.set(key, visible));
          return updated;
        });

        setCheckedPersistenceKeys(prev => {
          const updated = new Set(prev);
          results.forEach(({ key }) => updated.add(key));
          return updated;
        });
      } catch {
        if (!isMounted) {
          return;
        }
        // Fallback if Promise.all itself fails, set all newPersistentItems to visible
        setPersistentItemsVisibility(prev => {
          const updated = new Map(prev);
          newPersistentItems.forEach(item => updated.set(item.persistenceConfig!.uniqueKey, true));
          return updated;
        });
      }
    };

    checkNewPersistentItems();

    return () => {
      isMounted = false;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  return visibleItems;
}
