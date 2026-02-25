// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

import { useResizeObserver } from '@cloudscape-design/component-toolkit/internal';

import { AppLayoutBuiltInErrorBoundary } from '../../../error-boundary/internal';
import { createWidgetizedComponent } from '../../../internal/widgets';
import { AppLayoutProps } from '../../interfaces';
import { OnChangeParams } from '../../utils/use-drawers';
import { Focusable, FocusControlMultipleStates } from '../../utils/use-focus-control';
import { AppLayoutInternals } from '../interfaces';
import { ToolbarSkeleton } from '../skeleton/skeleton-parts';
import { ToolbarSlot } from '../skeleton/slots';
import { ToolbarBreadcrumbsSection, ToolbarContainer } from '../skeleton/toolbar-container';
import { FeatureNotificationsProps } from '../state/use-feature-notifications';
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
  bottomDrawersFocusRef?: React.Ref<Focusable>;
  globalDrawersFocusControl?: FocusControlMultipleStates;
  onActiveDrawerChange?: (drawerId: string | null, params: OnChangeParams) => void;
  globalDrawers?: ReadonlyArray<AppLayoutProps.Drawer> | undefined;
  activeGlobalDrawersIds?: ReadonlyArray<string>;
  onActiveGlobalDrawersChange?: ((drawerId: string, params: OnChangeParams) => void) | undefined;
  bottomDrawers?: ReadonlyArray<AppLayoutProps.Drawer> | undefined;
  activeGlobalBottomDrawerId?: string | null;
  onActiveGlobalBottomDrawerChange?: (value: string | null, params: OnChangeParams) => void;

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
  featureNotificationsProps?: FeatureNotificationsProps;
}

export function AppLayoutToolbarImplementation({
  appLayoutInternals,
  // the value could be undefined if this component is loaded as a widget by a different app layout version
  // not testable in a single-version setup
  toolbarProps = {},
  featureNotificationsProps,
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
    onActiveGlobalBottomDrawerChange,
    activeGlobalBottomDrawerId,
    bottomDrawersFocusRef,
    bottomDrawers,
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
      !!activeGlobalBottomDrawerId ||
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
      className={clsx((aiDrawer?.trigger || !!activeAiDrawerId) && styles['with-ai-drawer'], {
        [testutilStyles['mobile-bar']]: isMobile,
      })}
      style={{
        insetBlockStart: verticalOffsets.toolbar,
      }}
    >
      <AppLayoutBuiltInErrorBoundary>
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
                testId={`awsui-app-layout-trigger-${aiDrawer?.id}`}
                isForPreviousActiveDrawer={true}
              />
            </div>
          )}
        </Transition>
      </AppLayoutBuiltInErrorBoundary>
      <ToolbarContainer hasAiDrawer={!!aiDrawer?.trigger}>
        {hasNavigation && (
          <nav {...navLandmarkAttributes} className={clsx(styles['universal-toolbar-nav'])}>
            <AppLayoutBuiltInErrorBoundary>
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
            </AppLayoutBuiltInErrorBoundary>
          </nav>
        )}
        {(breadcrumbs || discoveredBreadcrumbs) && (
          <ToolbarBreadcrumbsSection
            ownBreadcrumbs={appLayoutInternals.breadcrumbs}
            discoveredBreadcrumbs={appLayoutInternals.discoveredBreadcrumbs}
            includeTestUtils={true}
          />
        )}
        {(drawers?.length ||
          globalDrawers?.length ||
          bottomDrawers?.length ||
          (hasSplitPanel && splitPanelToggleProps?.displayed)) && (
          <div className={clsx(styles['universal-toolbar-drawers'])}>
            <AppLayoutBuiltInErrorBoundary>
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
                bottomDrawersFocusRef={bottomDrawersFocusRef}
                globalDrawers={globalDrawers?.filter(item => !!item.trigger) ?? []}
                activeGlobalDrawersIds={activeGlobalDrawersIds ?? []}
                onActiveGlobalDrawersChange={onActiveGlobalDrawersChange}
                expandedDrawerId={expandedDrawerId}
                setExpandedDrawerId={setExpandedDrawerId!}
                bottomDrawers={bottomDrawers}
                onActiveGlobalBottomDrawerChange={onActiveGlobalBottomDrawerChange}
                activeGlobalBottomDrawerId={activeGlobalBottomDrawerId}
              featureNotificationsProps={featureNotificationsProps}/>
            </AppLayoutBuiltInErrorBoundary>
          </div>
        )}
      </ToolbarContainer>
    </ToolbarSlot>
  );
}

export const AppLayoutToolbar = createWidgetizedComponent(AppLayoutToolbarImplementation, ToolbarSkeleton);
