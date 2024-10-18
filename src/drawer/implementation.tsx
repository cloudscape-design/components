// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useAppLayoutToolbarEnabled } from '../app-layout/utils/feature-flags';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import InternalLiveRegion from '../internal/components/live-region/internal';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { createWidgetizedComponent } from '../internal/widgets';
import InternalStatusIndicator from '../status-indicator/internal';
import { DrawerProps } from './interfaces';

import styles from './styles.css.js';

export type DrawerInternalProps = DrawerProps & InternalBaseComponentProps;

export function DrawerImplementation({
  header,
  children,
  loading,
  i18nStrings,
  __internalRootRef,
  ...restProps
}: DrawerInternalProps) {
  const baseProps = getBaseProps(restProps);
  const isToolbar = useAppLayoutToolbarEnabled();
  const i18n = useInternalI18n('drawer');
  const containerProps = {
    ...baseProps,
    className: clsx(baseProps.className, styles.drawer, isToolbar && styles['with-toolbar']),
  };
  return loading ? (
    <div {...containerProps} ref={__internalRootRef}>
      <InternalStatusIndicator type="loading">
        <InternalLiveRegion tagName="span">
          {i18n('i18nStrings.loadingText', i18nStrings?.loadingText)}
        </InternalLiveRegion>
      </InternalStatusIndicator>
    </div>
  ) : (
    <div {...containerProps} ref={__internalRootRef}>
      {header && <div className={styles.header}>{header}</div>}
      <div className={styles['test-utils-drawer-content']}>{children}</div>
    </div>
  );
}

export const createWidgetizedDrawer = createWidgetizedComponent(DrawerImplementation);
