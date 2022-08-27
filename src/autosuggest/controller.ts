// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import { CancelableEventHandler, BaseKeyDetail } from '../internal/events';
import { KeyCode } from '../internal/keycode';
import { AutosuggestItem } from './interfaces';

export const useSelectVisibleOption = (
  filteredItems: readonly AutosuggestItem[],
  selectOption: (option: AutosuggestItem) => void,
  isInteractive: (option: AutosuggestItem) => boolean
) =>
  useCallback(
    (index: number) => {
      const option = filteredItems[index];
      if (option && isInteractive(option)) {
        selectOption(option);
      }
    },
    [filteredItems, selectOption, isInteractive]
  );

export const useHighlightVisibleOption = (
  filteredItems: readonly AutosuggestItem[],
  setHighlightedIndex: (index: number) => void,
  isHighlightable: (option: AutosuggestItem) => boolean
) =>
  useCallback(
    (index: number) => {
      const option = filteredItems[index];
      if (option && isHighlightable(option)) {
        setHighlightedIndex(index);
      }
    },
    [filteredItems, setHighlightedIndex, isHighlightable]
  );

export const useKeyboardHandler = (
  moveHighlight: (direction: -1 | 1) => void,
  openDropdown: () => void,
  selectHighlighted: () => void,
  open: boolean,
  onKeyDown?: CancelableEventHandler<BaseKeyDetail>
) => {
  return useCallback(
    (e: CustomEvent<BaseKeyDetail>) => {
      switch (e.detail.keyCode) {
        case KeyCode.down: {
          moveHighlight(1);
          openDropdown();
          e.preventDefault();
          break;
        }
        case KeyCode.up: {
          moveHighlight(-1);
          openDropdown();
          e.preventDefault();
          break;
        }
        case KeyCode.enter: {
          if (open) {
            selectHighlighted();
            e.preventDefault();
          }
          onKeyDown && onKeyDown(e);
          break;
        }
        default: {
          onKeyDown && onKeyDown(e);
        }
      }
    },
    [moveHighlight, selectHighlighted, onKeyDown, open, openDropdown]
  );
};
