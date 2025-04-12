// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { InternalButton } from '../button/internal';
import { useInternalI18n } from '../i18n/context';
import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import { DATA_ATTR_ANALYTICS_ALERT } from '../internal/analytics/selectors';
import { getBaseProps } from '../internal/base-component';
import VisualContext from '../internal/components/visual-context';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { awsuiPluginsInternal } from '../internal/plugins/api';
import { createUseDiscoveredAction, createUseDiscoveredContent } from '../internal/plugins/helpers';
import { SomeRequired } from '../internal/types';
import useContainerWidth from '../internal/utils/use-container-width';
import { ActionsWrapper } from './actions-wrapper';
import { GeneratedAnalyticsMetadataAlertDismiss } from './analytics-metadata/interfaces';
import { AlertProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';

const typeToIcon: Record<AlertProps.Type, IconProps['name']> = {
  error: 'status-negative',
  warning: 'status-warning',
  success: 'status-positive',
  info: 'status-info',
};

type InternalAlertProps = SomeRequired<AlertProps, 'type'> &
  InternalBaseComponentProps<HTMLDivElement> & {
    messageSlotId?: string;
    style?: Style;
  };

interface Style {
  alert?: { css?: StyleAlertCss };
  'alert:hover'?: {
    css?: StyleAlertCss;
    icon?: { css?: StyleAlertIconCss };
    dismissButton?: { css?: StyleAlertDismissIconCss };
  };
  icon?: { css?: StyleAlertIconCss };
  dismissButton?: { css?: StyleAlertDismissIconCss };
}

interface StyleAlertCss {
  backgroundColor?: string;
  borderColor?: string;
  color?: string;
}

interface StyleAlertIconCss {
  color?: string;
}

interface StyleAlertDismissIconCss {
  color?: string;
}

const useDiscoveredAction = createUseDiscoveredAction(awsuiPluginsInternal.alert.onActionRegistered);
const useDiscoveredContent = createUseDiscoveredContent('alert', awsuiPluginsInternal.alertContent);

const InternalAlert = React.forwardRef(
  (
    {
      type,
      i18nStrings,
      visible = true,
      dismissible,
      children,
      header,
      buttonText,
      action,
      onDismiss,
      onButtonClick,
      __internalRootRef = null,
      statusIconAriaLabel: deprecatedStatusIconAriaLabel,
      dismissAriaLabel: deprecatedDismissAriaLabel,
      messageSlotId,
      style,
      ...rest
    }: InternalAlertProps,
    ref: React.Ref<AlertProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const i18n = useInternalI18n('alert');

    const focusRef = useRef<HTMLDivElement>(null);
    useForwardFocus(ref, focusRef);

    const { discoveredActions, headerRef: headerRefAction, contentRef: contentRefAction } = useDiscoveredAction(type);
    const {
      initialHidden,
      headerReplacementType,
      contentReplacementType,
      headerRef: headerRefContent,
      contentRef: contentRefContent,
      replacementHeaderRef,
      replacementContentRef,
    } = useDiscoveredContent({ type, header, children });

    const [containerWidth, containerMeasureRef] = useContainerWidth();
    const containerRef = useMergeRefs(containerMeasureRef, __internalRootRef);
    const headerRef = useMergeRefs(headerRefAction, headerRefContent);
    const contentRef = useMergeRefs(contentRefAction, contentRefContent);

    const isRefresh = useVisualRefresh();
    const size = isRefresh
      ? 'normal'
      : headerReplacementType !== 'remove' && header && contentReplacementType !== 'remove' && children
        ? 'big'
        : 'normal';

    const hasAction = Boolean(action || buttonText || discoveredActions.length);

    const analyticsAttributes = {
      [DATA_ATTR_ANALYTICS_ALERT]: type,
    };

    const statusIconAriaLabel = i18n(
      `i18nStrings.${type}IconAriaLabel`,
      i18nStrings?.[`${type}IconAriaLabel`] ?? deprecatedStatusIconAriaLabel
    );

    const dismissAriaLabel = i18n(
      'i18nStrings.dismissAriaLabel',
      i18nStrings?.dismissAriaLabel ?? i18n('dismissAriaLabel', deprecatedDismissAriaLabel)
    );

    return (
      <div
        {...baseProps}
        {...analyticsAttributes}
        aria-hidden={!visible}
        className={clsx(
          styles.root,
          { [styles.hidden]: !visible, [styles['initial-hidden']]: initialHidden },
          baseProps.className
        )}
        ref={containerRef}
      >
        <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
          <VisualContext contextName="alert">
            <div
              className={clsx(
                styles.alert,
                styles[`type-${type}`],
                styles[`icon-size-${size}`],
                hasAction && styles['with-action'],
                dismissible && styles['with-dismiss']
              )}
              style={{
                '--awsui-alert-alert-bg': style?.alert?.css?.backgroundColor ?? '',
                '--awsui-alert-hover-alert-bg':
                  style?.['alert:hover']?.css?.backgroundColor ?? style?.alert?.css?.backgroundColor ?? '',
                '--awsui-alert-alert-color': style?.alert?.css?.color ?? '',
                '--awsui-alert-hover-alert-color': style?.['alert:hover']?.css?.color ?? style?.alert?.css?.color ?? '',
                '--awsui-alert-alert-border': style?.alert?.css?.borderColor ?? '',
                '--awsui-alert-hover-alert-border':
                  style?.['alert:hover']?.css?.borderColor ?? style?.alert?.css?.borderColor ?? '',
                '--awsui-alert-icon-color': style?.icon?.css?.color ?? '',
                '--awsui-alert-hover-icon-color':
                  style?.['alert:hover']?.icon?.css?.color ?? style?.icon?.css?.color ?? '',
              }}
            >
              <div className={styles['alert-wrapper']}>
                <div className={styles['alert-focus-wrapper']} tabIndex={-1} ref={focusRef}>
                  <div className={clsx(styles.icon, styles.text)}>
                    <InternalIcon name={typeToIcon[type]} size={size} ariaLabel={statusIconAriaLabel} />
                  </div>
                  <div className={clsx(styles.message, styles.text)} id={messageSlotId}>
                    <div
                      className={clsx(
                        header && styles.header,
                        headerReplacementType !== 'original' ? styles.hidden : analyticsSelectors.header
                      )}
                      ref={headerRef}
                    >
                      {header}
                    </div>
                    <div
                      className={clsx(
                        styles['header-replacement'],
                        headerReplacementType !== 'replaced' ? styles.hidden : analyticsSelectors.header
                      )}
                      ref={replacementHeaderRef}
                    ></div>
                    <div
                      className={clsx(styles.content, contentReplacementType !== 'original' && styles.hidden)}
                      ref={contentRef}
                    >
                      {children}
                    </div>
                    <div
                      className={clsx(
                        styles['content-replacement'],
                        contentReplacementType !== 'replaced' && styles.hidden
                      )}
                      ref={replacementContentRef}
                    ></div>
                  </div>
                </div>
                <ActionsWrapper
                  className={styles.action}
                  testUtilClasses={{
                    actionSlot: styles['action-slot'],
                    actionButton: styles['action-button'],
                  }}
                  action={action}
                  discoveredActions={discoveredActions}
                  buttonText={buttonText}
                  onButtonClick={() => fireNonCancelableEvent(onButtonClick)}
                  containerWidth={containerWidth}
                  wrappedClass={styles['action-wrapped']}
                />
              </div>
              {dismissible && (
                <div
                  className={styles.dismiss}
                  {...getAnalyticsMetadataAttribute({
                    action: 'dismiss',
                  } as Partial<GeneratedAnalyticsMetadataAlertDismiss>)}
                  style={{
                    '--awsui-button-button-color': style?.dismissButton?.css?.color ?? '',
                    '--awsui-alert-hover-button-color':
                      style?.['alert:hover']?.dismissButton?.css?.color ?? style?.dismissButton?.css?.color ?? '',
                  }}
                >
                  <InternalButton
                    className={styles['dismiss-button']}
                    variant="icon"
                    iconName="close"
                    formAction="none"
                    ariaLabel={dismissAriaLabel}
                    onClick={() => fireNonCancelableEvent(onDismiss)}
                  />
                </div>
              )}
            </div>
          </VisualContext>
        </LinkDefaultVariantContext.Provider>
      </div>
    );
  }
);

export default InternalAlert;
