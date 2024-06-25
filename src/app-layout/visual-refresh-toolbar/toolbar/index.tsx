// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { InternalBreadcrumbGroup } from '../../../breadcrumb-group/internal';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutProps } from '../../interfaces';
import { Focusable } from '../../utils/use-focus-control';
import { AppLayoutInternals } from '../interfaces';
import { ToolbarSlot } from '../skeleton/slot-wrappers';
import { DrawerTriggers, SplitPanelToggleProps } from './drawer-triggers';
import TriggerButton from './trigger-button';

import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

export { SplitPanelToggleProps };

export interface ToolbarProps {
  ariaLabels?: AppLayoutProps.Labels;
  // navigation
  hasNavigation?: boolean;
  navigationOpen?: boolean;
  onNavigationToggle?: (open: boolean) => void;
  navigationFocusRef?: React.Ref<Focusable>;

  // breadcrumbs
  hasBreadcrumbsPortal?: boolean;

  // split panel
  hasSplitPanel?: boolean;
  splitPanelToggleProps?: SplitPanelToggleProps;
  splitPanelFocusRef?: React.Ref<Focusable>;
  onSplitPanelToggle?: () => void;

  // drawers
  activeDrawerId?: string | null;
  drawers?: ReadonlyArray<AppLayoutProps.Drawer>;
  drawersFocusRef?: React.Ref<Focusable>;
  onActiveDrawerChange?: (drawerId: string | null) => void;
}

interface AppLayoutToolbarImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  toolbarProps: ToolbarProps;
}

export function AppLayoutToolbarImplementation({
  appLayoutInternals,
  toolbarProps,
}: AppLayoutToolbarImplementationProps) {
  const {
    breadcrumbs,
    discoveredBreadcrumbs,
    verticalOffsets,
    isMobile,
    toolbarState,
    setToolbarState,
    setToolbarHeight,
  } = appLayoutInternals;
  const {
    ariaLabels,
    activeDrawerId,
    drawers,
    drawersFocusRef,
    onActiveDrawerChange,
    hasNavigation,
    navigationOpen,
    navigationFocusRef,
    onNavigationToggle,
    hasSplitPanel,
    splitPanelFocusRef,
    splitPanelToggleProps,
    onSplitPanelToggle,
  } = toolbarProps;
  // TODO: expose configuration property
  const pinnedToolbar = true;
  const ref = useRef<HTMLElement>(null);
  useResizeObserver(ref, entry => setToolbarHeight(entry.borderBoxHeight));
  useEffect(() => {
    return () => {
      setToolbarHeight(0);
    };
    // unmount effect only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    /* istanbul ignore next not testable in JSDOM */
    const updateScrollDirection = () => {
      if (pinnedToolbar) {
        setToolbarState('show');
        return;
      }
      const scrollY = window.scrollY;
      // 80 is an arbitrary number to have a pause before the toolbar scrolls out of view at the top of the page
      const direction = scrollY > lastScrollY && scrollY > 80 ? 'hide' : 'show';
      // 2 as a buffer to avoid mistaking minor accidental mouse moves as scroll
      if (direction !== toolbarState && (scrollY - lastScrollY > 2 || scrollY - lastScrollY < -2)) {
        setToolbarState(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
    };
  }, [pinnedToolbar, setToolbarState, toolbarState]);

  const toolbarHidden = toolbarState === 'hide' && !pinnedToolbar;

  return (
    <ToolbarSlot
      ref={ref}
      className={clsx(styles['universal-toolbar'], {
        [testutilStyles['mobile-bar']]: isMobile,
        [styles['toolbar-hidden']]: toolbarHidden,
      })}
      style={{
        insetBlockStart: toolbarHidden ? '-60px' : verticalOffsets.toolbar,
      }}
    >
      <div className={styles['toolbar-container']}>
        {hasNavigation && !navigationOpen && (
          <nav className={clsx(styles['universal-toolbar-nav'], testutilStyles['drawer-closed'])}>
            <TriggerButton
              ariaLabel={ariaLabels?.navigationToggle ?? undefined}
              ariaExpanded={false}
              iconName="menu"
              className={testutilStyles['navigation-toggle']}
              onClick={() => onNavigationToggle?.(true)}
              ref={navigationFocusRef}
              selected={navigationOpen}
            />
          </nav>
        )}
        {(breadcrumbs || discoveredBreadcrumbs) && (
          <div className={clsx(styles['universal-toolbar-breadcrumbs'], testutilStyles.breadcrumbs)}>
            {breadcrumbs}
            {discoveredBreadcrumbs && <InternalBreadcrumbGroup {...discoveredBreadcrumbs} />}
          </div>
        )}
        {((drawers && drawers.length > 0) || (hasSplitPanel && splitPanelToggleProps?.displayed)) && (
          <span className={clsx(styles['universal-toolbar-drawers'])}>
            <DrawerTriggers
              ariaLabels={ariaLabels}
              activeDrawerId={activeDrawerId ?? null}
              drawers={drawers ?? []}
              drawersFocusRef={drawersFocusRef}
              onActiveDrawerChange={onActiveDrawerChange}
              splitPanelToggleProps={splitPanelToggleProps?.displayed ? splitPanelToggleProps : undefined}
              splitPanelFocusRef={splitPanelFocusRef}
              onSplitPanelToggle={onSplitPanelToggle}
            />
          </span>
        )}
      </div>
    </ToolbarSlot>
  );
}

export const createWidgetizedAppLayoutToolbar = createWidgetizedComponent(AppLayoutToolbarImplementation);
