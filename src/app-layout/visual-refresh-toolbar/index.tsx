// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useState } from 'react';

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
import { useDrawers } from '../utils/use-drawers';
import { useFocusControl } from '../utils/use-focus-control';
import { useSplitPanelFocusControl } from '../utils/use-split-panel-focus-control';
import { computeHorizontalLayout, computeVerticalLayout } from './compute-layout';
import { AppLayoutInternals } from './interfaces';
import {
  AppLayoutDrawer,
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

    const onNavigationToggle = (open: boolean) => {
      fireNonCancelableEvent(onNavigationChange, { open });
    };

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

    const {
      drawers,
      activeDrawer,
      minDrawerSize,
      activeDrawerSize,
      ariaLabelsWithDrawers,
      onActiveDrawerChange,
      onActiveDrawerResize,
    } = useDrawers(rest, ariaLabels, {
      ariaLabels,
      toolsHide,
      toolsOpen,
      tools,
      toolsWidth,
      onToolsToggle,
    });

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

    const drawersFocusControl = useFocusControl(!!activeDrawer?.id);
    const navigationFocusControl = useFocusControl(navigationOpen);
    const splitPanelFocusControl = useSplitPanelFocusControl([splitPanelPreferences, splitPanelOpen]);

    useImperativeHandle(forwardRef, () => ({
      closeNavigationIfNecessary: () => isMobile && onNavigationToggle(false),
      openTools: () => onToolsToggle(true),
      focusToolsClose: () => drawersFocusControl.setFocus(true),
      focusActiveDrawer: () => drawersFocusControl.setFocus(true),
      focusSplitPanel: () => splitPanelFocusControl.refs.slider.current?.focus(),
    }));

    const resolvedNavigation = navigationHide ? null : navigation ?? <></>;
    const { maxDrawerSize, maxSplitPanelSize, splitPanelForcedPosition, splitPanelPosition } = computeHorizontalLayout({
      activeDrawerSize,
      splitPanelSize,
      minContentWidth,
      navigationOpen: !!resolvedNavigation && navigationOpen,
      navigationWidth,
      placement,
      splitPanelOpen,
      splitPanelPosition: splitPanelPreferences?.position,
    });

    const { registered, toolbarProps } = useMultiAppLayout({
      forceDeduplicationType,
      ariaLabels: ariaLabelsWithDrawers,
      navigation,
      navigationOpen,
      onNavigationToggle,
      navigationFocusRef: navigationFocusControl.refs.toggle,
      breadcrumbs,
      activeDrawerId: activeDrawer?.id ?? null,
      // only pass it down if there are non-empty drawers or tools
      drawers: drawers?.length || !toolsHide ? drawers : undefined,
      onActiveDrawerChange,
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
      stickyNotifications: !!stickyNotifications,
    });

    const appLayoutInternals: AppLayoutInternals = {
      ariaLabels: ariaLabelsWithDrawers,
      headerVariant,
      isMobile,
      breadcrumbs,
      discoveredBreadcrumbs,
      stickyNotifications,
      navigationOpen,
      navigation: resolvedNavigation,
      navigationFocusControl,
      activeDrawer,
      activeDrawerSize,
      minDrawerSize,
      maxDrawerSize,
      drawers: drawers!,
      drawersFocusControl,
      splitPanelPosition,
      splitPanelToggleConfig,
      splitPanelOpen,
      splitPanelControlId,
      splitPanelFocusControl,
      placement,
      toolbarState,
      setToolbarState,
      verticalOffsets,
      setToolbarHeight,
      setNotificationsHeight,
      onSplitPanelToggle: onSplitPanelToggleHandler,
      onNavigationToggle,
      onActiveDrawerChange,
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

    return (
      <>
        {/* Rendering a hidden copy of breadcrumbs to trigger their deduplication */}
        {!hasToolbar && breadcrumbs ? <ScreenreaderOnly>{breadcrumbs}</ScreenreaderOnly> : null}
        <SkeletonLayout
          style={{
            [globalVars.stickyVerticalTopOffset]: `${verticalOffsets.header}px`,
            [globalVars.stickyVerticalBottomOffset]: `${placement.insetBlockEnd}px`,
            paddingBlockEnd: splitPanelOpen ? splitPanelReportedSize : '',
          }}
          toolbar={
            hasToolbar && <AppLayoutToolbar appLayoutInternals={appLayoutInternals} toolbarProps={toolbarProps} />
          }
          notifications={
            notifications && (
              <AppLayoutNotifications appLayoutInternals={appLayoutInternals}>{notifications}</AppLayoutNotifications>
            )
          }
          contentHeader={contentHeader}
          // delay rendering the content until registration of this instance is complete
          content={registered ? content : null}
          navigation={resolvedNavigation && <AppLayoutNavigation appLayoutInternals={appLayoutInternals} />}
          navigationOpen={navigationOpen}
          navigationWidth={navigationWidth}
          tools={activeDrawer && <AppLayoutDrawer appLayoutInternals={appLayoutInternals} />}
          toolsOpen={!!activeDrawer}
          toolsWidth={activeDrawerSize}
          sideSplitPanel={
            splitPanelPosition === 'side' &&
            splitPanel && (
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
