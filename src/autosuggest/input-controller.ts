// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseKeyDetail } from '../internal/events';
import { KeyCode } from '../internal/keycode';

interface UseInputKeydownHandlerOptions {
  open: boolean;
  onPressArrowDown(): void;
  onPressArrowUp(): void;
  onPressEnter(): void;
  onKeyDown(event: CustomEvent<BaseKeyDetail>): void;
}

export const useInputKeydownHandler = ({
  open,
  onPressArrowDown,
  onPressArrowUp,
  onPressEnter,
  onKeyDown,
}: UseInputKeydownHandlerOptions) => {
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
