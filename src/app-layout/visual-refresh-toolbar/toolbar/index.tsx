// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutProps } from '../../interfaces';
import { OnChangeParams } from '../../utils/use-drawers';
import { Focusable, FocusControlMultipleStates } from '../../utils/use-focus-control';
import { AppLayoutInternals } from '../interfaces';
import { ToolbarSkeleton } from '../skeleton/skeleton-parts';
import { BreadcrumbsSlot, ToolbarSlot } from '../skeleton/slots';
import { DrawerTriggers, SplitPanelToggleProps } from './drawer-triggers';
import TriggerButton from './trigger-button';

import sharedStyles from '../../resize/styles.css.js';
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
  onActiveDrawerChange?: (drawerId: string | null, params: OnChangeParams) => void;
  globalDrawers?: ReadonlyArray<AppLayoutProps.Drawer> | undefined;
  activeGlobalDrawersIds?: ReadonlyArray<string>;
  onActiveGlobalDrawersChange?: ((drawerId: string, params: OnChangeParams) => void) | undefined;

  expandedDrawerId?: string | null;
  setExpandedDrawerId?: (value: string | null) => void;

  aiDrawer?: AppLayoutProps.Drawer;
  onActiveAiDrawerChange?: (value: string | null) => void;
  activeAiDrawerId?: string | null;
  aiDrawerFocusRef?: React.Ref<Focusable>;
}

export interface AppLayoutToolbarImplementationProps {
  appLayoutInternals: AppLayoutInternals;
  toolbarProps: ToolbarProps;
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
    setToolbarHeight,
    aiDrawer,
    activeAiDrawer,
    onActiveAiDrawerChange,
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
    expandedDrawerId,
    setExpandedDrawerId,
    aiDrawerFocusRef,
  } = toolbarProps;
  const drawerExpandedMode = !!expandedDrawerId;
  const ref = useRef<HTMLElement>(null);
  const aiDrawerTransitionRef = useRef<HTMLDivElement>(null);
  const activeAiDrawerId = activeAiDrawer?.id;
  useResizeObserver(ref, entry => setToolbarHeight(entry.borderBoxHeight));
  useEffect(() => {
    return () => {
      setToolbarHeight(0);
    };
    // unmount effect only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anyPanelOpenInMobile =
    !!isMobile &&
    (!!activeDrawerId ||
      !!activeGlobalDrawersIds?.length ||
      !!activeAiDrawerId ||
      (!!navigationOpen && !!hasNavigation));
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

  const navLandmarkAttributes = navigationOpen
    ? { role: 'presentation' }
    : { role: 'navigation', 'aria-label': ariaLabels?.navigation };

  return (
    <ToolbarSlot
      ref={ref}
      className={clsx(styles['universal-toolbar'], testutilStyles.toolbar, {
        [testutilStyles['mobile-bar']]: isMobile,
        [styles['with-open-ai-drawer']]: !!activeAiDrawerId,
      })}
      style={{
        insetBlockStart: verticalOffsets.toolbar,
      }}
    >
      <Transition
        in={!!(aiDrawer?.trigger && !activeAiDrawerId)}
        timeout={{ enter: 0, exit: 165 }}
        mountOnEnter={true}
        unmountOnExit={true}
        nodeRef={aiDrawerTransitionRef}
      >
        {state => (
          <div
            className={clsx(!!aiDrawer?.trigger?.customIcon && styles['universal-toolbar-ai-custom'], [
              sharedStyles['with-motion-horizontal'],
            ])}
            style={{
              opacity: ['entering', 'exiting'].includes(state) ? 0 : 1,
            }}
          >
            <TriggerButton
              ariaLabel={aiDrawer?.ariaLabels?.triggerButton}
              ariaExpanded={!!activeAiDrawerId}
              iconName={aiDrawer?.trigger!.iconName}
              iconSvg={aiDrawer?.trigger!.iconSvg}
              customSvg={aiDrawer?.trigger!.customIcon}
              className={testutilStyles['ai-drawer-toggle']}
              onClick={() => {
                if (setExpandedDrawerId) {
                  setExpandedDrawerId(null);
                }
                onActiveAiDrawerChange?.(aiDrawer?.id ?? null, { initiatedByUserAction: true });
              }}
              ref={aiDrawerFocusRef}
              selected={!drawerExpandedMode && !!activeAiDrawerId}
              disabled={anyPanelOpenInMobile}
              variant={aiDrawer?.trigger?.customIcon ? 'custom' : 'circle'}
              hasTooltip={true}
              testId={`awsui-app-layout-trigger-${aiDrawer?.id}`}
              isForPreviousActiveDrawer={true}
            />
          </div>
        )}
      </Transition>
      <div className={clsx(styles['toolbar-container'], !!aiDrawer?.trigger && styles['with-ai-drawer'])}>
        {hasNavigation && (
          <nav {...navLandmarkAttributes} className={clsx(styles['universal-toolbar-nav'])}>
            <TriggerButton
              ariaLabel={ariaLabels?.navigationToggle ?? undefined}
              ariaExpanded={!drawerExpandedMode && navigationOpen}
              iconName="menu"
              className={testutilStyles['navigation-toggle']}
              onClick={() => {
                if (setExpandedDrawerId) {
                  setExpandedDrawerId(null);
                }
                if (navigationOpen && expandedDrawerId) {
                  return;
                }
                onNavigationToggle?.(!navigationOpen);
              }}
              ref={navigationFocusRef}
              selected={!drawerExpandedMode && navigationOpen}
              disabled={anyPanelOpenInMobile}
            />
          </nav>
        )}
        {(breadcrumbs || discoveredBreadcrumbs) && (
          <div className={clsx(styles['universal-toolbar-breadcrumbs'], testutilStyles.breadcrumbs)}>
            <BreadcrumbsSlot
              ownBreadcrumbs={appLayoutInternals.breadcrumbs}
              discoveredBreadcrumbs={appLayoutInternals.discoveredBreadcrumbs}
            />
          </div>
        )}
        {(drawers?.length || globalDrawers?.length || (hasSplitPanel && splitPanelToggleProps?.displayed)) && (
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
              expandedDrawerId={expandedDrawerId}
              setExpandedDrawerId={setExpandedDrawerId!}
            />
          </div>
        )}
      </div>
    </ToolbarSlot>
  );
}

export const createWidgetizedAppLayoutToolbar = createWidgetizedComponent(
  AppLayoutToolbarImplementation,
  ToolbarSkeleton
);
