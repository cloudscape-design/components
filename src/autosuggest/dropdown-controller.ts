// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';

export interface UseAutosuggestDropdownProps {
  readOnly?: boolean;
  onClose?: () => void;
}

export interface AutosuggestDropdownState {
  open: boolean;
}

export interface AutosuggestDropdownHandlers {
  openDropdown(): void;
  closeDropdown(): void;
}

export const useAutosuggestDropdown = ({
  readOnly,
  onClose,
}: UseAutosuggestDropdownProps): [AutosuggestDropdownState, AutosuggestDropdownHandlers] => {
  const [open, setOpen] = useState(false);

  const openDropdown = () => !readOnly && setOpen(true);

  const closeDropdown = () => {
    setOpen(false);
    onClose?.();
  };

  return [{ open }, { openDropdown, closeDropdown }];
};
