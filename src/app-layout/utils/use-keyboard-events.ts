// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { KeyCode } from '../../internal/keycode';

const KEYBOARD_SINGLE_STEP_SIZE = 10;
const KEYBOARD_MULTIPLE_STEPS_SIZE = 60;

export interface SizeControlProps {
  position: 'side' | 'bottom';
  panelRef?: React.RefObject<HTMLDivElement>;
  handleRef?: React.RefObject<HTMLDivElement>;
  setSidePanelWidth: (width: number) => void;
  setBottomPanelHeight: (height: number) => void;
}

const getCurrentSize = (panelRef?: React.RefObject<HTMLDivElement>) => {
  if (!panelRef || !panelRef.current) {
    return {
      panelHeight: 0,
      panelWidth: 0,
    };
  }

  return {
    panelHeight: panelRef.current.clientHeight,
    panelWidth: panelRef.current.clientWidth,
  };
};

export const useKeyboardEvents = ({
  position,
  setSidePanelWidth,
  setBottomPanelHeight,
  panelRef,
}: SizeControlProps) => {
  return (event: React.KeyboardEvent) => {
    let setSizeFunction;
    let currentSize;
    let maxSize;

    const { panelHeight, panelWidth } = getCurrentSize(panelRef);

    if (position === 'side') {
      setSizeFunction = setSidePanelWidth;
      currentSize = panelWidth;
      // don't need the exact max size as it's constrained in the set size function
      maxSize = window.innerWidth;
    } else {
      setSizeFunction = setBottomPanelHeight;
      currentSize = panelHeight;
      // don't need the exact max size as it's constrained in the set size function
      maxSize = window.innerHeight;
    }

    const primaryGrowKey = position === 'bottom' ? KeyCode.up : KeyCode.left;
    const primaryShrinkKey = position === 'bottom' ? KeyCode.down : KeyCode.right;
    const altGrowKey = position === 'bottom' ? KeyCode.right : KeyCode.down;
    const altShrinkKey = position === 'bottom' ? KeyCode.left : KeyCode.up;

    let isEventHandled = true;
    switch (event.keyCode) {
      case primaryGrowKey:
      case altGrowKey:
        setSizeFunction(currentSize + KEYBOARD_SINGLE_STEP_SIZE);

        break;
      case primaryShrinkKey:
      case altShrinkKey:
        setSizeFunction(currentSize - KEYBOARD_SINGLE_STEP_SIZE);
        break;
      case KeyCode.pageUp:
        setSizeFunction(currentSize + KEYBOARD_MULTIPLE_STEPS_SIZE);
        break;
      case KeyCode.pageDown:
        setSizeFunction(currentSize - KEYBOARD_MULTIPLE_STEPS_SIZE);
        break;
      case KeyCode.home:
        setSizeFunction(maxSize);
        break;
      case KeyCode.end:
        setSizeFunction(0);
        break;
      default:
        isEventHandled = false;
    }

    if (isEventHandled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
};
