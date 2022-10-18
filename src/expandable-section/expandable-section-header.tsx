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
  const isNavigation = variant === 'navigation';

  const ariaAttributes = {
    'aria-controls': ariaControls,
    'aria-expanded': expanded,
    'aria-label': ariaLabel,
    'aria-labelledby': isNavigation ? ariaLabelledBy : undefined,
  };
  const className = clsx(
    styles.header,
    styles[`header-${variant}`],
    styles.trigger,
    styles[`trigger-${variant}`],
    expanded && styles['trigger-expanded']
  );
  if (isNavigation) {
    return (
      <div>
        <div id={id} className={className} onClick={onClick}>
          <button className={styles['icon-container']} type="button" {...focusVisible} {...ariaAttributes}>
            <ExpandIcon variant={variant} expanded={expanded} />
          </button>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div
        id={id}
        role="button"
        className={clsx(className, styles.focusable, expanded && styles.expanded)}
        tabIndex={0}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        onClick={onClick}
        {...focusVisible}
        {...ariaAttributes}
      >
        <div className={styles['icon-container']}>
          <ExpandIcon variant={variant} expanded={expanded} />
        </div>
        {children}
      </div>
    </div>
  );
};

function ExpandIcon({ variant, expanded }: { variant: ExpandableSectionProps.Variant; expanded: boolean }) {
  return (
    <InternalIcon
      size={variant === 'container' ? 'medium' : 'normal'}
      className={clsx(styles.icon, expanded && styles.expanded)}
      name="caret-down-filled"
    />
  );
}
