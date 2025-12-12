// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { RefObject, useRef } from 'react';
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
import { useStickyFooter } from './use-sticky-footer';

import styles from './styles.css.js';

type DrawerInternalProps = DrawerProps & InternalBaseComponentProps;

export function DrawerImplementation({
  header,
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
    className: clsx(
      baseProps.className,
      styles.drawer,
      isToolbar && styles['with-toolbar'],
      !!footer && styles['with-footer']
    ),
  };
  const footerRef = useRef<HTMLDivElement>(null);

  const runtimeDrawerContext = useRuntimeDrawerContext({ rootRef: __internalRootRef as RefObject<HTMLElement> });
  const hasAdditioalDrawerAction = !!runtimeDrawerContext?.isExpandable;
  const { isSticky: isFooterSticky } = useStickyFooter({
    drawerRef: __internalRootRef as RefObject<HTMLElement>,
    footerRef,
  });

  return loading ? (
    <div
      {...containerProps}
      className={clsx(containerProps.className, styles['content-with-paddings'])}
      ref={__internalRootRef}
    >
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
          className={clsx(
            styles.header,
            runtimeDrawerContext && styles['with-runtime-context'],
            hasAdditioalDrawerAction && styles['with-additional-action']
          )}
        >
          {header}
          {headerActions && <div className={styles['header-actions']}>{headerActions}</div>}
        </div>
      )}
      <div
        className={clsx(
          styles['test-utils-drawer-content'],
          styles.content,
          !disableContentPaddings && styles['content-with-paddings']
        )}
      >
        {children}
      </div>
      {footer && (
        <div
          ref={footerRef}
          className={clsx(styles.footer, {
            [styles['is-sticky']]: isFooterSticky,
          })}
        >
          {footer}
        </div>
      )}
    </div>
  );
}

export const createWidgetizedDrawer = createWidgetizedComponent(DrawerImplementation);
