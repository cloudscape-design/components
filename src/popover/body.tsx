// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import { BuiltInErrorBoundary } from '../error-boundary/internal';
import { useInternalI18n } from '../i18n/context';
import FocusLock from '../internal/components/focus-lock';
import { KeyCode } from '../internal/keycode';

import styles from './styles.css.js';

export interface PopoverBodyProps {
  dismissButton: boolean;
  dismissAriaLabel: string | undefined;
  onDismiss: ((method?: string) => void) | undefined;
  onBlur?: (event: React.FocusEvent) => void;

  header: React.ReactNode | undefined;
  children: React.ReactNode;
  variant?: 'annotation' | 'chart';
  overflowVisible?: 'content' | 'both';

  className?: string;
  ariaLabelledby?: string;

  closeAnalyticsAction?: string;
  trapFocus?: boolean;
}

const PopoverBody = React.forwardRef(
  (
    {
      dismissButton: showDismissButton,
      dismissAriaLabel,
      header,
      children,
      onDismiss,
      onBlur,
      variant,
      overflowVisible,
      className,
      ariaLabelledby,
      closeAnalyticsAction,
      trapFocus,
    }: PopoverBodyProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const i18n = useInternalI18n('popover');
    const labelledById = useUniqueId('awsui-popover-');
    const dismissButtonFocused = useRef(false);
    const dismissButtonRef = useRef<ButtonProps.Ref>(null);

    const onKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.keyCode === KeyCode.escape) {
          event.stopPropagation();
          onDismiss?.('escape');
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
      <div
        className={styles.dismiss}
        {...(closeAnalyticsAction ? getAnalyticsMetadataAttribute({ action: closeAnalyticsAction }) : {})}
      >
        <InternalButton
          variant="icon"
          formAction="none"
          iconName="close"
          className={styles['dismiss-control']}
          ariaLabel={i18n('dismissAriaLabel', dismissAriaLabel)}
          onClick={() => onDismiss?.('close-button')}
          ref={dismissButtonRef}
        />
      </div>
    );

    const isDialog = showDismissButton;
    const shouldTrapFocus = trapFocus || (showDismissButton && variant !== 'annotation');

    const dialogProps = isDialog
      ? {
          role: 'dialog',
          'aria-labelledby': ariaLabelledby ?? (header ? labelledById : undefined),
        }
      : {};

    return (
      <div
        className={clsx(styles.body, styles[`body-variant-${variant}`], className, {
          [styles['body-overflow-visible']]: overflowVisible === 'both',
        })}
        onKeyDown={onKeyDown}
        ref={ref}
        onBlur={onBlur}
        {...dialogProps}
      >
        <BuiltInErrorBoundary>
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
        </BuiltInErrorBoundary>
      </div>
    );
  }
);

export default PopoverBody;
