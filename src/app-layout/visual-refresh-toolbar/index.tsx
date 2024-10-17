// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';

import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { SplitPanelSideToggleProps } from '../../internal/context/split-panel-context';
import { fireNonCancelableEvent } from '../../internal/events';
import { useControllable } from '../../internal/hooks/use-controllable';
import { useMobile } from '../../internal/hooks/use-mobile';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { useGetGlobalBreadcrumbs } from '../../internal/plugins/helpers/use-global-breadcrumbs';
import globalVars from '../../internal/styles/global-vars';
import { getSplitPanelDefaultSize } from '../../split-panel/utils/size-utils';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces';
import { SplitPanelProviderProps } from '../split-panel';
import { MIN_DRAWER_SIZE, useDrawers } from '../utils/use-drawers';
import { useFocusControl, useMultipleFocusControl } from '../utils/use-focus-control';
import { useSplitPanelFocusControl } from '../utils/use-split-panel-focus-control';
import { ActiveDrawersContext } from '../utils/visibility-context';
import { computeHorizontalLayout, computeVerticalLayout } from './compute-layout';
import { AppLayoutInternals } from './interfaces';
import {
  AppLayoutDrawer,
  AppLayoutGlobalDrawers,
  AppLayoutNavigation,
  AppLayoutNotifications,
  AppLayoutSplitPanelBottom,
  AppLayoutSplitPanelSide,
  AppLayoutToolbar,
} from './internal';
import { useMultiAppLayout } from './multi-layout';
import { SkeletonLayout } from './skeleton';

