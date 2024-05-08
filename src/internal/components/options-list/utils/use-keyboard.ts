// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import { KeyCode } from '../../../keycode';
import { BaseKeyDetail, CancelableEventHandler } from '../../../events';

const HOME = 36;
const END = 35;

interface UseMenuKeyboard {
  (inputProps: {
    goUp: () => void;
    goDown: () => void;
    selectOption: () => void;
    goHome: () => void;
    goEnd: () => void;
    closeDropdown: () => void;
    preventNativeSpace?: boolean;
  }): CancelableEventHandler<BaseKeyDetail>;
}

export const useMenuKeyboard: UseMenuKeyboard = ({
  goUp,
  goDown,
  selectOption,
  goHome,
  goEnd,
  closeDropdown,
  preventNativeSpace = false,
}) => {
  return useCallback(
    (e: CustomEvent<BaseKeyDetail>) => {
      switch (e.detail.keyCode) {
        case KeyCode.up:
          e.preventDefault();
          goUp();
          break;
        case KeyCode.down:
          e.preventDefault();
          goDown();
          break;
        case HOME:
          goHome();
          break;
        case END:
          goEnd();
          break;
        case KeyCode.escape:
          e.stopPropagation();
          closeDropdown();
          break;
        case KeyCode.enter:
          e.preventDefault();
          selectOption();
          break;
        case KeyCode.space:
          if (preventNativeSpace) {
            e.preventDefault();
            selectOption();
          }
      }
    },
    [selectOption, goHome, goEnd, closeDropdown, preventNativeSpace, goUp, goDown]
  );
};

interface UseTriggerKeyboard {
  (inputProps: { openDropdown: () => void; goHome: () => void }): CancelableEventHandler<BaseKeyDetail>;
}

export const useTriggerKeyboard: UseTriggerKeyboard = ({ openDropdown, goHome }) => {
  return useCallback(
    (e: CustomEvent<BaseKeyDetail>) => {
      switch (e.detail.keyCode) {
        case KeyCode.up:
        case KeyCode.down:
          e.preventDefault();
          goHome();
          openDropdown();
          break;
        case KeyCode.space:
        case KeyCode.enter:
          e.preventDefault();
          openDropdown();
          break;
      }
    },
    [openDropdown, goHome]
  );
};
