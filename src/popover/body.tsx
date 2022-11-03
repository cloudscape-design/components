// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { KeyCode } from '../internal/keycode';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import FocusLock from '../internal/components/focus-lock';

import styles from './styles.css.js';

export interface PopoverBodyProps {
  dismissButton: boolean;
  dismissAriaLabel: string | undefined;
  onDismiss: () => void;

  header: React.ReactNode | undefined;
  children: React.ReactNode;
  variant?: 'annotation';
  overflowVisible?: 'content' | 'both';

  className?: string;
}

export default function PopoverBody({
  dismissButton: showDismissButton,
  dismissAriaLabel,
  header,
  children,
  onDismiss,
  variant,
  overflowVisible,
  className,
}: PopoverBodyProps) {
  const labelledById = useUniqueId('awsui-popover-');
  const [dismissButtonFocused, setDismissButtonFocused] = useState(false);
  const dismissButtonRef = useRef<ButtonProps.Ref>(null);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.keyCode === KeyCode.escape) {
        onDismiss();
      }
    },
    [onDismiss]
  );

  useEffect(() => {
    if (showDismissButton && !dismissButtonFocused) {
      dismissButtonRef.current?.focus({ preventScroll: true });
    }
    setDismissButtonFocused(showDismissButton);
  }, [showDismissButton, dismissButtonFocused]);

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
      aria-modal={showDismissButton && variant !== 'annotation' ? true : undefined}
      aria-labelledby={header ? labelledById : undefined}
    >
      <FocusLock disabled={variant === 'annotation' || !showDismissButton} autoFocus={false}>
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
