// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import { BaseKeyDetail, CancelableEventHandler, getBlurEventRelatedTarget } from '../internal/events';
import { KeyCode } from '../internal/keycode';

interface AutosuggestInputControllerOptions {
  readOnly?: boolean;
  onClose?: () => void;
  onBlur?: () => void;
  onPressArrowDown(): void;
  onPressArrowUp(): void;
  onPressEnter(): boolean;
  onPressEsc(): void;
  onKeyDown(event: CustomEvent<BaseKeyDetail>): void;
}

export interface AutosuggestInputControllerState {
  open: boolean;
}

export interface AutosuggestInputControllerHandlers {
  openDropdown(): void;
  closeDropdown(): void;
  handleBlur: React.FocusEventHandler;
  handleMouseDown: React.MouseEventHandler;
  handleKeyDown: CancelableEventHandler<BaseKeyDetail>;
}

export interface AutosuggestInputControllerRefs {
  dropdownFooterRef: React.Ref<HTMLDivElement>;
}

export function useAutosuggestInputController({
  readOnly,
  onClose,
  onBlur,
  onKeyDown,
  onPressArrowDown,
  onPressArrowUp,
  onPressEnter,
  onPressEsc,
}: AutosuggestInputControllerOptions): [
  AutosuggestInputControllerState,
  AutosuggestInputControllerHandlers,
  AutosuggestInputControllerRefs
] {
  const [open, setOpen] = useState(false);
  const dropdownFooterRef = useRef<HTMLDivElement>(null);

  const openDropdown = () => !readOnly && setOpen(true);

  const closeDropdown = () => {
    setOpen(false);
    onClose?.();
  };

  const handleBlur: React.FocusEventHandler = event => {
    const relatedTarget = getBlurEventRelatedTarget(event.nativeEvent);
    if (event.currentTarget.contains(relatedTarget) || dropdownFooterRef.current?.contains(relatedTarget)) {
      return;
    }
    closeDropdown();
    onBlur?.();
  };

  const handleMouseDown: React.MouseEventHandler = event => {
    // Prevent currently focused element from losing focus.
    event.preventDefault();
  };

  const handleKeyDown = (e: CustomEvent<BaseKeyDetail>) => {
    switch (e.detail.keyCode) {
      case KeyCode.down: {
        onPressArrowDown();
        openDropdown();
        e.preventDefault();
        break;
      }
      case KeyCode.up: {
        onPressArrowUp();
        openDropdown();
        e.preventDefault();
        break;
      }
      case KeyCode.enter: {
        if (open) {
          if (!onPressEnter()) {
            closeDropdown();
          }
          e.preventDefault();
        }
        onKeyDown(e);
        break;
      }
      case KeyCode.escape: {
        if (open) {
          closeDropdown();
        } else {
          onPressEsc();
        }
        e.preventDefault();
        onKeyDown(e);
        break;
      }
      default: {
        onKeyDown(e);
      }
    }
  };

  return [{ open }, { openDropdown, closeDropdown, handleBlur, handleMouseDown, handleKeyDown }, { dropdownFooterRef }];
}
