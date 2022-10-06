// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ExpandableSectionProps } from './interfaces';
import React, { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import useFocusVisible from '../internal/hooks/focus-visible';
import InternalIcon from '../icon/internal';
import clsx from 'clsx';
import styles from './styles.css.js';

interface ExpandableSectionHeaderProps {
  id: string;
  className?: string;
  variant: ExpandableSectionProps.Variant;
  children?: ReactNode;
  expanded: boolean;
  ariaControls: string;
  ariaLabelledBy?: string;
  ariaLabel?: string;
  onKeyUp: KeyboardEventHandler;
  onKeyDown: KeyboardEventHandler;
  onClick: MouseEventHandler;
}

export const ExpandableSectionHeader = ({
  id,
  className,
  variant,
  children,
  expanded,
  ariaControls,
  ariaLabel,
  ariaLabelledBy,
  onKeyUp,
  onKeyDown,
  onClick,
}: ExpandableSectionHeaderProps) => {
  const focusVisible = useFocusVisible();

  const icon = (
    <InternalIcon
      size={variant === 'container' ? 'medium' : 'normal'}
      className={clsx(styles.icon, expanded && styles.expanded)}
      name="caret-down-filled"
    />
  );
  const ariaAttributes = {
    'aria-controls': ariaControls,
    'aria-expanded': expanded,
  };

  const triggerClassName = clsx(styles.trigger, styles[`trigger-${variant}`], expanded && styles['trigger-expanded']);
  if (variant === 'navigation') {
    return (
      <div id={id} className={clsx(className, triggerClassName)} onClick={onClick}>
        <button
          className={styles['icon-container']}
          type="button"
          aria-labelledby={ariaLabelledBy}
          aria-label={ariaLabel}
          {...focusVisible}
          {...ariaAttributes}
        >
          {icon}
        </button>
        {children}
      </div>
    );
  }

  return (
    <div
      id={id}
      role="button"
      className={clsx(className, triggerClassName, styles.focusable, expanded && styles.expanded)}
      tabIndex={0}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onClick={onClick}
      aria-label={ariaLabel}
      {...focusVisible}
      {...ariaAttributes}
    >
      <div className={styles['icon-container']}>{icon}</div>
      {children}
    </div>
  );
};
