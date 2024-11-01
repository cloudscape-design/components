// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { BreadcrumbGroupImplementation } from '../../../breadcrumb-group/implementation';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutProps } from '../../interfaces';
import { Focusable, FocusControlMultipleStates } from '../../utils/use-focus-control';
import { BreadcrumbsSlotContext } from '../contexts';
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
  globalDrawersFocusControl?: FocusControlMultipleStates;
  onActiveDrawerChange?: (drawerId: string | null) => void;
  globalDrawers?: ReadonlyArray<AppLayoutProps.Drawer> | undefined;
  activeGlobalDrawersIds?: ReadonlyArray<string>;
  onActiveGlobalDrawersChange?: ((drawerId: string) => void) | undefined;
}

interface AppLayoutToolbarImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  toolbarProps: ToolbarProps;
}

// support compatibility with changes before this commit: cf0f2b0755af1a28ac7c3c9476418a7ea807d0fd
function convertLegacyProps(toolbarProps: ToolbarProps, legacyProps: AppLayoutInternals): ToolbarProps {
  return {
    ariaLabels: toolbarProps.ariaLabels ?? legacyProps.ariaLabels,
    activeDrawerId: toolbarProps.activeDrawerId ?? legacyProps.activeDrawer?.id,
    drawers: toolbarProps.drawers ?? legacyProps.drawers,
    drawersFocusRef: toolbarProps.drawersFocusRef ?? legacyProps.drawersFocusControl?.refs.toggle,
    globalDrawersFocusControl: toolbarProps.globalDrawersFocusControl,
    onActiveDrawerChange: toolbarProps.onActiveDrawerChange ?? legacyProps.onActiveDrawerChange,
    globalDrawers: toolbarProps.globalDrawers ?? legacyProps.globalDrawers,
    activeGlobalDrawersIds: toolbarProps.activeGlobalDrawersIds ?? legacyProps.activeGlobalDrawersIds,
    onActiveGlobalDrawersChange: toolbarProps.onActiveGlobalDrawersChange ?? legacyProps.onActiveGlobalDrawersChange,
    hasNavigation: toolbarProps.hasNavigation ?? !!legacyProps.navigation,
    navigationOpen: toolbarProps.navigationOpen ?? legacyProps.navigationOpen,
    navigationFocusRef: toolbarProps.navigationFocusRef ?? legacyProps.navigationFocusControl?.refs.toggle,
    onNavigationToggle: toolbarProps.onNavigationToggle ?? legacyProps.onNavigationToggle,
    hasSplitPanel: toolbarProps.hasSplitPanel ?? true,
    splitPanelFocusRef: legacyProps.splitPanelFocusControl?.refs.toggle,
    splitPanelToggleProps: toolbarProps.splitPanelToggleProps ?? {
      ...legacyProps.splitPanelToggleConfig,
      active: legacyProps.splitPanelOpen,
      controlId: legacyProps.splitPanelControlId,
      position: legacyProps.splitPanelPosition,
    },
    onSplitPanelToggle: toolbarProps.onSplitPanelToggle ?? legacyProps.onSplitPanelToggle,
  };
}

export function AppLayoutToolbarImplementation({
  appLayoutInternals,
  // the value could be undefined if this component is loaded as a widget by a different app layout version
  // not testable in a single-version setup
  toolbarProps = {},
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
    globalDrawersFocusControl,
    globalDrawers,
    activeGlobalDrawersIds,
    onActiveGlobalDrawersChange,
    hasNavigation,
    navigationOpen,
    navigationFocusRef,
    onNavigationToggle,
    hasSplitPanel,
    splitPanelFocusRef,
    splitPanelToggleProps,
    onSplitPanelToggle,
  } = convertLegacyProps(toolbarProps, appLayoutInternals);
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

  const anyPanelOpenInMobile = !!isMobile && (!!activeDrawerId || (!!navigationOpen && !!hasNavigation));
  useEffect(() => {
    if (anyPanelOpenInMobile) {
      document.body.classList.add(styles['block-body-scroll']);
    } else {
      document.body.classList.remove(styles['block-body-scroll']);
    }
    return () => {
      document.body.classList.remove(styles['block-body-scroll']);
    };
  }, [anyPanelOpenInMobile]);

  const toolbarHidden = toolbarState === 'hide' && !pinnedToolbar;

  return (
    <ToolbarSlot
      ref={ref}
      className={clsx(styles['universal-toolbar'], testutilStyles.toolbar, {
        [testutilStyles['mobile-bar']]: isMobile,
        [styles['toolbar-hidden']]: toolbarHidden,
      })}
      style={{
        insetBlockStart: toolbarHidden ? '-60px' : verticalOffsets.toolbar,
      }}
    >
      <div className={styles['toolbar-container']}>
        {hasNavigation && (
          <nav className={clsx(styles['universal-toolbar-nav'])}>
            <TriggerButton
              ariaLabel={ariaLabels?.navigationToggle ?? undefined}
              ariaExpanded={false}
              iconName="menu"
              className={testutilStyles['navigation-toggle']}
              onClick={() => onNavigationToggle?.(!navigationOpen)}
              ref={navigationFocusRef}
              selected={navigationOpen}
              disabled={anyPanelOpenInMobile}
            />
          </nav>
        )}
        {(breadcrumbs || discoveredBreadcrumbs) && (
          <div className={clsx(styles['universal-toolbar-breadcrumbs'], testutilStyles.breadcrumbs)}>
            <BreadcrumbsSlotContext.Provider value={{ isInToolbar: true }}>
              <div className={styles['breadcrumbs-own']}>{breadcrumbs}</div>
              {discoveredBreadcrumbs && (
                <div className={styles['breadcrumbs-discovered']}>
                  <BreadcrumbGroupImplementation
                    {...discoveredBreadcrumbs}
                    data-awsui-discovered-breadcrumbs={true}
                    __injectAnalyticsComponentMetadata={true}
                  />
                </div>
              )}
            </BreadcrumbsSlotContext.Provider>
          </div>
        )}
        {((drawers && drawers.length > 0) || (hasSplitPanel && splitPanelToggleProps?.displayed)) && (
          <div className={clsx(styles['universal-toolbar-drawers'])}>
            <DrawerTriggers
              ariaLabels={ariaLabels}
              activeDrawerId={activeDrawerId ?? null}
              drawers={drawers?.filter(item => !!item.trigger) ?? []}
              drawersFocusRef={drawersFocusRef}
              onActiveDrawerChange={onActiveDrawerChange}
              splitPanelToggleProps={splitPanelToggleProps?.displayed ? splitPanelToggleProps : undefined}
              splitPanelFocusRef={splitPanelFocusRef}
              onSplitPanelToggle={onSplitPanelToggle}
              disabled={anyPanelOpenInMobile}
              globalDrawersFocusControl={globalDrawersFocusControl}
              globalDrawers={globalDrawers?.filter(item => !!item.trigger) ?? []}
              activeGlobalDrawersIds={activeGlobalDrawersIds ?? []}
              onActiveGlobalDrawersChange={onActiveGlobalDrawersChange}
            />
          </div>
        )}
      </div>
    </ToolbarSlot>
  );
}

export const createWidgetizedAppLayoutToolbar = createWidgetizedComponent(AppLayoutToolbarImplementation);
