// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { RefObject, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useRuntimeDrawerContext } from '../app-layout/runtime-drawer/use-runtime-drawer-context';
import { useAppLayoutToolbarDesignEnabled } from '../app-layout/utils/feature-flags';
import InternalButton from '../button/internal';
import { BuiltInErrorBoundary } from '../error-boundary/internal';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import FocusLock from '../internal/components/focus-lock';
import { fireCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { createWidgetizedComponent } from '../internal/widgets';
import InternalLiveRegion from '../live-region/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import { NextDrawerProps } from './interfaces';
import { useStickyFooter } from './use-sticky-footer';
import { getPositionStyles } from './utils';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

type DrawerInternalProps = NextDrawerProps & InternalBaseComponentProps;

export function DrawerImplementation({
  header,
  footer,
  children,
  loading,
  i18nStrings,
  disableContentPaddings,
  __internalRootRef,
  headerActions,
  position = 'static',
  placement = 'end',
  offset,
  stickyOffset,
  zIndex,
  closeAction,
  hideCloseAction = false,
  backdrop = false,
  onClose,
  ...restProps
}: DrawerInternalProps) {
  const baseProps = getBaseProps(restProps);
  const isToolbar = useAppLayoutToolbarDesignEnabled();
  const i18n = useInternalI18n('drawer');
  const positionStyles = getPositionStyles({ position, placement, offset, stickyOffset, zIndex });
  const containerProps = {
    style: positionStyles.style,
    className: clsx(
      styles.drawer,
      isToolbar && styles['with-toolbar'],
      !!footer && styles['with-footer'],
      positionStyles.className
    ),
  };
  const footerRef = useRef<HTMLDivElement>(null);

  const runtimeDrawerContext = useRuntimeDrawerContext({ rootRef: __internalRootRef as RefObject<HTMLElement> });
  const hasAdditionalDrawerAction = !!runtimeDrawerContext?.isExpandable;
  const { isSticky: isFooterSticky } = useStickyFooter({
    drawerRef: __internalRootRef as RefObject<HTMLElement>,
    footerRef,
  });

  const content = loading ? (
    <div {...containerProps} className={clsx(containerProps.className, styles['content-with-paddings'])}>
      <InternalStatusIndicator type="loading">
        <InternalLiveRegion tagName="span">
          {i18n('i18nStrings.loadingText', i18nStrings?.loadingText)}
        </InternalLiveRegion>
      </InternalStatusIndicator>
    </div>
  ) : (
    <div {...containerProps}>
      {header && (
        <div
          className={clsx(
            styles.header,
            runtimeDrawerContext && styles['with-runtime-context'],
            hasAdditionalDrawerAction && styles['with-additional-action'],
            hideCloseAction && styles['hide-close-action']
          )}
        >
          {header}
          {headerActions && <div className={styles['header-actions']}>{headerActions}</div>}
          {closeAction && !hideCloseAction && (
            <div className={styles['close-action']}>
              <InternalButton
                variant="icon"
                iconName="close"
                {...closeAction}
                className={testClasses['close-action']}
                onClick={() => fireCancelableEvent(onClose, { method: 'close-action' })}
              />
            </div>
          )}
        </div>
      )}

      <div
        className={clsx(
          styles['test-utils-drawer-content'],
          styles.content,
          !disableContentPaddings && styles['content-with-paddings']
        )}
      >
        <BuiltInErrorBoundary>{children}</BuiltInErrorBoundary>
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

  const showBackdrop = backdrop && (position === 'fixed' || position === 'absolute');

  useEffect(() => {
    if (!showBackdrop) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        fireCancelableEvent(onClose, { method: 'escape' });
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showBackdrop, onClose]);

  return (
    <div {...baseProps} className={clsx(baseProps.className, testClasses.drawer)} ref={__internalRootRef}>
      {showBackdrop && (
        <div
          className={clsx(styles.backdrop, testClasses.backdrop, styles[`backdrop-${position}`])}
          style={{ zIndex }}
          onClick={() => fireCancelableEvent(onClose, { method: 'backdrop-click' })}
        />
      )}
      <FocusLock disabled={!showBackdrop}>{content}</FocusLock>
    </div>
  );
}

export const createWidgetizedDrawer = createWidgetizedComponent(DrawerImplementation);
