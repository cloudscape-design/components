// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseKeyDetail, CancelableEventHandler } from '../../../events';
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
        goHome();
        break;
      case END:
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
