// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { getBaseProps } from '../internal/base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { useMobile } from '../internal/hooks/use-mobile';
import { fireNonCancelableEvent } from '../internal/events';
import { applyDefaults } from './defaults';
import { AppLayoutProps } from './interfaces';
import { Notifications } from './notifications';
import { MobileToolbar } from './mobile-toolbar';
import { useFocusControl } from './utils/use-focus-control';
import useWindowWidth from './utils/use-window-width';
import useContentHeight from './utils/use-content-height';
import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';
import { findUpUntil } from '../internal/utils/dom';
import { AppLayoutContext } from '../internal/context/app-layout-context';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { useStableEventHandler } from '../internal/hooks/use-stable-event-handler';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import {
  SplitPanelContextProvider,
  SplitPanelContextProps,
  SplitPanelSideToggleProps,
} from '../internal/context/split-panel-context';
import {
  CONSTRAINED_MAIN_PANEL_MIN_HEIGHT,
  CONSTRAINED_PAGE_HEIGHT,
  getSplitPanelDefaultSize,
  MAIN_PANEL_MIN_HEIGHT,
} from '../split-panel/utils/size-utils';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import ContentWrapper, { ContentWrapperProps } from './content-wrapper';
import { Drawer, DrawerTriggersBar } from './drawer';
import { ResizableDrawer } from './drawer/resizable-drawer';
import { DrawerItem, InternalDrawerProps } from './drawer/interfaces';
import { togglesConfig } from './toggles';
import { SideSplitPanelDrawer } from './split-panel-drawer';
import useAppLayoutOffsets from './utils/use-content-width';
import { isDevelopment } from '../internal/is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import RefreshedAppLayout from './visual-refresh';
import { useInternalI18n } from '../internal/i18n/context';
import { useSplitPanelFocusControl } from './utils/use-split-panel-focus-control';
import { useDrawerFocusControl } from './utils/use-drawer-focus-control';
import { awsuiPluginsInternal } from '../internal/plugins/api';
import { DrawersLayout, convertRuntimeDrawers } from './runtime-api';

export { AppLayoutProps };

const AppLayout = React.forwardRef(
  (
    { contentType = 'default', headerSelector = '#b #h', footerSelector = '#b #f', ...rest }: AppLayoutProps,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent<HTMLDivElement>('AppLayout');
    const [runtimeDrawers, setRuntimeDrawers] = useState<DrawersLayout>({ before: [], after: [] });
    const isRefresh = useVisualRefresh();

    const i18n = useInternalI18n('app-layout');
    const ariaLabels = {
      navigation: i18n('ariaLabels.navigation', rest.ariaLabels?.navigation),
      navigationClose: i18n('ariaLabels.navigationClose', rest.ariaLabels?.navigationClose),
      navigationToggle: i18n('ariaLabels.navigationToggle', rest.ariaLabels?.navigationToggle),
      notifications: i18n('ariaLabels.notifications', rest.ariaLabels?.notifications),
      tools: i18n('ariaLabels.tools', rest.ariaLabels?.tools),
      toolsClose: i18n('ariaLabels.toolsClose', rest.ariaLabels?.toolsClose),
      toolsToggle: i18n('ariaLabels.toolsToggle', rest.ariaLabels?.toolsToggle),
    };

    // This re-builds the props including the default values
    const props = { contentType, headerSelector, footerSelector, ...rest, ariaLabels };

    const baseProps = getBaseProps(rest);
    const ownDrawers = (props as any).drawers;
    const disableRuntimeDrawers = (props as any).__disableRuntimeDrawers;
    const combinedDrawers = [...runtimeDrawers.before, ...(ownDrawers?.items ?? []), ...runtimeDrawers.after];
    const finalDrawers = combinedDrawers.length > 0 ? { ...ownDrawers, items: combinedDrawers } : ownDrawers;

    useEffect(() => {
      if (disableRuntimeDrawers) {
        return;
      }
      const unsubscribe = awsuiPluginsInternal.appLayout.onDrawersRegistered(drawers =>
        setRuntimeDrawers(convertRuntimeDrawers(drawers))
      );
      return () => {
        unsubscribe();
        setRuntimeDrawers({ before: [], after: [] });
      };
    }, [disableRuntimeDrawers]);

    return (
      <div ref={__internalRootRef} {...baseProps}>
        {isRefresh ? (
          <RefreshedAppLayout {...props} {...{ drawers: finalDrawers }} ref={ref} />
        ) : (
          <OldAppLayout {...props} {...{ drawers: finalDrawers }} ref={ref} />
        )}
      </div>
    );
  }
);

