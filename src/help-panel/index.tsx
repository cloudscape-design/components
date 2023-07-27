// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import InternalStatusIndicator from '../status-indicator/internal';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { HelpPanelProps } from './interfaces';
import LiveRegion from '../internal/components/live-region';
import { useInternalI18n } from '../i18n/context';

export { HelpPanelProps };

export default function HelpPanel({ header, footer, children, loading, loadingText, ...restProps }: HelpPanelProps) {
  const { __internalRootRef } = useBaseComponent('HelpPanel');
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
      <div className={clsx(styles.content)}>{children}</div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}

applyDisplayName(HelpPanel, 'HelpPanel');
