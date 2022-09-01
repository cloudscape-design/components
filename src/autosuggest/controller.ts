// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import { BaseKeyDetail } from '../internal/events';
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

interface KeyboardHandlerOptions {
  open: boolean;
  onPressArrowDown(): void;
  onPressArrowUp(): void;
  onPressEnter(): void;
  onKeyDown(event: CustomEvent<BaseKeyDetail>): void;
}

export const useKeyboardHandler = ({
  open,
  onPressArrowDown,
  onPressArrowUp,
  onPressEnter,
  onKeyDown,
}: KeyboardHandlerOptions) => {
  return (e: CustomEvent<BaseKeyDetail>) => {
    switch (e.detail.keyCode) {
      case KeyCode.down: {
        onPressArrowDown();
        e.preventDefault();
        break;
      }
      case KeyCode.up: {
        onPressArrowUp();
        e.preventDefault();
        break;
      }
      case KeyCode.enter: {
        if (open) {
          onPressEnter();
          e.preventDefault();
        }
        onKeyDown(e);
        break;
      }
      default: {
        onKeyDown(e);
      }
    }
  };
};