const OldAppLayout = React.forwardRef(
  (
    {
      navigation,
      navigationWidth = 280,
      navigationHide,
      navigationOpen: controlledNavigationOpen,
      tools,
      toolsWidth = 290,
      toolsHide,
      toolsOpen: controlledToolsOpen,
      breadcrumbs,
      notifications,
      stickyNotifications,
      contentHeader,
      disableContentHeaderOverlap,
      content,
      contentType = 'default',
      disableContentPaddings,
      disableBodyScroll,
      maxContentWidth,
      minContentWidth,
      headerSelector = '#b #h',
      footerSelector = '#b #f',
      ariaLabels,
      splitPanel,
      splitPanelSize: controlledSplitPanelSize,
      splitPanelOpen: controlledSplitPanelOpen,
      splitPanelPreferences: controlledSplitPanelPreferences,
      onSplitPanelPreferencesChange,
      onSplitPanelResize,
      onSplitPanelToggle,
      onNavigationChange,
      onToolsChange,
      ...props
    }: AppLayoutProps,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => {
    if (isDevelopment) {
      if (controlledToolsOpen && toolsHide) {
        warnOnce(
          'AppLayout',
          `You have enabled both the \`toolsOpen\` prop and the \`toolsHide\` prop. This is not supported. Set \`toolsOpen\` to \`false\` when you set \`toolsHide\` to \`true\`.`
        );
      }
    }

    const drawers = (props as InternalDrawerProps).drawers;
    const hasDrawers = drawers && drawers.items.length > 0;

    const rootRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();

    const defaults = applyDefaults(contentType, { maxContentWidth, minContentWidth }, false);
    const [navigationOpen = false, setNavigationOpen] = useControllable(
      controlledNavigationOpen,
      onNavigationChange,
      isMobile ? false : defaults.navigationOpen,
      { componentName: 'AppLayout', controlledProp: 'navigationOpen', changeHandler: 'onNavigationChange' }
    );

    const [toolsOpen = false, setToolsOpen] = useControllable(
      controlledToolsOpen,
      onToolsChange,
      isMobile ? false : defaults.toolsOpen,
      { componentName: 'AppLayout', controlledProp: 'toolsOpen', changeHandler: 'onToolsChange' }
    );

    const [activeDrawerId, setActiveDrawerId] = useControllable(
      drawers?.activeDrawerId,
      drawers?.onChange,
      isMobile ? false : tools ? defaults.toolsOpen : '',
      {
        componentName: 'AppLayout',
        controlledProp: 'activeDrawerId',
        changeHandler: 'onChange',
      }
    );

    const { iconName, getLabels } = togglesConfig.tools;
    const { mainLabel, closeLabel, openLabel } = getLabels(ariaLabels);

    const toolsItem = {
      id: 'tools',
      content: tools,
      resizable: false,
      ariaLabels: {
        triggerButton: openLabel,
        closeButton: closeLabel,
        content: mainLabel,
      },
      trigger: {
        iconName: iconName,
      },
    };

    const getAllDrawerItems = () => {
      if (!hasDrawers) {
        return;
      }
      return tools ? [toolsItem, ...drawers.items] : drawers.items;
    };

    const selectedDrawer =
      tools && toolsOpen
        ? toolsItem
        : hasDrawers
        ? getAllDrawerItems()?.filter((drawerItem: DrawerItem) => drawerItem.id === activeDrawerId)[0]
        : undefined;

    const { refs: navigationRefs, setFocus: focusNavButtons } = useFocusControl(navigationOpen);
    const {
      refs: toolsRefs,
      setFocus: focusToolsButtons,
      loseFocus: loseToolsFocus,
    } = useFocusControl(toolsOpen || selectedDrawer !== undefined, true);
    const {
      refs: drawerRefs,
      setFocus: focusDrawersButtons,
      loseFocus: loseDrawersFocus,
      setLastInteraction: setDrawerLastInteraction,
    } = useDrawerFocusControl([selectedDrawer?.resizable], toolsOpen || selectedDrawer !== undefined, true);

    const onNavigationToggle = useCallback(
      (open: boolean) => {
        setNavigationOpen(open);
        focusNavButtons();
        fireNonCancelableEvent(onNavigationChange, { open });
      },
      [setNavigationOpen, onNavigationChange, focusNavButtons]
    );
    const onToolsToggle = useCallback(
      (open: boolean) => {
        setToolsOpen(open);
        focusToolsButtons();
        fireNonCancelableEvent(onToolsChange, { open });
      },
      [setToolsOpen, onToolsChange, focusToolsButtons]
    );

    const onNavigationClick = (event: React.MouseEvent) => {
      const hasLink = findUpUntil(
        event.target as HTMLElement,
        node => node.tagName === 'A' && !!(node as HTMLAnchorElement).href
      );
      if (hasLink) {
        onNavigationToggle(false);
      }
    };

    const navigationVisible = !navigationHide && navigationOpen;
    const toolsVisible = !toolsHide && toolsOpen;

    const { contentHeightStyle, headerHeight, footerHeight } = useContentHeight(
      headerSelector,
      footerSelector,
      disableBodyScroll
    );
    const [isSplitpanelForcedPosition, setIsSplitpanelForcedPosition] = useState(false);
    const [isResizeInvalid, setIsResizeInvalid] = useState(false);

    const [notificationsHeight, notificationsRef] = useContainerQuery(rect => rect.height);
    const anyPanelOpen = navigationVisible || toolsVisible;
    const hasRenderedNotifications = notificationsHeight ? notificationsHeight > 0 : false;
    const stickyNotificationsHeight = stickyNotifications ? notificationsHeight : null;

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

    const drawerItems = useMemo(() => drawers?.items || [], [drawers?.items]);

    const getDrawerItemSizes = useCallback(() => {
      const sizes: { [id: string]: number } = {};
      if (!drawerItems) {
        return {};
      }

      for (const item of drawerItems) {
        if (item.defaultSize) {
          sizes[item.id] = item.defaultSize || toolsWidth;
        }
      }
      return sizes;
    }, [drawerItems, toolsWidth]);

    const [drawerSizes, setDrawerSizes] = useState(() => getDrawerItemSizes());

    useEffect(() => {
      // Ensure we only set new drawer items by performing a shallow merge
      // of the latest drawer item sizes, and previous drawer item sizes.
      setDrawerSizes(prev => ({ ...getDrawerItemSizes(), ...prev }));
    }, [getDrawerItemSizes]);

    const drawerSize =
      selectedDrawer?.id && drawerSizes[selectedDrawer?.id] ? drawerSizes[selectedDrawer?.id] : toolsWidth;

    const splitPanelPosition = splitPanelPreferences?.position || 'bottom';
    const [splitPanelReportedToggle, setSplitPanelReportedToggle] = useState<SplitPanelSideToggleProps>({
      displayed: false,
      ariaLabel: undefined,
    });
    const splitPanelDisplayed = !!(splitPanel && (splitPanelReportedToggle.displayed || splitPanelOpen));

    const closedDrawerWidth = 40;
    const effectiveNavigationWidth = navigationHide ? 0 : navigationOpen ? navigationWidth : closedDrawerWidth;

    const getEffectiveToolsWidth = () => {
      if (toolsHide && (!splitPanelDisplayed || splitPanelPreferences?.position !== 'side') && !drawers) {
        return 0;
      }

      if (selectedDrawer?.resizable) {
        return drawerSize;
      }

      if (toolsOpen || activeDrawerId) {
        return toolsWidth;
      }

      return closedDrawerWidth;
    };

    const effectiveToolsWidth = getEffectiveToolsWidth();

    const defaultSplitPanelSize = getSplitPanelDefaultSize(splitPanelPosition);
    const [splitPanelSize = defaultSplitPanelSize, setSplitPanelSize] = useControllable(
      controlledSplitPanelSize,
      onSplitPanelResize,
      defaultSplitPanelSize,
      {
        componentName: 'AppLayout',
        controlledProp: 'splitPanelSize',
        changeHandler: 'onSplitPanelResize',
      }
    );

    const mainContentRef = useRef<HTMLDivElement>(null);
    const legacyScrollRootRef = useRef<HTMLElement>(null);

    const { refs: splitPanelRefs, setLastInteraction: setSplitPanelLastInteraction } = useSplitPanelFocusControl([
      splitPanelPreferences,
      splitPanelOpen,
    ]);

    const onSplitPanelPreferencesSet = useCallback(
      (detail: { position: 'side' | 'bottom' }) => {
        setSplitPanelPreferences(detail);
        setSplitPanelLastInteraction({ type: 'position' });
        fireNonCancelableEvent(onSplitPanelPreferencesChange, detail);
      },
      [setSplitPanelPreferences, onSplitPanelPreferencesChange, setSplitPanelLastInteraction]
    );
    const onSplitPanelSizeSet = useCallback(
      (detail: { size: number }) => {
        setSplitPanelSize(detail.size);
        fireNonCancelableEvent(onSplitPanelResize, detail);
      },
      [setSplitPanelSize, onSplitPanelResize]
    );

    const onSplitPanelToggleHandler = useCallback(() => {
      setSplitPanelOpen(!splitPanelOpen);
      setSplitPanelLastInteraction({ type: splitPanelOpen ? 'close' : 'open' });
      fireNonCancelableEvent(onSplitPanelToggle, { open: !splitPanelOpen });
    }, [setSplitPanelOpen, splitPanelOpen, onSplitPanelToggle, setSplitPanelLastInteraction]);

    const getSplitPanelMaxWidth = useStableEventHandler(() => {
      if (!mainContentRef.current || !defaults.minContentWidth) {
        return NaN;
      }

      const width = parseInt(getComputedStyle(mainContentRef.current).width);
      // when disableContentPaddings is true there is less available space,
      // so we subtract space-scaled-2x-xxxl * 2 for left and right padding
      const contentPadding = disableContentPaddings ? 80 : 0;
      const spaceAvailable = width - defaults.minContentWidth - contentPadding;

      const spaceTaken = finalSplitPanePosition === 'side' ? splitPanelSize : 0;
      return Math.max(0, spaceTaken + spaceAvailable);
    });

    const getDrawerMaxWidth = useStableEventHandler(() => {
      if (!mainContentRef.current || !defaults.minContentWidth) {
        return NaN;
      }

      // Either use the computed width of the drawer or the drawerSize as defined.
      const width = parseInt(getComputedStyle(mainContentRef.current).width || `${drawerSize}`);

      // when disableContentPaddings is true there is less available space,
      // so we subtract space-scaled-2x-xxxl * 2 for left and right padding
      const contentPadding = disableContentPaddings ? 80 : 0;
      const spaceAvailable = width - defaults.minContentWidth - contentPadding;
      const spaceTaken = drawerSize;

      return Math.max(0, spaceTaken + spaceAvailable);
    });

    const getSplitPanelMaxHeight = useStableEventHandler(() => {
      if (typeof document === 'undefined') {
        return 0; // render the split panel in its minimum possible size
      } else if (disableBodyScroll && legacyScrollRootRef.current) {
        const availableHeight = legacyScrollRootRef.current.clientHeight;
        return availableHeight < CONSTRAINED_PAGE_HEIGHT ? availableHeight : availableHeight - MAIN_PANEL_MIN_HEIGHT;
      } else {
        const availableHeight = document.documentElement.clientHeight - headerHeight - footerHeight;
        return availableHeight < CONSTRAINED_PAGE_HEIGHT
          ? availableHeight - CONSTRAINED_MAIN_PANEL_MIN_HEIGHT
          : availableHeight - MAIN_PANEL_MIN_HEIGHT;
      }
    });

    const finalSplitPanePosition = isSplitpanelForcedPosition ? 'bottom' : splitPanelPosition;

    const splitPaneAvailableOnTheSide = splitPanelDisplayed && finalSplitPanePosition === 'side';
    const splitPanelOpenOnTheSide = splitPaneAvailableOnTheSide && splitPanelOpen;

    const toggleButtonsBarWidth = 0;

    const windowWidth = useWindowWidth();
    const { left: leftOffset, right: rightOffset } = useAppLayoutOffsets(rootRef.current);
    const contentWidthWithSplitPanel =
      windowWidth -
      leftOffset -
      rightOffset -
      effectiveToolsWidth -
      effectiveNavigationWidth -
      (disableContentPaddings ? 0 : toggleButtonsBarWidth);

    useEffect(() => {
      const contentWidth = contentWidthWithSplitPanel - splitPanelSize;

      setIsSplitpanelForcedPosition(isMobile || (defaults.minContentWidth || 0) > contentWidth);
      setIsResizeInvalid(isMobile || (defaults.minContentWidth || 0) > contentWidthWithSplitPanel);
      // This is a workaround to avoid a forced position due to splitPanelSize, which is
      // user controlled variable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentWidthWithSplitPanel, drawerSize, defaults.minContentWidth, isMobile]);

    const navigationClosedWidth = navigationHide || isMobile ? 0 : closedDrawerWidth;
    const toolsClosedWidth = toolsHide || isMobile || (!hasDrawers && toolsHide) ? 0 : closedDrawerWidth;

    const contentMaxWidthStyle = !isMobile ? { maxWidth: defaults.maxContentWidth } : undefined;

    const [splitPanelReportedSize, setSplitPanelReportedSize] = useState(0);
    const [splitPanelReportedHeaderHeight, setSplitPanelReportedHeaderHeight] = useState(0);

    const getSplitPanelRightOffset = () => {
      if (isMobile) {
        return 0;
      }

      if (hasDrawers) {
        if (activeDrawerId) {
          if (!isResizeInvalid && drawerSize) {
            return drawerSize + closedDrawerWidth;
          }

          return toolsWidth + closedDrawerWidth;
        }
        return closedDrawerWidth;
      }

      if (!toolsHide && toolsOpen) {
        return toolsWidth;
      }
      return toolsClosedWidth;
    };

    const splitPanelContext: SplitPanelContextProps = {
      topOffset: headerHeight + (finalSplitPanePosition === 'bottom' ? stickyNotificationsHeight || 0 : 0),
      bottomOffset: footerHeight,
      leftOffset:
        leftOffset + (isMobile ? 0 : !navigationHide && navigationOpen ? navigationWidth : navigationClosedWidth),
      rightOffset: rightOffset + getSplitPanelRightOffset(),
      position: finalSplitPanePosition,
      size: splitPanelSize,
      getMaxWidth: getSplitPanelMaxWidth,
      getMaxHeight: getSplitPanelMaxHeight,
      disableContentPaddings,
      contentWidthStyles: contentMaxWidthStyle,
      isOpen: splitPanelOpen,
      isMobile,
      isForcedPosition: isSplitpanelForcedPosition,
      onResize: onSplitPanelSizeSet,
      onToggle: onSplitPanelToggleHandler,
      onPreferencesChange: onSplitPanelPreferencesSet,
      setSplitPanelToggle: setSplitPanelReportedToggle,
      reportSize: setSplitPanelReportedSize,
      reportHeaderHeight: setSplitPanelReportedHeaderHeight,
      refs: splitPanelRefs,
    };
    const splitPanelWrapped = splitPanel && (
      <SplitPanelContextProvider value={splitPanelContext}>{splitPanel}</SplitPanelContextProvider>
    );

    const contentWrapperProps: ContentWrapperProps = {
      contentType,
      navigationPadding: navigationHide || !!navigationOpen,
      contentWidthStyles: !isMobile
        ? { minWidth: defaults.minContentWidth, maxWidth: defaults.maxContentWidth }
        : undefined,
      toolsPadding:
        // tools padding is displayed in one of the three cases
        // 1. Nothing on the that screen edge (no tools panel and no split panel)
        toolsHide ||
        (hasDrawers && !activeDrawerId && (!splitPanelDisplayed || finalSplitPanePosition !== 'side')) ||
        // 2. Tools panel is present and open
        toolsVisible ||
        // 3. Split panel is open in side position
        splitPanelOpenOnTheSide,
      isMobile,
    };

    useImperativeHandle(
      ref,
      () => ({
        openTools: () => onToolsToggle(true),
        closeNavigationIfNecessary: () => {
          if (isMobile) {
            onNavigationToggle(false);
          }
        },
        focusToolsClose: () => focusToolsButtons(true),
      }),
      [isMobile, onNavigationToggle, onToolsToggle, focusToolsButtons]
    );

    const splitPanelBottomOffset =
      (!splitPanelDisplayed || finalSplitPanePosition !== 'bottom'
        ? undefined
        : splitPanelOpen
        ? splitPanelReportedSize
        : splitPanelReportedHeaderHeight) ?? undefined;

    const [mobileBarHeight, mobileBarRef] = useContainerQuery(rect => rect.height);

    return (
      <div
        className={clsx(styles.root, testutilStyles.root, disableBodyScroll && styles['root-no-scroll'])}
        ref={rootRef}
      >
        <div className={styles['layout-wrapper']} style={contentHeightStyle}>
          {isMobile && (!toolsHide || !navigationHide || breadcrumbs) && (
            <MobileToolbar
              anyPanelOpen={anyPanelOpen}
              toggleRefs={{ navigation: navigationRefs.toggle, tools: toolsRefs.toggle }}
              topOffset={headerHeight}
              ariaLabels={ariaLabels}
              navigationHide={navigationHide}
              toolsHide={toolsHide}
              onNavigationOpen={() => onNavigationToggle(true)}
              onToolsOpen={() => onToolsToggle(true)}
              unfocusable={anyPanelOpen}
              mobileBarRef={mobileBarRef}
              drawers={
                drawers
                  ? {
                      items: tools && !toolsHide ? [toolsItem, ...drawers.items] : drawers.items,
                      activeDrawerId: selectedDrawer?.id,
                      onChange: changeDetail => {
                        if (selectedDrawer?.id !== changeDetail.activeDrawerId) {
                          onToolsToggle(changeDetail.activeDrawerId === 'tools');
                          focusDrawersButtons();
                          setActiveDrawerId(changeDetail.activeDrawerId);
                          setDrawerLastInteraction({ type: 'open' });
                          fireNonCancelableEvent(drawers.onChange, changeDetail.activeDrawerId);
                        }
                      },
                      ariaLabel: drawers.ariaLabel,
                    }
                  : undefined
              }
            >
              {breadcrumbs}
            </MobileToolbar>
          )}
          <div className={clsx(styles.layout, disableBodyScroll && styles['layout-no-scroll'])}>
            {!navigationHide && (
              <Drawer
                contentClassName={testutilStyles.navigation}
                toggleClassName={testutilStyles['navigation-toggle']}
                closeClassName={testutilStyles['navigation-close']}
                ariaLabels={ariaLabels}
                bottomOffset={footerHeight}
                topOffset={headerHeight}
                isMobile={isMobile}
                isOpen={navigationOpen}
                onClick={isMobile ? onNavigationClick : undefined}
                onToggle={onNavigationToggle}
                toggleRefs={navigationRefs}
                type="navigation"
                width={navigationWidth}
              >
                {navigation}
              </Drawer>
            )}
            <main
              ref={legacyScrollRootRef}
              className={clsx(styles['layout-main'], {
                [styles['layout-main-scrollable']]: disableBodyScroll,
                [testutilStyles['disable-body-scroll-root']]: disableBodyScroll,
                [styles.unfocusable]: isMobile && anyPanelOpen,
              })}
            >
              <div
                style={{
                  marginBottom: splitPanelBottomOffset,
                }}
              >
                {notifications && (
                  <Notifications
                    disableContentPaddings={disableContentPaddings}
                    testUtilsClassName={testutilStyles.notifications}
                    labels={ariaLabels}
                    topOffset={disableBodyScroll ? 0 : headerHeight}
                    sticky={!isMobile && stickyNotifications}
                    ref={notificationsRef}
                  >
                    {notifications}
                  </Notifications>
                )}
                {((!isMobile && breadcrumbs) || contentHeader) && (
                  <ContentWrapper {...contentWrapperProps}>
                    {!isMobile && breadcrumbs && (
                      <div className={clsx(testutilStyles.breadcrumbs, styles['breadcrumbs-desktop'])}>
                        {breadcrumbs}
                      </div>
                    )}
                    {contentHeader && (
                      <div
                        className={clsx(
                          styles['content-header-wrapper'],
                          !hasRenderedNotifications &&
                            (isMobile || !breadcrumbs) &&
                            styles['content-extra-top-padding'],
                          !hasRenderedNotifications && !breadcrumbs && styles['content-header-wrapper-first-child'],
                          !disableContentHeaderOverlap && styles['content-header-wrapper-overlapped']
                        )}
                      >
                        {contentHeader}
                      </div>
                    )}
                  </ContentWrapper>
                )}
                <ContentWrapper
                  {...contentWrapperProps}
                  ref={mainContentRef}
                  disablePaddings={disableContentPaddings}
                  // eslint-disable-next-line react/forbid-component-props
                  className={clsx(
                    !disableContentPaddings && styles['content-wrapper'],
                    !disableContentPaddings &&
                      (isMobile || !breadcrumbs) &&
                      !contentHeader &&
                      styles['content-extra-top-padding'],
                    testutilStyles.content,
                    !disableContentHeaderOverlap && contentHeader && styles['content-overlapped'],
                    !hasRenderedNotifications &&
                      !breadcrumbs &&
                      !isMobile &&
                      !contentHeader &&
                      styles['content-wrapper-first-child']
                  )}
                >
                  <AppLayoutContext.Provider
                    value={{
                      stickyOffsetTop:
                        // We don't support the table header being sticky in case the deprecated disableBodyScroll is enabled,
                        // therefore we ensure the table header scrolls out of view by offseting a large enough value (9999px)
                        (disableBodyScroll ? (isMobile ? -9999 : 0) : headerHeight) +
                        (isMobile ? 0 : stickyNotificationsHeight !== null ? stickyNotificationsHeight : 0),
                      stickyOffsetBottom: footerHeight + (splitPanelBottomOffset || 0),
                      mobileBarHeight: mobileBarHeight ?? 0,
                    }}
                  >
                    {content}
                  </AppLayoutContext.Provider>
                </ContentWrapper>
              </div>
              {finalSplitPanePosition === 'bottom' && splitPanelWrapped}
            </main>

            {finalSplitPanePosition === 'side' && (
              <SideSplitPanelDrawer
                topOffset={headerHeight}
                bottomOffset={footerHeight}
                displayed={splitPanelDisplayed}
                width={splitPanelOpen && splitPanel ? splitPanelSize : undefined}
              >
                {splitPanelWrapped}
              </SideSplitPanelDrawer>
            )}

            {((hasDrawers && selectedDrawer?.id) || (!hasDrawers && !toolsHide)) &&
              (hasDrawers ? (
                <ResizableDrawer
                  contentClassName={
                    selectedDrawer?.id === 'tools' ? testutilStyles.tools : testutilStyles['active-drawer']
                  }
                  toggleClassName={testutilStyles['tools-toggle']}
                  closeClassName={
                    selectedDrawer?.id === 'tools'
                      ? testutilStyles['tools-close']
                      : testutilStyles['active-drawer-close-button']
                  }
                  ariaLabels={ariaLabels}
                  drawersAriaLabels={selectedDrawer?.ariaLabels}
                  width={!isResizeInvalid ? drawerSize : toolsWidth}
                  bottomOffset={footerHeight}
                  topOffset={headerHeight}
                  isMobile={isMobile}
                  onToggle={onToolsToggle}
                  isOpen={toolsOpen || activeDrawerId !== undefined}
                  toggleRefs={toolsRefs}
                  type="tools"
                  onLoseFocus={hasDrawers ? loseDrawersFocus : loseToolsFocus}
                  activeDrawer={selectedDrawer}
                  drawers={{
                    items: tools && !toolsHide ? [toolsItem, ...drawers.items] : drawers.items,
                    activeDrawerId: selectedDrawer?.id,
                    onChange: changeDetail => {
                      onToolsToggle(false);
                      setDrawerLastInteraction({ type: 'close' });
                      setActiveDrawerId(changeDetail.activeDrawerId);
                      fireNonCancelableEvent(drawers.onChange, changeDetail.activeDrawerId);
                    },
                  }}
                  size={!isResizeInvalid ? drawerSize : toolsWidth}
                  onResize={changeDetail => {
                    fireNonCancelableEvent(drawers.onResize, changeDetail);
                    const drawerItem = drawerItems.find(({ id }) => id === changeDetail.id);
                    if (drawerItem?.onResize) {
                      fireNonCancelableEvent(drawerItem.onResize, changeDetail);
                    }
                    setDrawerSizes({ ...drawerSizes, [changeDetail.id]: changeDetail.size });
                  }}
                  refs={drawerRefs}
                  getMaxWidth={getDrawerMaxWidth}
                >
                  {selectedDrawer?.content}
                </ResizableDrawer>
              ) : (
                <Drawer
                  contentClassName={testutilStyles.tools}
                  toggleClassName={testutilStyles['tools-toggle']}
                  closeClassName={testutilStyles['tools-close']}
                  ariaLabels={ariaLabels}
                  width={effectiveToolsWidth}
                  bottomOffset={footerHeight}
                  topOffset={headerHeight}
                  isMobile={isMobile}
                  onToggle={onToolsToggle}
                  isOpen={toolsOpen}
                  toggleRefs={toolsRefs}
                  type="tools"
                  onLoseFocus={loseToolsFocus}
                >
                  {tools}
                </Drawer>
              ))}
            {hasDrawers && (
              <DrawerTriggersBar
                contentClassName={testutilStyles['drawers-desktop-triggers-container']}
                toggleClassName={testutilStyles['drawers-trigger']}
                bottomOffset={footerHeight}
                topOffset={headerHeight}
                isMobile={isMobile}
                drawers={{
                  items: tools && !toolsHide ? [toolsItem, ...drawers.items] : drawers.items,
                  activeDrawerId: selectedDrawer?.id,
                  onChange: changeDetail => {
                    if (selectedDrawer?.id !== changeDetail.activeDrawerId) {
                      onToolsToggle(changeDetail.activeDrawerId === 'tools');
                      focusDrawersButtons();
                      setActiveDrawerId(changeDetail.activeDrawerId);
                      setDrawerLastInteraction({ type: 'open' });
                      fireNonCancelableEvent(drawers.onChange, changeDetail.activeDrawerId);
                    }
                  },
                  ariaLabel: drawers.ariaLabel,
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

applyDisplayName(AppLayout, 'AppLayout');
export default AppLayout;
