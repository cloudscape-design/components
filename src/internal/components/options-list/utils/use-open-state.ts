// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useState } from 'react';

interface OpenStateProps {
  onOpen?: () => void;
  onClose?: () => void;
}

export const useOpenState = ({ onOpen, onClose }: OpenStateProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openedWithKeyboard, setOpenedWithKeyboard] = useState(false);

  const openDropdown = (isKeyboard?: boolean) => {
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
      openDropdown();
    }
  };

  return { isOpen, openDropdown, closeDropdown, toggleDropdown, openedWithKeyboard };
};
