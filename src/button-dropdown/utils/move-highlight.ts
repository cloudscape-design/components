// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../interfaces';
import { TreeIndex } from './create-items-tree';
import { indexEquals, isItemGroup } from './utils';

// While every menu item except the edge ones have successors and predecessors,
// there are rules determining what items are eligible for highlighting for the
// given set of conditions. The function implements all these rules.

interface MoveHighlightProps {
  startIndex: TreeIndex;
  expandedIndex: TreeIndex;
  getNext: (index: TreeIndex) => {
    index: TreeIndex;
    item: ButtonDropdownProps.ItemOrGroup;
    parent?: ButtonDropdownProps.ItemOrGroup;
  } | null;
  hasExpandableGroups: boolean;
  isInRestrictedView: boolean;
}

export default function moveHighlight({
  startIndex,
  expandedIndex,
  getNext,
  hasExpandableGroups,
  isInRestrictedView,
}: MoveHighlightProps): TreeIndex | null {
  const tryMove = (currentIndex: TreeIndex): TreeIndex | null => {
    const next = getNext(currentIndex);

    if (!next) {
      return null;
    }

    // Prevents stepping into disabled expandable groups. However,
    // it's possible to navigate nested groups.
    if (next.parent?.disabled && hasExpandableGroups) {
      return tryMove(next.index);
    }

    // it is not allowed to highlight groups when non-expandable
    if (isItemGroup(next.item) && !hasExpandableGroups) {
      return tryMove(next.index);
    }

    // can only move within same parent unless is in restricted view
    if (hasExpandableGroups && !isInRestrictedView && !isSameParent(startIndex, next.index)) {
      return tryMove(next.index);
    }

    // in restricted view can only navigate to children if group is expanded
    if (
      hasExpandableGroups &&
      isInRestrictedView &&
      !isSameLevel(next.index, expandedIndex) &&
      !isIncluded(expandedIndex, next.index)
    ) {
      return tryMove(next.index);
    }

    return next.index;
  };

  return tryMove(startIndex);
}

function isSameParent(left: TreeIndex, right: TreeIndex) {
  return indexEquals(left.slice(0, -1), right.slice(0, -1));
}

function isSameLevel(left: TreeIndex, right: TreeIndex) {
  return left.length === right.length;
}

function isIncluded(parent: TreeIndex, child: TreeIndex) {
  return indexEquals(parent, child.slice(0, -1));
}
