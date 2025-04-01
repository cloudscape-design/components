// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useRef } from 'react';
import clsx from 'clsx';

import { useComponentMetadata, warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { ActionsWrapper } from '../alert/actions-wrapper';
import { InternalButton } from '../button/internal';
import InternalIcon from '../icon/internal';
import {
  DATA_ATTR_ANALYTICS_FLASHBAR,
  DATA_ATTR_ANALYTICS_SUPPRESS_FLOW_EVENTS,
} from '../internal/analytics/selectors';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { getVisualContextClassname } from '../internal/components/visual-context';
import { PACKAGE_VERSION } from '../internal/environment';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { isDevelopment } from '../internal/is-development';
import { awsuiPluginsInternal } from '../internal/plugins/api';
import { createUseDiscoveredAction, createUseDiscoveredContent } from '../internal/plugins/helpers';
import { throttle } from '../internal/utils/throttle';
import useContainerWidth from '../internal/utils/use-container-width';
import InternalLiveRegion from '../live-region/internal';
import InternalSpinner from '../spinner/internal';
import { GeneratedAnalyticsMetadataFlashbarDismiss } from './analytics-metadata/interfaces';
import { FlashbarProps } from './interfaces';
import { FOCUS_THROTTLE_DELAY } from './utils';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

const ICON_TYPES = {
  success: 'status-positive',
  warning: 'status-warning',
  info: 'status-info',
  error: 'status-negative',
  'in-progress': 'status-in-progress',
} as const;

const useDiscoveredAction = createUseDiscoveredAction(awsuiPluginsInternal.flashbar.onActionRegistered);
const useDiscoveredContent = createUseDiscoveredContent('flash', awsuiPluginsInternal.flashContent);

function dismissButton(
  dismissLabel: FlashbarProps.MessageDefinition['dismissLabel'],
  onDismiss: FlashbarProps.MessageDefinition['onDismiss']
) {
  return (
    <div
      className={styles['dismiss-button-wrapper']}
      {...getAnalyticsMetadataAttribute({
        action: 'dismiss',
      } as Partial<GeneratedAnalyticsMetadataFlashbarDismiss>)}
    >
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

interface FlashProps extends FlashbarProps.MessageDefinition {
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

    const analyticsMetadata = getAnalyticsMetadataProps(
      props as BasePropsWithAnalyticsMetadata & FlashbarProps.MessageDefinition
    );
    const [containerWidth, containerMeasureRef] = useContainerWidth();
    const elementRef = useComponentMetadata('Flash', PACKAGE_VERSION, { ...analyticsMetadata });
    const mergedRef = useMergeRefs(ref, elementRef, containerMeasureRef);
    const flashIconId = useUniqueId('flash-icon');
    const flashMessageId = useUniqueId('flash-message');

    const headerRefObject = useRef<HTMLDivElement>(null);
    const contentRefObject = useRef<HTMLDivElement>(null);
    const { discoveredActions, headerRef: headerRefAction, contentRef: contentRefAction } = useDiscoveredAction(type);
    const {
      initialHidden,
      headerReplacementType,
      contentReplacementType,
      headerRef: headerRefContent,
      contentRef: contentRefContent,
      replacementHeaderRef,
      replacementContentRef,
    } = useDiscoveredContent({ type, header, children: content });

    const headerRef = useMergeRefs(headerRefAction, headerRefContent, headerRefObject);
    const contentRef = useMergeRefs(contentRefAction, contentRefContent, contentRefObject);
    const actionsRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (!actionsRef.current) {
        return;
      }
      if (actionsRef.current.offsetLeft < 100) {
        actionsRef.current.classList.add(styles['action-wrapped']);
      } else {
        actionsRef.current.classList.remove(styles['action-wrapped']);
      }
    }, [containerWidth]);

    const statusIconAriaLabel =
      props.statusIconAriaLabel ||
      i18nStrings?.[`${loading || type === 'in-progress' ? 'inProgress' : type}IconAriaLabel`];

    const iconType = ICON_TYPES[type];
    const icon = loading ? (
      <span role="img" aria-label={statusIconAriaLabel}>
        <InternalSpinner />
      </span>
    ) : (
      <InternalIcon name={iconType} ariaLabel={statusIconAriaLabel} />
    );

    const effectiveType = loading ? 'info' : type;

    const analyticsAttributes: Record<string, string> = {
      [DATA_ATTR_ANALYTICS_FLASHBAR]: effectiveType,
    };

    if (analyticsMetadata.suppressFlowMetricEvents) {
      analyticsAttributes[DATA_ATTR_ANALYTICS_SUPPRESS_FLOW_EVENTS] = 'true';
    }

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
          getVisualContextClassname(type === 'warning' && !loading ? 'flashbar-warning' : 'flashbar'),
          initialHidden && styles['initial-hidden']
        )}
        {...analyticsAttributes}
      >
        <div className={styles['flash-body']}>
          <div
            className={styles['flash-focus-container']}
            tabIndex={-1}
            role="group"
            aria-labelledby={`${flashIconId} ${flashMessageId}`}
          >
            <div className={clsx(styles['flash-icon'], styles['flash-text'])} id={flashIconId}>
              {icon}
            </div>
            <div className={clsx(styles['flash-message'], styles['flash-text'])} id={flashMessageId}>
              <div
                className={clsx(
                  styles['flash-header'],
                  headerReplacementType !== 'original' ? styles.hidden : analyticsSelectors['flash-header']
                )}
                ref={headerRef}
              >
                {header}
              </div>
              <div
                className={clsx(styles['header-replacement'], headerReplacementType !== 'replaced' && styles.hidden)}
                ref={replacementHeaderRef}
              ></div>
              <div
                className={clsx(
                  styles['flash-content'],
                  contentReplacementType !== 'original' ? styles.hidden : analyticsSelectors['flash-header']
                )}
                ref={contentRef}
              >
                {content}
              </div>
              <div
                className={clsx(styles['content-replacement'], contentReplacementType !== 'replaced' && styles.hidden)}
                ref={replacementContentRef}
              ></div>
            </div>
          </div>
          <ActionsWrapper
            ref={actionsRef}
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
        {dismissible && dismissButton(dismissLabel, onDismiss)}
        {ariaRole === 'status' && (
          <InternalLiveRegion sources={[statusIconAriaLabel, headerRefObject, contentRefObject]} />
        )}
      </div>
    );
  }
);
