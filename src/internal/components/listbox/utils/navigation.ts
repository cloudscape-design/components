// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption } from '../../option/interfaces';

interface ListboxNavigationProps {
  options: ReadonlyArray<DropdownOption>;
  highlightedIndex: number;
  highlightedOption: DropdownOption | undefined;
  interactiveGroups: boolean;
  moveHighlight: (direction: -1 | 1) => void;
  goHome: () => void;
  goEnd: () => void;
}

/**
 * Arrow key handlers that wrap around the list: up from the first option goes to the end, down from the last row
 * goes to the start. Without interactive groups, the first child of a leading group counts as the first option.
 */
export const getListboxNavigation = ({
  options,
  highlightedIndex,
  highlightedOption,
  interactiveGroups,
  moveHighlight,
  goHome,
  goEnd,
}: ListboxNavigationProps) => ({
  goUp: () => {
    if (
      (!interactiveGroups && highlightedOption?.type === 'child' && highlightedIndex === 1) ||
      highlightedIndex === 0
    ) {
      goEnd();
      return;
    }
    moveHighlight(-1);
  },
  goDown: () => {
    if (highlightedIndex === options.length - 1) {
      goHome();
      return;
    }
    moveHighlight(1);
  },
});
