// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState, useMemo, useCallback } from 'react';

import { indexIncludes, indexEquals } from './utils';
import { ButtonDropdownProps, HighlightProps } from '../interfaces';
import createItemsTree, { TreeIndex } from './create-items-tree';
import moveHighlightOneStep from './move-highlight';

interface UseHighlightedMenuOptions {
  items: ButtonDropdownProps.Items;
  hasExpandableGroups: boolean;
  isInRestrictedView?: boolean;
  usingMouse: React.MutableRefObject<boolean>;
}

interface UseHighlightedMenuApi extends HighlightProps {
  moveHighlight: (direction: -1 | 1) => void;
  expandGroup: (group?: ButtonDropdownProps.ItemGroup) => void;
  collapseGroup: () => void;
  reset: () => void;
}

export default function useHighlightedMenu({
  items,
  hasExpandableGroups,
  isInRestrictedView = false,
  usingMouse,
}: UseHighlightedMenuOptions): UseHighlightedMenuApi {
  const [targetIndex, setTargetIndexState] = useState<TreeIndex>([]);
  const [expandedIndex, setExpandedIndex] = useState<TreeIndex>([]);
  const [isUsingMouse, setIsUsingMouse] = useState<boolean>(usingMouse.current);

  const setTargetIndex = useCallback(
    (index: TreeIndex) => {
      if (!indexEquals(index, targetIndex)) {
        setTargetIndexState(index);
      }
      setIsUsingMouse(usingMouse.current);
    },
    [usingMouse, targetIndex]
  );

  const { getItem, getItemIndex, getSequentialIndex, getParentIndex } = useMemo(() => createItemsTree(items), [items]);

  const targetItem = useMemo(() => getItem(targetIndex), [targetIndex, getItem]);

  const isHighlighted = useCallback(
    (item: ButtonDropdownProps.ItemOrGroup) => {
      const index = getItemIndex(item);
      return indexIncludes(index, targetIndex);
    },
    [targetIndex, getItemIndex]
  );

  const isFocused = useCallback(
    (item: ButtonDropdownProps.ItemOrGroup) => {
      const index = getItemIndex(item);
      return !isUsingMouse && indexEquals(index, targetIndex);
    },
    [targetIndex, getItemIndex, isUsingMouse]
  );

  const isExpanded = useCallback(
    (group: ButtonDropdownProps.ItemGroup) => {
      const index = getItemIndex(group);

      return indexIncludes(index, expandedIndex);
    },
    [expandedIndex, getItemIndex]
  );

  const moveHighlight = useCallback(
    (direction: -1 | 1) => {
      const getNext = (index: TreeIndex) => {
        const nextIndex = getSequentialIndex(index, direction);
        const item = getItem(nextIndex || [-1]);

        if (!nextIndex || !item) {
          return null;
        }

        const parentIndex = getParentIndex(item);
        const parentItem = parentIndex && getItem(parentIndex);

        return { index: nextIndex, item, parent: parentItem || undefined };
      };

      const nextIndex = moveHighlightOneStep({
        startIndex: targetIndex,
        expandedIndex,
        getNext,
        hasExpandableGroups,
        isInRestrictedView,
      });

      if (nextIndex) {
        setTargetIndex(nextIndex);
      }
    },
    [
      targetIndex,
      expandedIndex,
      getItem,
      getSequentialIndex,
      getParentIndex,
      hasExpandableGroups,
      isInRestrictedView,
      setTargetIndex,
    ]
  );

  const highlightItem = useCallback(
    (item: ButtonDropdownProps.ItemOrGroup) => {
      setTargetIndex(getItemIndex(item));
    },
    [getItemIndex, setTargetIndex]
  );

  const expandGroup = useCallback(
    (group?: ButtonDropdownProps.ItemGroup) => {
      const groupIndex = group ? getItemIndex(group) : targetIndex;
      const firstChildIndex = [...groupIndex, 0];

      // move to the first child item unless in restricted mode
      setTargetIndex(isInRestrictedView ? groupIndex : firstChildIndex);
      setExpandedIndex(groupIndex);
    },
    [targetIndex, getItemIndex, isInRestrictedView, setTargetIndex]
  );

  const collapseGroup = useCallback(() => {
    if (expandedIndex.length > 0) {
      setTargetIndex(expandedIndex);
      setExpandedIndex(expandedIndex.slice(0, -1));
    }
  }, [expandedIndex, setTargetIndex]);

  const reset = useCallback(() => {
    setTargetIndex([]);
    setExpandedIndex([]);
  }, [setTargetIndex]);

  return {
    targetItem,
    isHighlighted,
    isFocused,
    isExpanded,
    moveHighlight,
    highlightItem,
    expandGroup,
    collapseGroup,
    reset,
  };
}
