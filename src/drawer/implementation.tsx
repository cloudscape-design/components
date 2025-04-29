// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useAppLayoutToolbarDesignEnabled } from '../app-layout/utils/feature-flags';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { createWidgetizedComponent } from '../internal/widgets';
import InternalLiveRegion from '../live-region/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import { DrawerProps } from './interfaces';
import { useRuntimeDrawerContext } from './use-drawer-context';

import styles from './styles.css.js';

type DrawerInternalProps = DrawerProps & InternalBaseComponentProps;

export function DrawerImplementation({
  header,
  children,
  loading,
  i18nStrings,
  disableContentPaddings,
  __internalRootRef,
  headerActions,
  ...restProps
}: DrawerInternalProps) {
  const baseProps = getBaseProps(restProps);
  const isToolbar = useAppLayoutToolbarDesignEnabled();
  const i18n = useInternalI18n('drawer');
  const containerProps = {
    ...baseProps,
    className: clsx(baseProps.className, styles.drawer, isToolbar && styles['with-toolbar']),
  };

  const runtimeDrawerContext = useRuntimeDrawerContext({ __internalRootRef });
  // FIXME after releasing drawer focus mode feature
  const builtInActionsNumber = (runtimeDrawerContext as any)?.isExpandable ? 2 : 1;

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
      {header && (
        <div
          className={clsx(styles.header, builtInActionsNumber > 1 && styles[`with-${builtInActionsNumber}-actions`])}
        >
          {header}
          {headerActions && <div className={styles['header-actions']}>{headerActions}</div>}
        </div>
      )}
      <div
        className={clsx(
          styles['test-utils-drawer-content'],
          !disableContentPaddings && styles['content-with-paddings']
        )}
      >
        {children}
      </div>
    </div>
  );
}

export const createWidgetizedDrawer = createWidgetizedComponent(DrawerImplementation);
