// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { KeyCode } from '../internal/keycode';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import FocusLock from '../internal/components/focus-lock';

import styles from './styles.css.js';
import { useInternalI18n } from '../i18n/context';

export interface PopoverBodyProps {
  dismissButton: boolean;
  dismissAriaLabel: string | undefined;
  onDismiss: (() => void) | undefined;

  header: React.ReactNode | undefined;
  children: React.ReactNode;
  variant?: 'annotation';
  overflowVisible?: 'content' | 'both';

  className?: string;
  ariaLabelledby?: string;
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
  ariaLabelledby,
}: PopoverBodyProps) {
  const i18n = useInternalI18n('popover');
  const labelledById = useUniqueId('awsui-popover-');
  const dismissButtonFocused = useRef(false);
  const dismissButtonRef = useRef<ButtonProps.Ref>(null);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.keyCode === KeyCode.escape) {
        event.stopPropagation();
        onDismiss?.();
      }
    },
    [onDismiss]
  );

  // Implement our own auto-focus rather than using FocusLock's,
  // because we also want to focus the dismiss button when it
  // is added dynamically (e.g. in chart popovers)
  useEffect(() => {
    if (showDismissButton && !dismissButtonFocused.current) {
      dismissButtonRef.current?.focus({ preventScroll: true });
    }
    dismissButtonFocused.current = showDismissButton;
  }, [showDismissButton]);

  const dismissButton = (showDismissButton ?? null) && (
    <div className={styles.dismiss}>
      <InternalButton
        variant="icon"
        formAction="none"
        iconName="close"
        className={styles['dismiss-control']}
        ariaLabel={i18n('dismissAriaLabel', dismissAriaLabel)}
        onClick={() => onDismiss?.()}
        ref={dismissButtonRef}
      />
    </div>
  );

  const isDialog = showDismissButton;
  const shouldTrapFocus = showDismissButton && variant !== 'annotation';

  const dialogProps = isDialog
    ? {
        role: 'dialog',
        'aria-modal': shouldTrapFocus ? true : undefined,
        'aria-labelledby': ariaLabelledby ?? (header ? labelledById : undefined),
      }
    : {};

  return (
    <div
      className={clsx(styles.body, className, {
        [styles['body-overflow-visible']]: overflowVisible === 'both',
      })}
      onKeyDown={onKeyDown}
      {...dialogProps}
    >
      <FocusLock disabled={!shouldTrapFocus} autoFocus={false}>
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
