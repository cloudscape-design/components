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
import { fireCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
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
  defaultOpen,
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

  const scheduledCallRef = useRef<null | (() => void)>(null);
  useEffect(() => {
    if (scheduledCallRef.current) {
      scheduledCallRef.current();
    }
    scheduledCallRef.current = null;
  });

  const [isOpen, setIsOpen] = useControllable(open, onClose, defaultOpen ?? true, {
    componentName: 'Drawer',
    controlledProp: 'open',
    changeHandler: 'onClose',
  });

  const focusDrawer = useStableCallback(() => {
    containerRef.current?.focus();
  });

  const returnFocusFromDrawer = useStableCallback(() => {
    if (focusBehavior?.returnFocus) {
      focusBehavior.returnFocus();
    } else {
      const target = returnFocusTargetRef.current;
      if (target && target.isConnected) {
        target.focus();
      }
    }
    returnFocusTargetRef.current = null;
  });

  const handleClose: NonNullable<NextDrawerProps['onClose']> = useStableCallback(event => {
    onClose?.(event);
    if (!event.defaultPrevented && open === undefined) {
      scheduledCallRef.current = returnFocusFromDrawer;
      setIsOpen(false);
    }
  });

  useImperativeHandle(__ref, () => {
    const doOpen = () => {
      if (open === undefined) {
        returnFocusTargetRef.current = document.activeElement as HTMLElement;
        scheduledCallRef.current = focusDrawer;
        setIsOpen(true);
      }
    };
    const doClose = () => {
      if (open === undefined) {
        scheduledCallRef.current = returnFocusFromDrawer;
        setIsOpen(false);
      }
    };
    return {
      open: doOpen,
      close: doClose,
      toggle: () => (isOpen ? doClose() : doOpen()),
      focus: () => focusDrawer(),
    };
  }, [open, isOpen, setIsOpen, focusDrawer, returnFocusFromDrawer]);

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
        fireCancelableEvent(handleClose, { method: 'escape' });
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showBackdrop, handleClose]);

  return (
    <div
      {...baseProps}
      className={clsx(baseProps.className, testClasses.drawer, !isOpen && styles.hidden)}
      ref={__internalRootRef}
    >
      {showBackdrop && (
        <div
          className={clsx(styles.backdrop, testClasses.backdrop, styles[`backdrop-${position}`])}
          style={{ zIndex }}
          onClick={() => fireCancelableEvent(handleClose, { method: 'backdrop-click' })}
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
                        onClick={() => fireCancelableEvent(handleClose, { method: 'close-action' })}
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
