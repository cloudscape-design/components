// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalDragHandle, { DragHandleProps } from '../drag-handle';

import styles from './styles.css.js';

interface ResizeHandleProps {
  className?: string;
  ariaLabel: string | undefined;
  tooltipText?: string | undefined;
  position: 'side-start' | 'side' | 'bottom';
  ariaValuenow: number;
  onDirectionClick: DragHandleProps['onDirectionClick'];
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
}

export default React.forwardRef<HTMLDivElement, ResizeHandleProps>(function PanelResizeHandle(
  { className, ariaLabel, tooltipText, ariaValuenow, position, onDirectionClick, onKeyDown, onPointerDown },
  ref
) {
  return (
    <InternalDragHandle
      className={clsx(className, styles.slider, styles[`slider-${position}`])}
      ariaLabel={ariaLabel}
      tooltipText={tooltipText}
      ariaValue={{ valueMin: 0, valueMax: 100, valueNow: ariaValuenow }}
      variant={['side', 'side-start'].includes(position) ? 'resize-horizontal' : 'resize-vertical'}
      directions={
        position === 'side'
          ? {
              'inline-end': ariaValuenow === 0 ? 'disabled' : 'active',
              'inline-start': ariaValuenow === 100 ? 'disabled' : 'active',
            }
          : position === 'side-start'
            ? {
                'inline-end': ariaValuenow === 100 ? 'disabled' : 'active',
                'inline-start': ariaValuenow === 0 ? 'disabled' : 'active',
              }
            : {
                'block-end': ariaValuenow === 0 ? 'disabled' : 'active',
                'block-start': ariaValuenow === 100 ? 'disabled' : 'active',
              }
      }
      onDirectionClick={onDirectionClick}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      ref={ref}
    />
  );
});
