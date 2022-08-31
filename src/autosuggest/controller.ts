// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useCallback } from 'react';
import { CancelableEventHandler, BaseKeyDetail } from '../internal/events';
import { KeyCode } from '../internal/keycode';

export const useKeyboardHandler = (
  open: boolean,
  openDropdown: () => void,
  closeDropdown: () => void,
  interceptKeyDown: (e: CustomEvent<BaseKeyDetail>) => boolean,
  onKeyDown?: CancelableEventHandler<BaseKeyDetail>
) => {
  return useCallback(
    (e: CustomEvent<BaseKeyDetail>) => {
      switch (e.detail.keyCode) {
        case KeyCode.down: {
          interceptKeyDown(e);
          openDropdown();
          e.preventDefault();
          break;
        }
        case KeyCode.up: {
          interceptKeyDown(e);
          openDropdown();
          e.preventDefault();
          break;
        }
        case KeyCode.enter: {
          if (open) {
            if (!interceptKeyDown(e)) {
              closeDropdown();
            }
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
    [open, openDropdown, closeDropdown, interceptKeyDown, onKeyDown]
  );
};
