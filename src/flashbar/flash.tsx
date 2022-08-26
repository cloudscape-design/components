// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FlashbarProps } from './interfaces';
import React from 'react';
import InternalSpinner from '../spinner/internal';
import InternalIcon from '../icon/internal';
import clsx from 'clsx';
import styles from './styles.css.js';
import { InternalButton } from '../button/internal';
import { warnOnce } from '../internal/logging';
import { isDevelopment } from '../internal/is-development';

const ICON_TYPES = {
  success: 'status-positive',
  warning: 'status-warning',
  info: 'status-info',
  error: 'status-negative',
} as const;

function actionButton(
  buttonText: FlashbarProps.MessageDefinition['buttonText'],
  onButtonClick: FlashbarProps.MessageDefinition['onButtonClick']
) {
  return (
    <InternalButton onClick={onButtonClick} className={styles['action-button']} formAction="none">
      {buttonText}
    </InternalButton>
  );
}

function dismissButton(
  dismissLabel: FlashbarProps.MessageDefinition['dismissLabel'],
  onDismiss: FlashbarProps.MessageDefinition['onDismiss']
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

interface Flash extends FlashbarProps.MessageDefinition {
  className: string;
  transitionState?: string;
}

export const Flash = React.forwardRef(
  (
    {
      header,
      content,
      dismissible,
      dismissLabel,
      statusIconLabel,
      loading,
      action,
      buttonText,
      onButtonClick,
      onDismiss,
      className,
      transitionState,
      type = 'info',
    }: Flash,
    ref: React.Ref<HTMLDivElement>
  ) => {
    if (isDevelopment) {
      if (buttonText && !onButtonClick) {
        warnOnce(
          'Flashbar',
          `You provided a \`buttonText\` prop without an \`onButtonClick\` handler. This will render a non-interactive action button.`
        );
      }

      if (dismissible && !onDismiss) {
        warnOnce(
          'Flashbar',
          `You have set the \`dismissible\` prop without an \`onDismiss\` handler. This will render a non-interactive dismiss button.`
        );
      }
    }

    const button = action || (buttonText && actionButton(buttonText, onButtonClick));

    const iconType = ICON_TYPES[type];

    const icon = loading ? <InternalSpinner /> : <InternalIcon name={iconType} />;

    const effectiveType = loading ? 'info' : type;

    return (
      <div
        ref={ref}
        className={clsx(
          styles.flash,
          styles[`flash-type-${effectiveType}`],
          className,
          transitionState
            ? {
                [styles.enter]: transitionState === 'enter',
                [styles.entering]: transitionState === 'entering',
                [styles.entered]: transitionState === 'entered',
                [styles.exit]: transitionState === 'exit',
                [styles.exiting]: transitionState === 'exiting',
                [styles.exited]: transitionState === 'exited',
              }
            : ''
        )}
      >
        <div className={clsx(styles['flash-icon'], styles['flash-text'])} role="img" aria-label={statusIconLabel}>
          {icon}
        </div>
        <div className={styles['flash-body']}>
          <div className={clsx(styles['flash-message'], styles['flash-text'])}>
            <div className={styles['flash-header']}>{header}</div>
            <div className={styles['flash-content']}>{content}</div>
          </div>
          {button && <div className={styles['action-button-wrapper']}>{button}</div>}
        </div>
        {dismissible && dismissButton(dismissLabel, onDismiss)}
      </div>
    );
  }
);
