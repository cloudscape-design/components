// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ButtonDropdownProps } from '../interfaces';
import { TreeIndex } from './create-items-tree';
import { indexEquals, isItemGroup } from './utils';

// While every menu item except the edge ones have successors and predecessors,
// there are rules determining what items are eligible for highlighting for the
// given set of conditions. The function implements all these rules.
//
// Expandability is resolved per node (isExpandable), so a dropdown can mix expandable and flat
// groups. planeOf(index) gives an index's navigable plane: an expandable group's children form
// their own plane, everything else shares the top plane. Desktop confines navigation to one
// plane; restricted (mobile) view also admits the currently-expanded group's plane.

interface MoveHighlightProps {
  startIndex: TreeIndex;
  expandedIndex: TreeIndex;
  getNext: (index: TreeIndex) => {
    index: TreeIndex;
    item: ButtonDropdownProps.ItemOrGroup;
    parent?: ButtonDropdownProps.ItemOrGroup;
  } | null;
  isExpandable: (item: ButtonDropdownProps.ItemOrGroup) => boolean;
  planeOf: (index: TreeIndex) => TreeIndex;
  isInRestrictedView: boolean;
}

export default function moveHighlight({
  startIndex,
  expandedIndex,
  getNext,
  isExpandable,
  planeOf,
  isInRestrictedView,
}: MoveHighlightProps): TreeIndex | null {
  const tryMove = (currentIndex: TreeIndex): TreeIndex | null => {
    const next = getNext(currentIndex);

    if (!next) {
      return null;
    }

    // don't step into a disabled expandable group; a flat group's children stay navigable
    if (next.parent && isExpandable(next.parent) && next.parent.disabled) {
      return tryMove(next.index);
    }

    // only an expandable group's header is highlightable; a flat group's is skipped
    if (isItemGroup(next.item) && !isExpandable(next.item)) {
      return tryMove(next.index);
    }

    // confine to the current plane; in fully-flat mode every index is top plane so this never clamps
    if (!isInRestrictedView && !isSamePlane(planeOf(startIndex), planeOf(next.index))) {
      return tryMove(next.index);
    }

    // in restricted view, admit the top plane plus the currently-expanded group's plane
    if (
      isInRestrictedView &&
      !isSamePlane(planeOf(next.index), []) &&
      !isSamePlane(planeOf(next.index), expandedIndex)
    ) {
      return tryMove(next.index);
    }

    return next.index;
  };

  return tryMove(startIndex);
}

function isSamePlane(left: TreeIndex, right: TreeIndex) {
  return indexEquals(left, right);
}
