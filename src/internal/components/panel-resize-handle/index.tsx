// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import DragHandle from '../drag-handle';

import styles from './styles.css.js';

interface ResizeHandleProps {
  ariaLabel: string | undefined;
  position: 'side' | 'bottom';
  ariaValuenow: number;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  className?: string;
}

export default React.forwardRef(function PanelResizeHandle(
  { ariaLabel, ariaValuenow, position, onKeyDown, onPointerDown, className }: ResizeHandleProps,
  ref: React.Ref<{ focus: () => void }>
) {
  return (
    <div className={styles[`handle-wrapper-${position}`]}>
      <DragHandle
        variant={position === 'bottom' ? 'resize-vertical' : 'resize-horizontal'}
        size="small"
        ref={ref}
        ariaLabel={ariaLabel ?? ''}
        ariaValue={{
          valueMin: 0,
          valueMax: 100,
          valueNow: ariaValuenow,
        }}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        className={className}
      />
    </div>
  );
});
