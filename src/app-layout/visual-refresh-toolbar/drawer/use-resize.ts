// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getLimitedValue } from '../../../split-panel/utils/size-utils.js';
import { SizeControlProps } from '../../utils/interfaces.js';
import { useKeyboardEvents } from '../../utils/use-keyboard-events.js';
import { usePointerEvents } from '../../utils/use-pointer-events.js';

interface ResizeProps {
  currentWidth: number;
  minWidth: number;
  maxWidth: number;
  panelRef: React.RefObject<HTMLDivElement>;
  handleRef: React.RefObject<HTMLDivElement>;
  onResize: (newWidth: number) => void;
}

export function useResize({ currentWidth, minWidth, maxWidth, panelRef, handleRef, onResize }: ResizeProps) {
  const onResizeHandler = (newWidth: number) => {
    const size = getLimitedValue(minWidth, newWidth, maxWidth);

    if (maxWidth >= minWidth) {
      onResize(size);
    }
  };

  const sizeControlProps: SizeControlProps = {
    position: 'side',
    panelRef,
    handleRef,
    onResize: onResizeHandler,
  };

  const clampedWidth = getLimitedValue(minWidth, currentWidth, maxWidth);
  const relativeSize = ((clampedWidth - minWidth) / (maxWidth - minWidth)) * 100;

  const onPointerDown = usePointerEvents(sizeControlProps);
  const { onKeyDown, onDirectionClick } = useKeyboardEvents(sizeControlProps);

  return { onKeyDown, onDirectionClick, onPointerDown, relativeSize };
}
