// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { NotificationCenterProps } from './interface';
import { InternalButton } from '../button/internal';
import InternalIcon from '../icon/internal';
import LiveRegion from '../internal/components/live-region';
import styles from './styles.css.js';
// import { ButtonProps } from '../button/interfaces';

const ICON_TYPES = {
  success: 'status-positive',
  warning: 'status-warning',
  info: 'status-info',
  error: 'status-negative',
} as const;

function dismissButton(
  dismissLabel: NotificationCenterProps.ToastMessage['dismissLabel'],
  onDismiss: NotificationCenterProps.ToastMessage['onDismiss']
) {
  return (
    <div className={styles['dismiss-button-wrapper']}>
      <InternalButton
        onClick={onDismiss}
        className={styles['dismiss-button']}
        variant="flashbar-icon"
        iconName="close"
        formAction="none"
        ariaLabel={dismissLabel}
      />
    </div>
  );
}

export interface ToastProps extends Omit<NotificationCenterProps.ToastMessage, 'duration'> {
  transitionState?: string;
}

export const Toast = React.forwardRef(
  (
    {
      type,
      title,
      content,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      position,
      ariaRole,
      dismissible,
      dismissLabel,
      onDismiss,
      statusIconAriaLabel,
      transitionState,
    }: ToastProps,
    ref: React.Ref<HTMLDivElement>
  ) => {
    const iconType = ICON_TYPES[type];
    return (
      <div
        ref={ref}
        role={ariaRole}
        aria-live={ariaRole ? 'off' : undefined}
        className={clsx(
          styles.toast,
          styles[`toast-type-${type}`],
          transitionState && {
            [styles.enter]: transitionState === 'enter',
            [styles.entering]: transitionState === 'entering',
            [styles.entered]: transitionState === 'entered',
            [styles.exit]: transitionState === 'exit',
            [styles.exiting]: transitionState === 'exiting',
            [styles.exited]: transitionState === 'exited',
          }
        )}
      >
        <div className={styles['toast-body']}>
          <div className={styles['toast-focus-container']} tabIndex={-1}>
            <div
              className={clsx(styles['toast-icon'], styles['toast-text'])}
              role="img"
              aria-label={statusIconAriaLabel}
            >
              <InternalIcon name={iconType} />
            </div>
            <div className={clsx(styles['toast-message'], styles['toast-text'])}>
              <div className={styles['toast-header']}>{title}</div>
              <div className={styles['toast-content']}>{content}</div>
            </div>
          </div>
        </div>
        {dismissible && dismissButton(dismissLabel, onDismiss)}
        {ariaRole === 'status' && (
          <LiveRegion>
            {statusIconAriaLabel} {title} {content}
          </LiveRegion>
        )}
      </div>
    );
  }
);
