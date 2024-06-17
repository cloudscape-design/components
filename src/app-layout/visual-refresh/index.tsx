// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useState } from 'react';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useControllable } from '../../internal/hooks/use-controllable';
import { fireNonCancelableEvent } from '../../internal/events';
import { useFocusControl } from '../utils/use-focus-control';
import { useMobile } from '../../internal/hooks/use-mobile';
import { useSplitPanelFocusControl } from '../utils/use-split-panel-focus-control';
import { useDrawers } from '../utils/use-drawers';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from '../interfaces';
import { computeHorizontalLayout, computeVerticalLayout } from './compute-layout';
import { SplitPanelProvider } from '../split-panel';
import { SplitPanelSideToggleProps } from '../../internal/context/split-panel-context';
import { getSplitPanelDefaultSize } from '../../split-panel/utils/size-utils';
import globalVars from '../../internal/styles/global-vars';
import { Drawer } from './drawer';
import { Navigation } from './navigation';
import { Notifications } from './notifications';
import { SkeletonLayout } from '../skeleton/layout';
import { SideSplitPanelDrawer } from './split-panel-side';
import { Toolbar } from './toolbar';
import { AppLayoutInternalsContext } from './context';

const AppLayoutRefresh = React.forwardRef(
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
    }: AppLayoutPropsWithDefaults,
    forwardRef: React.Ref<AppLayoutProps.Ref>
  ) => {
    const isMobile = useMobile();
    const embeddedViewMode = (rest as any).__embeddedViewMode;
    const splitPanelControlId = useUniqueId('split-panel');
    const [toolbarState, setToolbarState] = useState<'show' | 'hide'>('show');

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

    const [notificationsHeight, notificationsRef] = useContainerQuery(rect => rect.borderBoxHeight);
    const [toolbarHeight, toolbarRef] = useContainerQuery(rect => rect.borderBoxHeight);

    const resolvedNavigation = navigationHide ? null : navigation;
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

    const hasToolbar =
      !embeddedViewMode &&
      (!!resolvedNavigation || !!breadcrumbs || splitPanelToggleConfig.displayed || drawers.length > 0);

    const verticalOffsets = computeVerticalLayout({
      topOffset: placement.insetBlockStart,
      hasToolbar: hasToolbar && toolbarState !== 'hide',
      notificationsHeight: notificationsHeight ?? 0,
      toolbarHeight: toolbarHeight ?? 0,
      stickyNotifications: !!stickyNotifications,
    });

    return (
      <AppLayoutInternalsContext.Provider
        value={{
          ariaLabels: ariaLabelsWithDrawers,
          headerVariant,
          isMobile,
          breadcrumbs,
          stickyNotifications,
          navigationOpen,
          navigation: resolvedNavigation,
          navigationFocusControl,
          activeDrawer,
          activeDrawerSize,
          minDrawerSize,
          maxDrawerSize,
          drawers,
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
          notificationsRef,
          toolbarRef,
          onSplitPanelToggle: onSplitPanelToggleHandler,
          onNavigationToggle,
          onActiveDrawerChange,
          onActiveDrawerResize,
        }}
      >
        <SplitPanelProvider
          bottomOffset={0}
          getMaxHeight={() => {
            const availableHeight =
              document.documentElement.clientHeight - placement.insetBlockStart - placement.insetBlockEnd;
            // If the page is likely zoomed in at 200%, allow the split panel to fill the content area.
            return availableHeight < 400 ? availableHeight - 40 : availableHeight - 250;
          }}
          maxWidth={maxSplitPanelSize}
          isForcedPosition={splitPanelForcedPosition}
          isOpen={splitPanelOpen}
          leftOffset={0}
          onPreferencesChange={onSplitPanelPreferencesChangeHandler}
          onResize={onSplitPanelResizeHandler}
          onToggle={onSplitPanelToggleHandler}
          position={splitPanelPosition}
          reportSize={size => setSplitPanelReportedSize(size)}
          reportHeaderHeight={() => {
            /*unused in this design*/
          }}
          rightOffset={0}
          size={splitPanelSize}
          topOffset={0}
          setSplitPanelToggle={setSplitPanelToggleConfig}
          refs={splitPanelFocusControl.refs}
        >
          <SkeletonLayout
            style={{
              [globalVars.stickyVerticalTopOffset]: `${verticalOffsets.header}px`,
              [globalVars.stickyVerticalBottomOffset]: `${placement.insetBlockEnd}px`,
              paddingBlockEnd: splitPanelOpen ? splitPanelReportedSize : '',
            }}
            toolbar={hasToolbar && <Toolbar />}
            notifications={notifications && <Notifications>{notifications}</Notifications>}
            contentHeader={contentHeader}
            content={content}
            navigation={navigation && <Navigation />}
            navigationOpen={navigationOpen}
            navigationWidth={navigationWidth}
            tools={activeDrawer && <Drawer />}
            toolsOpen={!!activeDrawer}
            toolsWidth={activeDrawerSize}
            sideSplitPanel={
              splitPanelPosition === 'side' && splitPanel && <SideSplitPanelDrawer>{splitPanel}</SideSplitPanelDrawer>
            }
            bottomSplitPanel={splitPanelPosition === 'bottom' && splitPanel}
            splitPanelOpen={splitPanelOpen}
            placement={placement}
            contentType={contentType}
            maxContentWidth={maxContentWidth}
            disableContentPaddings={disableContentPaddings}
          />
        </SplitPanelProvider>
      </AppLayoutInternalsContext.Provider>
    );
  }
);

export default AppLayoutRefresh;
