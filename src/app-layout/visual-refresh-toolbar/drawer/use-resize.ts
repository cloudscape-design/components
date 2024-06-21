// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getLimitedValue } from '../../../split-panel/utils/size-utils';
import { SizeControlProps } from '../../utils/interfaces';
import { usePointerEvents } from '../../utils/use-pointer-events';
import { useKeyboardEvents } from '../../utils/use-keyboard-events';

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
  const onKeyDown = useKeyboardEvents(sizeControlProps);

  return { onKeyDown, onPointerDown, relativeSize };
}
