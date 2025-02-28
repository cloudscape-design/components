// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { InternalButton } from '../button/internal.js';
import { useInternalI18n } from '../i18n/context.js';
import { IconProps } from '../icon/interfaces.js';
import InternalIcon from '../icon/internal.js';
import { getBaseProps } from '../internal/base-component/index.js';
import VisualContext from '../internal/components/visual-context/index.js';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context.js';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import { useContainerBreakpoints } from '../internal/hooks/container-queries/index.js';
import useForwardFocus from '../internal/hooks/forward-focus/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { useMergeRefs } from '../internal/hooks/use-merge-refs/index.js';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode/index.js';
import { awsuiPluginsInternal } from '../internal/plugins/api.js';
import { createUseDiscoveredAction, createUseDiscoveredContent } from '../internal/plugins/helpers/index.js';
import { SomeRequired } from '../internal/types.js';
import { ActionsWrapper } from './actions-wrapper/index.js';
import { GeneratedAnalyticsMetadataAlertDismiss } from './analytics-metadata/interfaces.js';
import { AlertProps } from './interfaces.js';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
import { DATA_ATTR_ANALYTICS_ALERT } from '../internal/analytics/selectors.js';

const typeToIcon: Record<AlertProps.Type, IconProps['name']> = {
  error: 'status-negative',
  warning: 'status-warning',
  success: 'status-positive',
  info: 'status-info',
};

type InternalAlertProps = SomeRequired<AlertProps, 'type'> & InternalBaseComponentProps<HTMLDivElement>;

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
      ...rest
    }: InternalAlertProps,
    ref: React.Ref<AlertProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const i18n = useInternalI18n('alert');

    const focusRef = useRef<HTMLDivElement>(null);
    useForwardFocus(ref, focusRef);

    const [breakpoint, breakpointRef] = useContainerBreakpoints(['xs']);
    const mergedRef = useMergeRefs(breakpointRef, __internalRootRef);

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
        ref={mergedRef}
      >
        <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
          <VisualContext contextName="alert">
            <div
              className={clsx(
                styles.alert,
                styles[`type-${type}`],
                styles[`icon-size-${size}`],
                hasAction && styles['with-action'],
                dismissible && styles['with-dismiss'],
                styles[`breakpoint-${breakpoint}`]
              )}
            >
              <div className={styles['alert-focus-wrapper']} tabIndex={-1} ref={focusRef}>
                <div className={clsx(styles.icon, styles.text)}>
                  <InternalIcon name={typeToIcon[type]} size={size} ariaLabel={statusIconAriaLabel} />
                </div>
                <div className={clsx(styles.message, styles.text)}>
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
              />
              {dismissible && (
                <div
                  className={styles.dismiss}
                  {...getAnalyticsMetadataAttribute({
                    action: 'dismiss',
                  } as Partial<GeneratedAnalyticsMetadataAlertDismiss>)}
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
