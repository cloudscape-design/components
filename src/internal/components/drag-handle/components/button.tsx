// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import { IconProps } from '../../../../icon/interfaces';
import InternalIcon from '../../../../icon/internal';
import { DragHandleProps } from '../interfaces';
import { ResizeIcon } from '../resize-icon';

import styles from '../styles.css.js';
import testUtilsStyles from '../test-classes/styles.css.js';

interface DragHandleButtonProps {
  variant?: DragHandleProps.Variant;
  size?: DragHandleProps.Size;
  disabled?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedby?: string;
  ariaValue?: DragHandleProps.AriaValue;
  active?: boolean;
  className?: string;
  onPointerDown?: React.PointerEventHandler;
  onKeyDown?: React.KeyboardEventHandler;
}

const DragHandleButton = forwardRef(
  (
    {
      variant = 'drag-indicator',
      size = 'normal',
      active = false,
      className,
      ariaLabel,
      ariaLabelledBy,
      ariaDescribedby,
      ariaValue,
      disabled,
      onPointerDown,
      onKeyDown,
    }: DragHandleButtonProps,
    ref: React.Ref<Element>
  ) => {
    const dragHandleRefObject = useRef<HTMLDivElement>(null);

    const iconProps: IconProps = (() => {
      const shared = { variant: disabled ? ('disabled' as const) : undefined, size };
      switch (variant) {
        case 'drag-indicator':
          return { ...shared, name: 'drag-indicator' };
        case 'resize-area':
          return { ...shared, name: 'resize-area' };
        case 'resize-horizontal':
          return { ...shared, svg: <ResizeIcon variant="horizontal" /> };
        case 'resize-vertical':
          return { ...shared, svg: <ResizeIcon variant="vertical" /> };
      }
    })();

    return (
      // We need to use a div with button role instead of a button
      // so that Safari will focus on it when clicking it.
      // (See https://bugs.webkit.org/show_bug.cgi?id=22261)
      // Otherwise, we can't reliably catch keyboard events coming from the handle
      // when it is being dragged.
      <div
        ref={useMergeRefs(ref, dragHandleRefObject)}
        role={ariaValue ? 'slider' : 'application'}
        tabIndex={0}
        className={clsx(
          className,
          styles.handle,
          testUtilsStyles.root,
          styles[`handle-${variant}`],
          styles[`handle-size-${size}`],
          disabled && styles['handle-disabled'],
          active && styles.active
        )}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedby}
        aria-disabled={disabled}
        aria-valuemax={ariaValue?.valueMax}
        aria-valuemin={ariaValue?.valueMin}
        aria-valuenow={ariaValue?.valueNow}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        <InternalIcon {...iconProps} />
      </div>
    );
  }
);

export default DragHandleButton;