const AppLayoutVisualRefreshToolbar = React.forwardRef<AppLayoutProps.Ref, AppLayoutPropsWithDefaults>(
  (
    {
      ariaLabels,
      contentHeader,
      content,
      navigationOpen,
      navigationWidth,
      navigation,
      navigationHide,
      onNavigationChange,
      tools,
      toolsOpen: controlledToolsOpen,
      onToolsChange,
      toolsHide,
      toolsWidth,
      contentType,
      headerVariant,
      breadcrumbs,
      notifications,
      stickyNotifications,
      splitPanelPreferences: controlledSplitPanelPreferences,
      splitPanelOpen: controlledSplitPanelOpen,
      splitPanel,
      splitPanelSize: controlledSplitPanelSize,
      onSplitPanelToggle,
      onSplitPanelResize,
      onSplitPanelPreferencesChange,
      disableContentPaddings,
      minContentWidth,
      maxContentWidth,
      placement,
      ...rest
    },
    forwardRef
  ) => {
    const isMobile = useMobile();
    const { __embeddedViewMode: embeddedViewMode, __forceDeduplicationType: forceDeduplicationType } = rest as any;
    const splitPanelControlId = useUniqueId('split-panel');
    const [toolbarState, setToolbarState] = useState<'show' | 'hide'>('show');
    const [toolbarHeight, setToolbarHeight] = useState(0);
    const [notificationsHeight, setNotificationsHeight] = useState(0);

    const [toolsOpen = false, setToolsOpen] = useControllable(controlledToolsOpen, onToolsChange, false, {
      componentName: 'AppLayout',
      controlledProp: 'toolsOpen',
      changeHandler: 'onToolsChange',
    });
    const onToolsToggle = (open: boolean) => {
      setToolsOpen(open);
      drawersFocusControl.setFocus();
      fireNonCancelableEvent(onToolsChange, { open });
    };

    const onGlobalDrawerFocus = (drawerId: string, open: boolean) => {
      globalDrawersFocusControl.setFocus({ force: true, drawerId, open });
    };

    const onAddNewActiveDrawer = (drawerId: string) => {
      // If a local drawer is already open, and we attempt to open a new one,
      // it will replace the existing one instead of opening an additional drawer,
      // since only one local drawer is supported. Therefore, layout calculations are not necessary.
      if (activeDrawer && drawers?.find(drawer => drawer.id === drawerId)) {
        return;
      }
      // get the size of drawerId. it could be either local or global drawer
      const combinedDrawers = [...(drawers || []), ...globalDrawers];
      const newDrawer = combinedDrawers.find(drawer => drawer.id === drawerId);
      if (!newDrawer) {
        return;
      }
      const newDrawerSize = Math.min(
        newDrawer.defaultSize ?? drawerSizes[drawerId] ?? MIN_DRAWER_SIZE,
        MIN_DRAWER_SIZE
      );
      //   check if the active drawers could be resized to fit the new drawers
      //   to do this, we need to take all active drawers, sum up their min sizes, truncate it from resizableSpaceAvailable
      //   and compare a given number with the new drawer id min size

      // the total size of all global drawers resized to their min size
      const totalActiveDrawersMinSize = getActiveDrawersTotalMinSize();

      const availableSpaceForNewDrawer = resizableSpaceAvailable - totalActiveDrawersMinSize;
      if (availableSpaceForNewDrawer >= newDrawerSize) {
        return;
      }

      // now we made sure we cannot accommodate the new drawer with existing ones
      closeFirstDrawer();
    };

    const {
      drawers,
      activeDrawer,
      minDrawerSize,
      minGlobalDrawersSizes,
      activeDrawerSize,
      ariaLabelsWithDrawers,
      globalDrawers,
      activeGlobalDrawers,
      activeGlobalDrawersIds,
      activeGlobalDrawersSizes,
      drawerSizes,
      drawersOpenQueue,
      onActiveDrawerChange,
      onActiveDrawerResize,
      onActiveGlobalDrawersChange,
    } = useDrawers({ ...rest, onGlobalDrawerFocus, onAddNewActiveDrawer }, ariaLabels, {
      ariaLabels,
      toolsHide,
      toolsOpen,
      tools,
      toolsWidth,
      onToolsToggle,
    });

    const getActiveDrawersTotalMinSize = useCallback(() => {
      const combinedDrawers = [...(drawers || []), ...globalDrawers];
      let totalActiveDrawersMinSize = activeGlobalDrawersIds
        .map(activeDrawerId =>
          Math.min(
            combinedDrawers.find(drawer => drawer.id === activeDrawerId)?.defaultSize ?? MIN_DRAWER_SIZE,
            MIN_DRAWER_SIZE
          )
        )
        .reduce((acc, curr) => acc + curr, 0);
      if (activeDrawer) {
        totalActiveDrawersMinSize += Math.min(activeDrawer?.defaultSize ?? MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);
      }

      return totalActiveDrawersMinSize;
    }, [activeDrawer, activeGlobalDrawersIds, drawers, globalDrawers]);

    const onActiveDrawerChangeHandler = (drawerId: string | null) => {
      onActiveDrawerChange(drawerId);
      drawersFocusControl.setFocus();
    };

    const [splitPanelOpen = false, setSplitPanelOpen] = useControllable(
      controlledSplitPanelOpen,
      onSplitPanelToggle,
      false,
      {
        componentName: 'AppLayout',
        controlledProp: 'splitPanelOpen',
        changeHandler: 'onSplitPanelToggle',
      }
    );

    const onSplitPanelToggleHandler = () => {
      setSplitPanelOpen(!splitPanelOpen);
      splitPanelFocusControl.setLastInteraction({ type: splitPanelOpen ? 'close' : 'open' });
      fireNonCancelableEvent(onSplitPanelToggle, { open: !splitPanelOpen });
    };

    const [splitPanelPreferences, setSplitPanelPreferences] = useControllable(
      controlledSplitPanelPreferences,
      onSplitPanelPreferencesChange,
      undefined,
      {
        componentName: 'AppLayout',
        controlledProp: 'splitPanelPreferences',
        changeHandler: 'onSplitPanelPreferencesChange',
      }
    );

    const onSplitPanelPreferencesChangeHandler = (detail: AppLayoutProps.SplitPanelPreferences) => {
      setSplitPanelPreferences(detail);
      splitPanelFocusControl.setLastInteraction({ type: 'position' });
      fireNonCancelableEvent(onSplitPanelPreferencesChange, detail);
    };

    const [splitPanelSize = 0, setSplitPanelSize] = useControllable(
      controlledSplitPanelSize,
      onSplitPanelResize,
      getSplitPanelDefaultSize(splitPanelPreferences?.position ?? 'bottom'),
      { componentName: 'AppLayout', controlledProp: 'splitPanelSize', changeHandler: 'onSplitPanelResize' }
    );

    const [splitPanelReportedSize, setSplitPanelReportedSize] = useState(0);

    const onSplitPanelResizeHandler = (size: number) => {
      setSplitPanelSize(size);
      fireNonCancelableEvent(onSplitPanelResize, { size });
    };

    const [splitPanelToggleConfig, setSplitPanelToggleConfig] = useState<SplitPanelSideToggleProps>({
      ariaLabel: undefined,
      displayed: false,
    });

    const globalDrawersFocusControl = useMultipleFocusControl(true, activeGlobalDrawersIds);
    const drawersFocusControl = useFocusControl(!!activeDrawer?.id, true, activeDrawer?.id);
    const navigationFocusControl = useFocusControl(navigationOpen);
    const splitPanelFocusControl = useSplitPanelFocusControl([splitPanelPreferences, splitPanelOpen]);

    const onNavigationToggle = useCallback(
      (open: boolean) => {
        navigationFocusControl.setFocus();
        fireNonCancelableEvent(onNavigationChange, { open });
      },
      [navigationFocusControl, onNavigationChange]
    );

    useImperativeHandle(forwardRef, () => ({
      closeNavigationIfNecessary: () => isMobile && onNavigationToggle(false),
      openTools: () => onToolsToggle(true),
      focusToolsClose: () => drawersFocusControl.setFocus(true),
      focusActiveDrawer: () => drawersFocusControl.setFocus(true),
      focusSplitPanel: () => splitPanelFocusControl.refs.slider.current?.focus(),
    }));

    const resolvedNavigation = navigationHide ? null : navigation ?? <></>;
    const resolvedStickyNotifications = !!stickyNotifications && !isMobile;
    const {
      maxDrawerSize,
      maxSplitPanelSize,
      splitPanelForcedPosition,
      splitPanelPosition,
      maxGlobalDrawersSizes,
      resizableSpaceAvailable,
    } = computeHorizontalLayout({
      activeDrawerSize: activeDrawer ? activeDrawerSize : 0,
      splitPanelSize,
      minContentWidth,
      navigationOpen: !!resolvedNavigation && navigationOpen,
      navigationWidth,
      placement,
      splitPanelOpen,
      splitPanelPosition: splitPanelPreferences?.position,
      isMobile,
      activeGlobalDrawersSizes,
    });

    const { registered, toolbarProps } = useMultiAppLayout({
      forceDeduplicationType,
      ariaLabels: ariaLabelsWithDrawers,
      navigation: resolvedNavigation,
      navigationOpen,
      onNavigationToggle,
      navigationFocusRef: navigationFocusControl.refs.toggle,
      breadcrumbs,
      activeDrawerId: activeDrawer?.id ?? null,
      // only pass it down if there are non-empty drawers or tools
      drawers: drawers?.length || !toolsHide ? drawers : undefined,
      onActiveDrawerChange: onActiveDrawerChangeHandler,
      drawersFocusRef: drawersFocusControl.refs.toggle,
      splitPanel,
      splitPanelToggleProps: {
        ...splitPanelToggleConfig,
        active: splitPanelOpen,
        controlId: splitPanelControlId,
        position: splitPanelPosition,
      },
      splitPanelFocusRef: splitPanelFocusControl.refs.toggle,
      onSplitPanelToggle: onSplitPanelToggleHandler,
    });

    const hasToolbar = !embeddedViewMode && !!toolbarProps;
    const discoveredBreadcrumbs = useGetGlobalBreadcrumbs(hasToolbar);

    const verticalOffsets = computeVerticalLayout({
      topOffset: placement.insetBlockStart,
      hasVisibleToolbar: hasToolbar && toolbarState !== 'hide',
      notificationsHeight: notificationsHeight ?? 0,
      toolbarHeight: toolbarHeight ?? 0,
      stickyNotifications: resolvedStickyNotifications,
    });

    const appLayoutInternals: AppLayoutInternals = {
      ariaLabels: ariaLabelsWithDrawers,
      headerVariant,
      isMobile,
      breadcrumbs,
      discoveredBreadcrumbs,
      stickyNotifications: resolvedStickyNotifications,
      navigationOpen,
      navigation: resolvedNavigation,
      navigationFocusControl,
      activeDrawer,
      activeDrawerSize,
      minDrawerSize,
      maxDrawerSize,
      minGlobalDrawersSizes,
      maxGlobalDrawersSizes,
      drawers: drawers!,
      globalDrawers,
      activeGlobalDrawers,
      activeGlobalDrawersIds,
      activeGlobalDrawersSizes,
      onActiveGlobalDrawersChange,
      drawersFocusControl,
      globalDrawersFocusControl,
      splitPanelPosition,
      splitPanelToggleConfig,
      splitPanelOpen,
      splitPanelControlId,
      splitPanelFocusControl,
      placement,
      toolbarState,
      setToolbarState,
      verticalOffsets,
      drawersOpenQueue,
      setToolbarHeight,
      setNotificationsHeight,
      onSplitPanelToggle: onSplitPanelToggleHandler,
      onNavigationToggle,
      onActiveDrawerChange: onActiveDrawerChangeHandler,
      onActiveDrawerResize,
    };

    const splitPanelInternals: SplitPanelProviderProps = {
      bottomOffset: 0,
      getMaxHeight: () => {
        const availableHeight =
          document.documentElement.clientHeight - placement.insetBlockStart - placement.insetBlockEnd;
        // If the page is likely zoomed in at 200%, allow the split panel to fill the content area.
        return availableHeight < 400 ? availableHeight - 40 : availableHeight - 250;
      },
      maxWidth: maxSplitPanelSize,
      isForcedPosition: splitPanelForcedPosition,
      isOpen: splitPanelOpen,
      leftOffset: 0,
      onPreferencesChange: onSplitPanelPreferencesChangeHandler,
      onResize: onSplitPanelResizeHandler,
      onToggle: onSplitPanelToggleHandler,
      position: splitPanelPosition,
      reportSize: size => setSplitPanelReportedSize(size),
      reportHeaderHeight: () => {
        /*unused in this design*/
      },
      rightOffset: 0,
      size: splitPanelSize,
      topOffset: 0,
      setSplitPanelToggle: setSplitPanelToggleConfig,
      refs: splitPanelFocusControl.refs,
    };

    const closeFirstDrawer = useCallback(() => {
      const drawerToClose = drawersOpenQueue[drawersOpenQueue.length - 1];
      if (activeDrawer && activeDrawer?.id === drawerToClose) {
        onActiveDrawerChange(null);
      } else if (activeGlobalDrawersIds.includes(drawerToClose)) {
        onActiveGlobalDrawersChange(drawerToClose);
      }
    }, [activeDrawer, activeGlobalDrawersIds, drawersOpenQueue, onActiveDrawerChange, onActiveGlobalDrawersChange]);

    useEffect(() => {
      // Close navigation drawer on mobile so that the main content is visible
      if (isMobile) {
        onNavigationToggle(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);

    useEffect(() => {
      if (isMobile) {
        return;
      }

      const totalActiveDrawersMinSize = getActiveDrawersTotalMinSize();
      const activeNavigationWidth = navigationOpen ? navigationWidth : 0;
      // collapsed content width is $space-layout-content-horizontal * 2 = 48px
      const minContentVisibleWidth = 48;

      const scrollWidth = activeNavigationWidth + minContentVisibleWidth + totalActiveDrawersMinSize;
      const hasHorizontalScroll = scrollWidth > placement.inlineSize;
      if (hasHorizontalScroll) {
        if (navigationOpen) {
          onNavigationToggle(false);
          return;
        }

        closeFirstDrawer();
      }
    }, [
      closeFirstDrawer,
      getActiveDrawersTotalMinSize,
      isMobile,
      navigationOpen,
      navigationWidth,
      onNavigationToggle,
      placement.inlineSize,
    ]);

    return (
      <>
        {/* Rendering a hidden copy of breadcrumbs to trigger their deduplication */}
        {!hasToolbar && breadcrumbs ? <ScreenreaderOnly>{breadcrumbs}</ScreenreaderOnly> : null}
        <SkeletonLayout
          style={{
            [globalVars.stickyVerticalTopOffset]: `${verticalOffsets.header}px`,
            [globalVars.stickyVerticalBottomOffset]: `${placement.insetBlockEnd}px`,
            paddingBlockEnd: splitPanelOpen && splitPanelPosition === 'bottom' ? splitPanelReportedSize : '',
            ...(!isMobile ? { minWidth: `${minContentWidth}px` } : {}),
          }}
          toolbar={
            hasToolbar && <AppLayoutToolbar appLayoutInternals={appLayoutInternals} toolbarProps={toolbarProps} />
          }
          notifications={
            notifications && (
              <AppLayoutNotifications appLayoutInternals={appLayoutInternals}>{notifications}</AppLayoutNotifications>
            )
          }
          headerVariant={headerVariant}
          contentHeader={contentHeader}
          // delay rendering the content until registration of this instance is complete
          content={registered ? content : null}
          navigation={resolvedNavigation && <AppLayoutNavigation appLayoutInternals={appLayoutInternals} />}
          navigationOpen={navigationOpen}
          navigationWidth={navigationWidth}
          tools={drawers && drawers.length > 0 && <AppLayoutDrawer appLayoutInternals={appLayoutInternals} />}
          globalTools={
            <ActiveDrawersContext.Provider value={activeGlobalDrawersIds}>
              <AppLayoutGlobalDrawers appLayoutInternals={appLayoutInternals} />
            </ActiveDrawersContext.Provider>
          }
          globalToolsOpen={!!activeGlobalDrawersIds.length}
          toolsOpen={!!activeDrawer}
          toolsWidth={activeDrawerSize}
          sideSplitPanel={
            splitPanelPosition === 'side' && (
              <AppLayoutSplitPanelSide
                appLayoutInternals={appLayoutInternals}
                splitPanelInternals={splitPanelInternals}
              >
                {splitPanel}
              </AppLayoutSplitPanelSide>
            )
          }
          bottomSplitPanel={
            splitPanelPosition === 'bottom' && (
              <AppLayoutSplitPanelBottom
                appLayoutInternals={appLayoutInternals}
                splitPanelInternals={splitPanelInternals}
              >
                {splitPanel}
              </AppLayoutSplitPanelBottom>
            )
          }
          splitPanelOpen={splitPanelOpen}
          placement={placement}
          contentType={contentType}
          maxContentWidth={maxContentWidth}
          disableContentPaddings={disableContentPaddings}
        />
      </>
    );
  }
);

export default AppLayoutVisualRefreshToolbar;
