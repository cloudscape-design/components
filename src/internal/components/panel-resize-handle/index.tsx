// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import ResizeHandleIcon from './icon';
import ResizeHandleIconCompact from './icon-compact';

import styles from './styles.css.js';

interface ResizeHandleProps {
  className?: string;
  ariaLabel: string | undefined;
  position: 'side' | 'bottom';
  ariaValuenow: number;
  compact?: boolean;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
}

export default React.forwardRef<HTMLDivElement, ResizeHandleProps>(function PanelResizeHandle(
  { className, ariaLabel, ariaValuenow, position, onKeyDown, onPointerDown, compact },
  ref
) {
  const Icon = compact ? ResizeHandleIconCompact : ResizeHandleIcon;

  return (
    <div
      ref={ref}
      className={clsx(className, styles.slider, styles[`slider-${position}`], { [styles.compact]: compact })}
      role="slider"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={ariaValuenow}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
    >
      <Icon className={clsx(styles['slider-icon'], styles[`slider-icon-${position}`])} />
    </div>
  );
});
