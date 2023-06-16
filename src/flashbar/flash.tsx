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
import { throttle } from '../internal/utils/throttle';
import LiveRegion from '../internal/components/live-region';
import { ButtonProps } from '../button/interfaces';

import { sendDismissMetric } from './internal/analytics';

import { FOCUS_THROTTLE_DELAY } from './utils';
import { DATA_ATTR_ANALYTICS_FLASHBAR } from '../internal/analytics/selectors';

const ICON_TYPES = {
  success: 'status-positive',
  warning: 'status-warning',
  info: 'status-info',
  error: 'status-negative',
  'in-progress': 'status-in-progress',
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

export const focusFlashById = throttle(
  (element: HTMLElement | null, itemId: string) => {
    const selector = `[data-itemid="${CSS.escape(itemId)}"] .${styles['flash-focus-container']}`;
    element?.querySelector<HTMLElement>(selector)?.focus();
  },
  FOCUS_THROTTLE_DELAY,
  { trailing: false }
);

export interface FlashProps extends FlashbarProps.MessageDefinition {
  className: string;
  transitionState?: string;
}

export const Flash = React.forwardRef(
  (
    {
      id,
      header,
      content,
      dismissible,
      dismissLabel,
      statusIconAriaLabel,
      loading,
      action,
      buttonText,
      onButtonClick,
      onDismiss,
      className,
      transitionState,
      ariaRole,
      type = 'info',
    }: FlashProps,
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

    const handleDismiss: ButtonProps['onClick'] = event => {
      sendDismissMetric(effectiveType);
      onDismiss && onDismiss(event);
    };

    const analyticsAttributes = {
      [DATA_ATTR_ANALYTICS_FLASHBAR]: effectiveType,
    };

    return (
      // We're not using "polite" or "assertive" here, just turning default behavior off.
      // eslint-disable-next-line @cloudscape-design/prefer-live-region
      <div
        ref={ref}
        role={ariaRole}
        aria-live={ariaRole ? 'off' : undefined}
        data-itemid={id}
        className={clsx(
          styles.flash,
          styles[`flash-type-${effectiveType}`],
          className,
          transitionState && {
            [styles.enter]: transitionState === 'enter',
            [styles.entering]: transitionState === 'entering',
            [styles.entered]: transitionState === 'entered',
            [styles.exit]: transitionState === 'exit',
            [styles.exiting]: transitionState === 'exiting',
            [styles.exited]: transitionState === 'exited',
          }
        )}
        {...analyticsAttributes}
      >
        <div className={styles['flash-body']}>
          <div className={styles['flash-focus-container']} tabIndex={-1}>
            <div
              className={clsx(styles['flash-icon'], styles['flash-text'])}
              role="img"
              aria-label={statusIconAriaLabel}
            >
              {icon}
            </div>
            <div className={clsx(styles['flash-message'], styles['flash-text'])}>
              <div className={styles['flash-header']}>{header}</div>
              <div className={styles['flash-content']}>{content}</div>
            </div>
          </div>
          {button && <div className={styles['action-button-wrapper']}>{button}</div>}
        </div>
        {dismissible && dismissButton(dismissLabel, handleDismiss)}
        {ariaRole === 'status' && (
          <LiveRegion>
            {statusIconAriaLabel} {header} {content}
          </LiveRegion>
        )}
      </div>
    );
  }
);
