// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { SizeControlProps } from './interfaces';
import handleKey, { isEventLike } from '../../internal/utils/handle-key';

const KEYBOARD_SINGLE_STEP_SIZE = 10;
const KEYBOARD_MULTIPLE_STEPS_SIZE = 60;

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

export const useKeyboardEvents = ({ position, onResize, panelRef }: SizeControlProps) => {
  return (event: React.KeyboardEvent) => {
    let currentSize: number;
    let maxSize: number;

    const { panelHeight, panelWidth } = getCurrentSize(panelRef);

    if (position === 'side') {
      currentSize = panelWidth;
      // don't need the exact max size as it's constrained in the set size function
      maxSize = window.innerWidth;
    } else {
      currentSize = panelHeight;
      // don't need the exact max size as it's constrained in the set size function
      maxSize = window.innerHeight;
    }

    let isEventHandled = true;

    const singleStepUp = () => onResize(currentSize + KEYBOARD_SINGLE_STEP_SIZE);
    const singleStepDown = () => onResize(currentSize - KEYBOARD_SINGLE_STEP_SIZE);
    const multipleStepUp = () => onResize(currentSize + KEYBOARD_MULTIPLE_STEPS_SIZE);
    const multipleStepDown = () => onResize(currentSize - KEYBOARD_MULTIPLE_STEPS_SIZE);

    isEventLike(event) &&
      handleKey(event, {
        onBlockStart: () => {
          position === 'bottom' ? singleStepUp() : singleStepDown();
        },
        onBlockEnd: () => {
          position === 'bottom' ? singleStepDown() : singleStepUp();
        },
        onInlineEnd: () => {
          position === 'bottom' ? singleStepUp() : singleStepDown();
        },
        onInlineStart: () => {
          position === 'bottom' ? singleStepDown() : singleStepUp();
        },
        onPageDown: () => multipleStepUp(),
        onPageUp: () => multipleStepDown(),
        onHome: () => onResize(maxSize),
        onEnd: () => onResize(0),
        onDefault: () => (isEventHandled = false),
      });

    if (isEventHandled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
};
