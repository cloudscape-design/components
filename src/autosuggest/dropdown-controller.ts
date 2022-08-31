// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

export interface UseAutosuggestDropdownProps {
  readOnly?: boolean;
  onClose?: () => void;
  onBlur?: () => void;
}

export interface AutosuggestDropdownState {
  open: boolean;
}

export interface AutosuggestDropdownHandlers {
  openDropdown(): void;
  closeDropdown(): void;
  handleBlur: React.FocusEventHandler;
  handleMouseDown: React.MouseEventHandler;
}

export interface AutosuggestDropdownRefs {
  footerRef: React.Ref<HTMLDivElement>;
}

export const useAutosuggestDropdown = ({
  readOnly,
  onClose,
  onBlur,
}: UseAutosuggestDropdownProps): [AutosuggestDropdownState, AutosuggestDropdownHandlers, AutosuggestDropdownRefs] => {
  const [open, setOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  const openDropdown = () => !readOnly && setOpen(true);

  const closeDropdown = () => {
    setOpen(false);
    onClose?.();
  };

  const handleBlur: React.FocusEventHandler = event => {
    if (event.currentTarget.contains(event.relatedTarget) || footerRef.current?.contains(event.relatedTarget)) {
      return;
    }
    closeDropdown();
    onBlur?.();
  };

  const handleMouseDown: React.MouseEventHandler = event => {
    // Prevent currently focused element from losing focus.
    event.preventDefault();
  };

  return [{ open }, { openDropdown, closeDropdown, handleBlur, handleMouseDown }, { footerRef }];
};
