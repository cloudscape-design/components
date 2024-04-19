// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { FlashbarProps } from './interfaces';
import React from 'react';
import InternalSpinner from '../spinner/internal';
import InternalIcon from '../icon/internal';
import clsx from 'clsx';
import styles from './styles.css.js';
import { InternalButton } from '../button/internal';
import { useComponentMetadata, warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { isDevelopment } from '../internal/is-development';
import { throttle } from '../internal/utils/throttle';
import LiveRegion from '../internal/components/live-region';
import { ButtonProps } from '../button/interfaces';
import { getVisualContextClassname } from '../internal/components/visual-context';

import { sendDismissMetric } from './internal/analytics';

import { FOCUS_THROTTLE_DELAY } from './utils';
import { DATA_ATTR_ANALYTICS_FLASHBAR } from '../internal/analytics/selectors';
import { createUseDiscoveredAction } from '../internal/plugins/helpers';
import { awsuiPluginsInternal } from '../internal/plugins/api';
import { ActionsWrapper } from '../alert/actions-wrapper';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { PACKAGE_VERSION } from '../internal/environment';

const ICON_TYPES = {
  success: 'status-positive',
  warning: 'status-warning',
  info: 'status-info',
  error: 'status-negative',
  'in-progress': 'status-in-progress',
} as const;

const useDiscoveredAction = createUseDiscoveredAction(awsuiPluginsInternal.flashbar.onActionRegistered);

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
  i18nStrings?: FlashbarProps.I18nStrings;
}

export const Flash = React.forwardRef(
  (
    {
      id,
      header,
      content,
      dismissible,
      dismissLabel,
      loading,
      action,
      buttonText,
      onButtonClick,
      onDismiss,
      className,
      transitionState,
      ariaRole,
      i18nStrings,
      type = 'info',
      ...props
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

    const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
    const elementRef = useComponentMetadata('Flash', PACKAGE_VERSION, { ...analyticsMetadata });
    const mergedRef = useMergeRefs(ref, elementRef);
    const { discoveredActions, headerRef, contentRef } = useDiscoveredAction(type);

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

    const statusIconAriaLabel =
      props.statusIconAriaLabel ||
      i18nStrings?.[`${loading || type === 'in-progress' ? 'inProgress' : type}IconAriaLabel`];

    return (
      // We're not using "polite" or "assertive" here, just turning default behavior off.
      // eslint-disable-next-line @cloudscape-design/prefer-live-region
      <div
        ref={mergedRef}
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
          },
          getVisualContextClassname(type === 'warning' && !loading ? 'flashbar-warning' : 'flashbar')
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
              <div className={styles['flash-header']} ref={headerRef}>
                {header}
              </div>
              <div className={styles['flash-content']} ref={contentRef}>
                {content}
              </div>
            </div>
          </div>
          <ActionsWrapper
            className={styles['action-button-wrapper']}
            testUtilClasses={{
              actionSlot: styles['action-slot'],
              actionButton: styles['action-button'],
            }}
            action={action}
            discoveredActions={discoveredActions}
            buttonText={buttonText}
            onButtonClick={onButtonClick}
          />
        </div>
        {dismissible && dismissButton(dismissLabel, handleDismiss)}
        {ariaRole === 'status' && <LiveRegion source={[statusIconAriaLabel, headerRef, contentRef]} />}
      </div>
    );
  }
);
