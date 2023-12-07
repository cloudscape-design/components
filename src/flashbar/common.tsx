// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { getBaseProps } from '../internal/base-component';
import { FlashbarProps } from './interfaces';
import { focusFlashById } from './flash';
import { isDevelopment } from '../internal/is-development';
import { useReducedMotion, warnOnce } from '@cloudscape-design/component-toolkit/internal';

export const componentName = 'Flashbar';

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
  const { __internalRootRef } = useBaseComponent(componentName);
  const allItemsHaveId = useMemo(() => items.every(item => 'id' in item), [items]);
  const baseProps = getBaseProps(restProps);
  const ref = useRef<HTMLDivElement | null>(null);
  const [breakpoint, breakpointRef] = useContainerBreakpoints(['xs']);
  const mergedRef = useMergeRefs(ref, breakpointRef, __internalRootRef);
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

  return {
    allItemsHaveId,
    baseProps,
    breakpoint,
    isReducedMotion,
    isVisualRefresh,
    mergedRef,
    ref,
  };
}
