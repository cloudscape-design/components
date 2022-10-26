// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback } from 'react';
import clsx from 'clsx';
import FocusLock from 'react-focus-lock';

import { KeyCode } from '../internal/keycode';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';

import styles from './styles.css.js';

export interface PopoverBodyProps {
  dismissButton: boolean;
  dismissAriaLabel: string | undefined;
  focusLock?: boolean;
  onDismiss: () => void;

  header: React.ReactNode | undefined;
  children: React.ReactNode;
  returnFocus?: boolean;
  overflowVisible?: 'content' | 'both';

  dismissButtonRef?: React.Ref<ButtonProps.Ref>;

  className?: string;
}

export default function PopoverBody({
  dismissButton: showDismissButton,
  dismissAriaLabel,
  focusLock = showDismissButton,
  header,
  children,
  onDismiss,
  returnFocus = true,
  overflowVisible,
  dismissButtonRef,
  className,
}: PopoverBodyProps) {
  const labelledById = useUniqueId('awsui-popover-');

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.keyCode === KeyCode.escape) {
        onDismiss();
      }
    },
    [onDismiss]
  );

  const dismissButton = (showDismissButton ?? null) && (
    <div className={styles.dismiss}>
      <InternalButton
        variant="icon"
        formAction="none"
        iconName="close"
        className={styles['dismiss-control']}
        ariaLabel={dismissAriaLabel}
        onClick={() => onDismiss()}
        ref={dismissButtonRef}
      />
    </div>
  );

  return (
    <div
      className={clsx(styles.body, className, {
        [styles['body-overflow-visible']]: overflowVisible === 'both',
      })}
      role={header ? 'dialog' : undefined}
      onKeyDown={onKeyDown}
      aria-modal={focusLock ? true : undefined}
      aria-labelledby={header ? labelledById : undefined}
    >
      <FocusLock disabled={!focusLock} autoFocus={true} returnFocus={returnFocus}>
        {header && (
          <div className={clsx(styles['header-row'], showDismissButton && styles['has-dismiss'])}>
            {dismissButton}
            <div className={styles.header} id={labelledById}>
              <h2>{header}</h2>
            </div>
          </div>
        )}
        <div className={!header && showDismissButton ? styles['has-dismiss'] : undefined}>
          {!header && dismissButton}
          <div className={clsx(styles.content, { [styles['content-overflow-visible']]: !!overflowVisible })}>
            {children}
          </div>
        </div>
      </FocusLock>
    </div>
  );
}
