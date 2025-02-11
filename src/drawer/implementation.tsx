// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useAppLayoutToolbarEnabled } from '../app-layout/utils/feature-flags.js';
import { useInternalI18n } from '../i18n/context.js';
import { getBaseProps } from '../internal/base-component/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { createWidgetizedComponent } from '../internal/widgets/index.js';
import InternalLiveRegion from '../live-region/internal.js';
import InternalStatusIndicator from '../status-indicator/internal.js';
import { DrawerProps } from './interfaces.js';

import styles from './styles.css.js';

type DrawerInternalProps = DrawerProps & InternalBaseComponentProps;

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
      <div className={clsx(styles['test-utils-drawer-content'], styles.content)}>{children}</div>
    </div>
  );
}

export const createWidgetizedDrawer = createWidgetizedComponent(DrawerImplementation);
