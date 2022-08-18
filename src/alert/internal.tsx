// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
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
import { AlertProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SomeRequired } from '../internal/types';

const typeToIcon: Record<AlertProps.Type, IconProps['name']> = {
  error: 'status-negative',
  warning: 'status-warning',
  success: 'status-positive',
  info: 'status-info',
};

type InternalAlertProps = SomeRequired<AlertProps, 'type'> & InternalBaseComponentProps;

export default function InternalAlert({
  type,
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
}: InternalAlertProps) {
  const baseProps = getBaseProps(rest);

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

  return (
    <div
      {...baseProps}
      aria-hidden={!visible}
      className={clsx(
        styles.root,
        { [styles.hidden]: !visible },
        baseProps.className,
        styles[`breakpoint-${breakpoint}`]
      )}
      ref={mergedRef}
    >
      <VisualContext contextName="alert">
        <div className={clsx(styles.alert, styles[`type-${type}`])}>
          <div className={clsx(styles.icon, styles.text)}>
            <InternalIcon name={typeToIcon[type]} size={size} />
          </div>
          <div className={styles.body}>
            <div className={clsx(styles.message, styles.text)}>
              {header && <div className={styles.header}>{header}</div>}
              <div className={styles.content}>{children}</div>
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
                ariaLabel={dismissAriaLabel}
                onClick={() => fireNonCancelableEvent(onDismiss)}
              />
            </div>
          )}
        </div>
      </VisualContext>
    </div>
  );
}
