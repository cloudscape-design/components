// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject } from 'react';
import clsx from 'clsx';

import { useRuntimeDrawerContext } from '../app-layout/runtime-drawer/use-runtime-drawer-context';
import { useAppLayoutToolbarDesignEnabled } from '../app-layout/utils/feature-flags';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { createWidgetizedComponent } from '../internal/widgets';
import InternalLiveRegion from '../live-region/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import { DrawerProps } from './interfaces';

import styles from './styles.css.js';

type DrawerInternalProps = DrawerProps & InternalBaseComponentProps;

export function DrawerImplementation({
  header,
  stickyHeader = false,
  footer,
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

  const runtimeDrawerContext = useRuntimeDrawerContext({ rootRef: __internalRootRef as RefObject<HTMLElement> });

  if (loading) {
    return (
      <div
        {...containerProps}
        className={clsx(
          containerProps.className,
          styles['content-with-paddings'],
          ((header && stickyHeader) || footer) && styles.flex
        )}
        ref={__internalRootRef}
      >
        <InternalStatusIndicator type="loading">
          <InternalLiveRegion tagName="span">
            {i18n('i18nStrings.loadingText', i18nStrings?.loadingText)}
          </InternalLiveRegion>
        </InternalStatusIndicator>
      </div>
    );
  }

  return (
    <div {...containerProps} ref={__internalRootRef}>
      {stickyHeader && (
        <HeaderComponent
          header={header}
          headerActions={headerActions}
          runtimeDrawerContext={runtimeDrawerContext}
          isSticky={true}
        />
      )}

      <div className={clsx(styles['drawer-content-wrapper'])}>
        {!stickyHeader && (
          <HeaderComponent
            header={header}
            headerActions={headerActions}
            runtimeDrawerContext={runtimeDrawerContext}
            isSticky={false}
          />
        )}

        <div
          className={clsx(
            styles['test-utils-drawer-content'],
            styles['drawer-content'],
            !disableContentPaddings && styles['with-paddings']
          )}
        >
          {children}
        </div>
      </div>

      {footer && (
        <div
          className={clsx(
            styles.footer,
            styles['footer-sticky'],
            runtimeDrawerContext && styles['with-runtime-context']
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

function HeaderComponent({
  header,
  headerActions,
  runtimeDrawerContext,
  isSticky,
}: {
  header: React.ReactNode;
  headerActions?: React.ReactNode;
  runtimeDrawerContext: any;
  isSticky: boolean;
}) {
  if (!header) {
    return null;
  }

  const headerClassName = clsx(
    styles.header,
    isSticky && styles['header-sticky'],
    runtimeDrawerContext && styles['with-runtime-context'],
    runtimeDrawerContext?.isExpandable && styles['with-additional-action'],
    'header-with-paddings'
  );

  return (
    <div className={headerClassName}>
      {header}
      {headerActions && <div className={styles['header-actions']}>{headerActions}</div>}
    </div>
  );
}

export const createWidgetizedDrawer = createWidgetizedComponent(DrawerImplementation);
