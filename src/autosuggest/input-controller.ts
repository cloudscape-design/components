// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { BaseKeyDetail } from '../internal/events';
import { KeyCode } from '../internal/keycode';

interface UseInputKeydownHandlerOptions {
  open: boolean;
  onArrowDown(): void;
  onArrowUp(): void;
  onEnter(): void;
  onKeyDown(e: CustomEvent<BaseKeyDetail>): void;
}

export const useInputKeydownHandler = ({
  open,
  onArrowDown,
  onArrowUp,
  onEnter,
  onKeyDown,
}: UseInputKeydownHandlerOptions) => {
  return (e: CustomEvent<BaseKeyDetail>) => {
    switch (e.detail.keyCode) {
      case KeyCode.up: {
        onArrowUp();
        e.preventDefault();
        break;
      }
      case KeyCode.down: {
        onArrowDown();
        e.preventDefault();
        break;
      }
      case KeyCode.enter: {
        if (open) {
          onEnter();
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
