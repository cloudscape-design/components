// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import { InternalButton } from '../button/internal';
import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import VisualContext from '../internal/components/visual-context';
import styles from './styles.css.js';
import { fireNonCancelableEvent } from '../internal/events';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import useForwardFocus from '../internal/hooks/forward-focus';
import { AlertProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SomeRequired } from '../internal/types';
import { useInternalI18n } from '../i18n/context';
import { DATA_ATTR_ANALYTICS_ALERT } from '../internal/analytics/selectors';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';

const typeToIcon: Record<AlertProps.Type, IconProps['name']> = {
  error: 'status-negative',
  warning: 'status-warning',
  success: 'status-positive',
  info: 'status-info',
};

type InternalAlertProps = SomeRequired<AlertProps, 'type'> & InternalBaseComponentProps;

const InternalAlert = React.forwardRef(
  (
    {
      type,
      statusIconAriaLabel,
      visible = true,
      dismissible,
      dismissAriaLabel,
      children,
      header,
      buttonText,
      action,
      onDismiss,
      onButtonClick,
      __internalRootRef = null,
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

    const isRefresh = useVisualRefresh();
    const size = isRefresh ? 'normal' : header && children ? 'big' : 'normal';

    const actionButton = action || (
      <InternalButton
        className={styles['action-button']}
        onClick={() => fireNonCancelableEvent(onButtonClick)}
        formAction="none"
      >
        {buttonText}
      </InternalButton>
    );

    const hasAction = Boolean(action || buttonText);
    const analyticsAttributes = {
      [DATA_ATTR_ANALYTICS_ALERT]: type,
    };

    return (
      <div
        {...baseProps}
        {...analyticsAttributes}
        aria-hidden={!visible}
        className={clsx(
          styles.root,
          { [styles.hidden]: !visible },
          baseProps.className,
          styles[`breakpoint-${breakpoint}`]
        )}
        ref={mergedRef}
      >
        <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
          <VisualContext contextName="alert">
            <div className={clsx(styles.alert, styles[`type-${type}`], styles[`icon-size-${size}`])}>
              <div className={styles['alert-mobile-block']}>
                <div className={styles['alert-focus-wrapper']} tabIndex={-1} ref={focusRef}>
                  <div className={clsx(styles.icon, styles.text)} role="img" aria-label={statusIconAriaLabel}>
                    <InternalIcon name={typeToIcon[type]} size={size} />
                  </div>
                  <div className={styles.body}>
                    <div className={clsx(styles.message, styles.text)}>
                      {header && <div className={styles.header}>{header}</div>}
                      <div className={styles.content}>{children}</div>
                    </div>
                  </div>
                </div>
                {hasAction && <div className={styles.action}>{actionButton}</div>}
              </div>
              {dismissible && (
                <div className={styles.dismiss}>
                  <InternalButton
                    className={styles['dismiss-button']}
                    variant="icon"
                    iconName="close"
                    formAction="none"
                    ariaLabel={i18n('dismissAriaLabel', dismissAriaLabel)}
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
