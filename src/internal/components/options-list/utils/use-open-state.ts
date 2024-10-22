// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

interface OpenStateProps {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const useOpenState = ({ onOpen, onClose, defaultOpen = false }: OpenStateProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [openedWithKeyboard, setOpenedWithKeyboard] = useState(false);

  const openDropdown = (isKeyboard: boolean) => {
    if (!isOpen) {
      setIsOpen(true);
      setOpenedWithKeyboard(!!isKeyboard);
      onOpen?.();
    }
  };

  const closeDropdown = () => {
    if (isOpen) {
      setIsOpen(false);
      onClose?.();
    }
  };

  const toggleDropdown = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown(false);
    }
  };

  return { isOpen, openDropdown, closeDropdown, toggleDropdown, openedWithKeyboard };
};
