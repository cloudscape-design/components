// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React from 'react';
import { getBaseProps } from '../../base-component';
import InternalStatusIndicator from '../../../status-indicator/internal';
import styles from './styles.css.js';
import { applyDisplayName } from '../../utils/apply-display-name';
import useBaseComponent from '../../hooks/use-base-component';
import { DrawerProps } from './interfaces';
import LiveRegion from '../../components/live-region';
import { useInternalI18n } from '../../../i18n/context';

export { DrawerProps };

export default function Drawer({ header, children, loading, loadingText, ...restProps }: DrawerProps) {
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
        <LiveRegion visible={true}>{i18n('loadingText', loadingText)}</LiveRegion>
      </InternalStatusIndicator>
    </div>
  ) : (
    <div {...containerProps} ref={__internalRootRef}>
      {header && <div className={clsx(styles.header)}>{header}</div>}
      <div className={clsx(styles.content)}>{children}</div>
    </div>
  );
}

applyDisplayName(Drawer, 'Drawer');
