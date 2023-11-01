// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../internal/base-component';
import InternalStatusIndicator from '../status-indicator/internal';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { DrawerProps } from './interfaces';
import LiveRegion from '../internal/components/live-region';
import { useInternalI18n } from '../i18n/context';

export { DrawerProps };

export default function Drawer({ header, children, loading, i18nStrings, ...restProps }: DrawerProps) {
  const { __internalRootRef } = useBaseComponent('Drawer');
  const baseProps = getBaseProps(restProps);
  const i18n = useInternalI18n('drawer');
  const containerProps = {
    ...baseProps,
    className: clsx(baseProps.className, styles.drawer),
  };
  return loading ? (
    <div {...containerProps} ref={__internalRootRef}>
      <InternalStatusIndicator type="loading">
        <LiveRegion visible={true}>{i18n('i18nStrings.loadingText', i18nStrings?.loadingText)}</LiveRegion>
      </InternalStatusIndicator>
    </div>
  ) : (
    <div {...containerProps} ref={__internalRootRef}>
      {header && <div className={clsx(styles.header)}>{header}</div>}
      <div className={clsx(styles['test-utils-drawer-content'])}>{children}</div>
    </div>
  );
}

applyDisplayName(Drawer, 'Drawer');
