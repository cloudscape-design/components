// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import InternalStatusIndicator from '../status-indicator/internal';
import styles from './styles.css.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { HelpPanelProps } from './interfaces';
import LiveRegion from '../internal/components/live-region';
import { useInternalI18n } from '../i18n/context';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import { createWidgetizedComponent } from '../internal/widgets';

export type HelpPanelInternalProps = HelpPanelProps & InternalBaseComponentProps;

export function HelpPanelImplementation({
  header,
  footer,
  children,
  loading,
  loadingText,
  __internalRootRef,
  ...restProps
}: HelpPanelInternalProps) {
  const baseProps = getBaseProps(restProps);
  const i18n = useInternalI18n('help-panel');
  const containerProps = {
    ...baseProps,
    className: clsx(baseProps.className, styles['help-panel']),
  };
  return loading ? (
    <div {...containerProps} ref={__internalRootRef}>
      <InternalStatusIndicator type="loading">
        <LiveRegion visible={true}>{i18n('loadingText', loadingText)}</LiveRegion>
      </InternalStatusIndicator>
    </div>
  ) : (
    <div {...containerProps} ref={__internalRootRef}>
      {header && <div className={clsx(styles.header)}>{header}</div>}
      <LinkDefaultVariantContext.Provider value={{ defaultVariant: 'primary' }}>
        <div className={clsx(styles.content)}>{children}</div>
      </LinkDefaultVariantContext.Provider>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}

export const createWidgetizedHelpPanel = createWidgetizedComponent(HelpPanelImplementation);
