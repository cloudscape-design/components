// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseKeyDetail, CancelableEventHandler } from '../../../../types/events';
import { KeyCode } from '../../../keycode';

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
    // Prevents the native Home and End action, which would also scroll the page or a scroll container.
    // Leave it off when focus is in a text input, where Home and End move the cursor.
    preventNativeHomeEnd?: boolean;
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
  preventNativeHomeEnd = false,
}) => {
  return (event: CustomEvent<BaseKeyDetail>) => {
    switch (event.detail.keyCode) {
      case KeyCode.up:
        event.preventDefault();
        goUp();
        break;
      case KeyCode.down:
        event.preventDefault();
        goDown();
        break;
      case HOME:
        if (preventNativeHomeEnd) {
          event.preventDefault();
        }
        goHome();
        break;
      case END:
        if (preventNativeHomeEnd) {
          event.preventDefault();
        }
        goEnd();
        break;
      case KeyCode.escape:
        event.stopPropagation();
        closeDropdown();
        break;
      case KeyCode.enter:
        event.preventDefault();
        selectOption();
        break;
      case KeyCode.space:
        if (preventNativeSpace) {
          event.preventDefault();
          selectOption();
        }
    }
  };
};

interface UseTriggerKeyboard {
  (inputProps: { openDropdown: () => void; goHome: () => void }): CancelableEventHandler<BaseKeyDetail>;
}

export const useTriggerKeyboard: UseTriggerKeyboard = ({ openDropdown, goHome }) => {
  return (event: CustomEvent<BaseKeyDetail>) => {
    switch (event.detail.keyCode) {
      case KeyCode.up:
      case KeyCode.down:
        event.preventDefault();
        goHome();
        openDropdown();
        break;
      case KeyCode.space:
      case KeyCode.enter:
        event.preventDefault();
        openDropdown();
        break;
    }
  };
};
