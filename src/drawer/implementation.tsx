// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { RefObject, useEffect, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { useRuntimeDrawerContext } from '../app-layout/runtime-drawer/use-runtime-drawer-context';
import { useAppLayoutToolbarDesignEnabled } from '../app-layout/utils/feature-flags';
import InternalButton from '../button/internal';
import { BuiltInErrorBoundary } from '../error-boundary/internal';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import FocusLock from '../internal/components/focus-lock';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
import { createWidgetizedComponent } from '../internal/widgets';
import InternalLiveRegion from '../live-region/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import { NextDrawerProps } from './interfaces';
import { useStickyFooter } from './use-sticky-footer';
import { getPositionStyles } from './utils';

import styles from './styles.css.js';
import testClasses from './test-classes/styles.css.js';

type DrawerInternalProps = NextDrawerProps &
  InternalBaseComponentProps & {
    __ref?: React.Ref<NextDrawerProps.Ref>;
  };

export function DrawerImplementation({
  header,
  footer,
  children,
  loading,
  i18nStrings,
  disableContentPaddings,
  __internalRootRef,
  __ref,
  headerActions,
  position = 'static',
  placement = 'end',
  offset,
  stickyOffset,
  zIndex,
  closeAction,
  hideCloseAction = false,
  backdrop = false,
  open,
  onClose,
  ariaLabel,
  ariaLabelledby,
  focusBehavior,
  ...restProps
}: DrawerInternalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const returnFocusTargetRef = useRef<HTMLElement | null>(null);

  const baseProps = getBaseProps(restProps);
  const isToolbar = useAppLayoutToolbarDesignEnabled();
  const i18n = useInternalI18n('drawer');
  const positionStyles = getPositionStyles({ position, placement, offset, stickyOffset, zIndex });
  const generatedHeaderId = useUniqueId('drawer-header');
  const headerId = header ? generatedHeaderId : undefined;
  ariaLabelledby = ariaLabelledby ?? (ariaLabel ? undefined : headerId);
  const containerProps = {
    ref: containerRef,
    role: 'region',
    tabIndex: -1,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    style: positionStyles.style,
    className: clsx(
      styles.drawer,
      loading && styles['content-with-paddings'],
      isToolbar && styles['with-toolbar'],
      !!footer && styles['with-footer'],
      positionStyles.className
    ),
  };

  const returnFocusFromDrawer = useStableCallback(() => {
    if (focusBehavior?.returnFocus) {
      focusBehavior.returnFocus();
    } else if (returnFocusTargetRef.current && returnFocusTargetRef.current.isConnected) {
      returnFocusTargetRef.current.focus();
    }
    returnFocusTargetRef.current = null;
  });

  const autoFocusRef = useRef(false);
  autoFocusRef.current = focusBehavior?.autoFocus ?? true;

  // The use-effect-on-update ensures no focus transition on component's initial render.
  // If focus transition is needed - the drawerRef.current.focus() should be used instead.
  useEffectOnUpdate(() => {
    if (open === undefined) {
      return;
    }
    if (open && autoFocusRef.current) {
      returnFocusTargetRef.current = document.activeElement as HTMLElement;
      containerRef.current?.focus();
    }
    if (!open) {
      returnFocusFromDrawer();
    }
  }, [open, returnFocusFromDrawer]);

  const handleClose = useStableCallback((method: 'close-action' | 'backdrop-click' | 'escape') =>
    fireNonCancelableEvent(onClose, { method })
  );

  useImperativeHandle(__ref, () => ({ focus: () => containerRef.current?.focus() }), []);

  const runtimeDrawerContext = useRuntimeDrawerContext({ rootRef: __internalRootRef as RefObject<HTMLElement> });
  const hasAdditionalDrawerAction = !!runtimeDrawerContext?.isExpandable;
  const { isSticky: isFooterSticky } = useStickyFooter({
    drawerRef: __internalRootRef as RefObject<HTMLElement>,
    footerRef,
  });

  const showBackdrop = backdrop && (position === 'fixed' || position === 'absolute');
  const trapFocus = focusBehavior?.trapFocus ?? showBackdrop;

  useEffect(() => {
    if (!showBackdrop) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose('escape');
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showBackdrop, handleClose]);

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, testClasses.drawer, open === false && styles.hidden)}
      ref={__internalRootRef}
    >
      {showBackdrop && (
        <div
          className={clsx(styles.backdrop, testClasses.backdrop, styles[`backdrop-${position}`])}
          style={{ zIndex }}
          onClick={() => handleClose('backdrop-click')}
        />
      )}
      <FocusLock disabled={!trapFocus}>
        <div {...containerProps}>
          {loading ? (
            <InternalStatusIndicator type="loading">
              <InternalLiveRegion tagName="span">
                {i18n('i18nStrings.loadingText', i18nStrings?.loadingText)}
              </InternalLiveRegion>
            </InternalStatusIndicator>
          ) : (
            <>
              {header && (
                <div
                  className={clsx(
                    styles.header,
                    runtimeDrawerContext && styles['with-runtime-context'],
                    hasAdditionalDrawerAction && styles['with-additional-action'],
                    hideCloseAction && styles['hide-close-action']
                  )}
                >
                  <span id={headerId}>{header}</span>
                  {headerActions && <div className={styles['header-actions']}>{headerActions}</div>}
                  {closeAction && !hideCloseAction && (
                    <div className={styles['close-action']}>
                      <InternalButton
                        variant="icon"
                        iconName="close"
                        {...closeAction}
                        className={testClasses['close-action']}
                        onClick={() => handleClose('close-action')}
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
            </>
          )}
        </div>
      </FocusLock>
    </div>
  );
}

export const createWidgetizedDrawer = createWidgetizedComponent(DrawerImplementation);
