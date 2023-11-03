// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
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
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SplitPanelSideToggleProps } from '../internal/context/split-panel-context';
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
import { SplitPanelProvider, SideSplitPanelDrawer, SplitPanelProviderProps } from './split-panel';
import useAppLayoutOffsets from './utils/use-content-width';
import { isDevelopment } from '../internal/is-development';
import { useStableCallback, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import RefreshedAppLayout from './visual-refresh';
import { useInternalI18n } from '../i18n/context';
import { useSplitPanelFocusControl } from './utils/use-split-panel-focus-control';
import { TOOLS_DRAWER_ID, useDrawers } from './utils/use-drawers';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { togglesConfig } from './toggles';

export { AppLayoutProps };

const AppLayout = React.forwardRef(
  (
    { contentType = 'default', headerSelector = '#b #h', footerSelector = '#b #f', ...rest }: AppLayoutProps,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent<HTMLDivElement>('AppLayout');
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
      drawers: i18n('ariaLabels.drawers', rest.ariaLabels?.drawers),
      drawersOverflow: i18n('ariaLabels.drawersOverflow', rest.ariaLabels?.drawersOverflow),
      drawersOverflowWithBadge: i18n('ariaLabels.drawersOverflowWithBadge', rest.ariaLabels?.drawersOverflowWithBadge),
    };

    // This re-builds the props including the default values
    const props = { contentType, headerSelector, footerSelector, ...rest, ariaLabels };

    const baseProps = getBaseProps(rest);

    return (
      <div ref={__internalRootRef} {...baseProps}>
        {isRefresh ? <RefreshedAppLayout {...props} ref={ref} /> : <OldAppLayout {...props} ref={ref} />}
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
      drawers: controlledDrawers,
      onDrawerChange,
      activeDrawerId: controlledActiveDrawerId,
      ...rest
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

    // Private API for embedded view mode
    const __embeddedViewMode = Boolean((props as any).__embeddedViewMode);

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
    const onToolsToggle = (open: boolean) => {
      setToolsOpen(open);
      focusToolsButtons();
      fireNonCancelableEvent(onToolsChange, { open });
    };

    const {
      drawers,
      activeDrawer,
      activeDrawerSize,
      activeDrawerId,
      ariaLabelsWithDrawers,
      onActiveDrawerChange,
      onActiveDrawerResize,
    } = useDrawers(
      {
        drawers: controlledDrawers,
        onDrawerChange,
        activeDrawerId: controlledActiveDrawerId,
        ...rest,
      },
      ariaLabels,
      {
        ariaLabels,
        tools,
        toolsOpen,
        toolsHide,
        toolsWidth,
        onToolsToggle,
      }
    );
    ariaLabels = ariaLabelsWithDrawers;
    const hasDrawers = !!drawers;

    const { refs: navigationRefs, setFocus: focusNavButtons } = useFocusControl(navigationOpen);
    const {
      refs: toolsRefs,
      setFocus: focusToolsButtons,
      loseFocus: loseToolsFocus,
    } = useFocusControl(toolsOpen || activeDrawer !== undefined, true);
    const {
      refs: drawerRefs,
      setFocus: focusDrawersButtons,
      loseFocus: loseDrawersFocus,
    } = useFocusControl(!!activeDrawerId, true, activeDrawerId);

    const onNavigationToggle = useStableCallback((open: boolean) => {
      setNavigationOpen(open);
      focusNavButtons();
      fireNonCancelableEvent(onNavigationChange, { open });
    });

    const onNavigationClick = (event: React.MouseEvent) => {
      const hasLink = findUpUntil(
        event.target as HTMLElement,
        node => node.tagName === 'A' && !!(node as HTMLAnchorElement).href
      );
      if (hasLink) {
        onNavigationToggle(false);
      }
    };

    useEffect(() => {
      // Close navigation drawer on mobile so that the main content is visible
      if (isMobile) {
        onNavigationToggle(false);
      }
    }, [isMobile, onNavigationToggle]);

    const navigationVisible = !navigationHide && navigationOpen;
    const toolsVisible = !toolsHide && toolsOpen;

    const { contentHeightStyle, headerHeight, footerHeight } = useContentHeight(
      headerSelector,
      footerSelector,
      disableBodyScroll
    );
    const [isSplitpanelForcedPosition, setIsSplitpanelForcedPosition] = useState(false);

    const [notificationsHeight, notificationsRef] = useContainerQuery(rect => rect.contentBoxHeight);
    const anyPanelOpen = navigationVisible || toolsVisible || !!activeDrawer;
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

    const splitPanelPosition = splitPanelPreferences?.position || 'bottom';
    const [splitPanelReportedToggle, setSplitPanelReportedToggle] = useState<SplitPanelSideToggleProps>({
      displayed: false,
      ariaLabel: undefined,
    });
    const splitPanelDisplayed = !!(splitPanel && (splitPanelReportedToggle.displayed || splitPanelOpen));

    const closedDrawerWidth = 40;
    const effectiveNavigationWidth = navigationHide ? 0 : navigationOpen ? navigationWidth : closedDrawerWidth;

    const getEffectiveToolsWidth = () => {
      if (
        toolsHide &&
        (!splitPanelDisplayed || splitPanelPreferences?.position !== 'side') &&
        (!drawers || drawers.length === 0)
      ) {
        return 0;
      }

      if (activeDrawer && activeDrawerSize) {
        return activeDrawerSize;
      }

      if (toolsOpen) {
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
      (newSize: number) => {
        setSplitPanelSize(newSize);
        fireNonCancelableEvent(onSplitPanelResize, { size: newSize });
      },
      [setSplitPanelSize, onSplitPanelResize]
    );

    const onSplitPanelToggleHandler = useCallback(() => {
      setSplitPanelOpen(!splitPanelOpen);
      setSplitPanelLastInteraction({ type: splitPanelOpen ? 'close' : 'open' });
      fireNonCancelableEvent(onSplitPanelToggle, { open: !splitPanelOpen });
    }, [setSplitPanelOpen, splitPanelOpen, onSplitPanelToggle, setSplitPanelLastInteraction]);

    const getSplitPanelMaxWidth = useStableCallback(() => {
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

    const getDrawerMaxWidth = useStableCallback(() => {
      if (!mainContentRef.current || !defaults.minContentWidth) {
        return NaN;
      }

      // Either use the computed width of the drawer or the drawerSize as defined.
      const width = parseInt(getComputedStyle(mainContentRef.current).width || `${activeDrawerSize}`);

      // when disableContentPaddings is true there is less available space,
      // so we subtract space-scaled-2x-xxxl * 2 for left and right padding
      const contentPadding = disableContentPaddings ? 80 : 0;
      const spaceAvailable = width - defaults.minContentWidth - contentPadding;

      return Math.max(0, activeDrawerSize + spaceAvailable);
    });

    const getSplitPanelMaxHeight = useStableCallback(() => {
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
    const isResizeInvalid = isMobile || (defaults.minContentWidth || 0) > contentWidthWithSplitPanel;

    useEffect(() => {
      const contentWidth = contentWidthWithSplitPanel - splitPanelSize;

      setIsSplitpanelForcedPosition(isMobile || (defaults.minContentWidth || 0) > contentWidth);
      // This is a workaround to avoid a forced position due to splitPanelSize, which is
      // user controlled variable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentWidthWithSplitPanel, activeDrawerSize, defaults.minContentWidth, isMobile]);

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
        if (activeDrawer) {
          if (drawers.length === 1) {
            return activeDrawerSize;
          }
          if (!isResizeInvalid && activeDrawerSize) {
            return activeDrawerSize + closedDrawerWidth;
          }

          return toolsWidth + closedDrawerWidth;
        }
        return drawers.length > 0 ? closedDrawerWidth : 0;
      }

      if (!toolsHide && toolsOpen) {
        return toolsWidth;
      }
      return toolsClosedWidth;
    };

    const splitPanelContextProps: SplitPanelProviderProps = {
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
      <SplitPanelProvider {...splitPanelContextProps}>
        {finalSplitPanePosition === 'side' ? (
          <SideSplitPanelDrawer displayed={splitPanelDisplayed}>{splitPanel}</SideSplitPanelDrawer>
        ) : (
          splitPanel
        )}
      </SplitPanelProvider>
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
        (hasDrawers && !activeDrawer && (!splitPanelDisplayed || finalSplitPanePosition !== 'side')) ||
        // 2. Tools panel is present and open
        toolsVisible ||
        // 3. Split panel is open in side position
        splitPanelOpenOnTheSide,
      isMobile,
    };

    useImperativeHandle(ref, () => ({
      openTools: () => onToolsToggle(true),
      closeNavigationIfNecessary: () => {
        if (isMobile) {
          onNavigationToggle(false);
        }
      },
      focusToolsClose: () => focusToolsButtons(true),
      focusActiveDrawer: () => focusDrawersButtons(true),
      focusSplitPanel: () => splitPanelRefs.slider.current?.focus(),
    }));

    const splitPanelBottomOffset =
      (!splitPanelDisplayed || finalSplitPanePosition !== 'bottom'
        ? undefined
        : splitPanelOpen
        ? splitPanelReportedSize
        : splitPanelReportedHeaderHeight) ?? undefined;

    const [mobileBarHeight, mobileBarRef] = useContainerQuery(rect => rect.contentBoxHeight);

    return (
      <div
        className={clsx(styles.root, testutilStyles.root, disableBodyScroll && styles['root-no-scroll'])}
        ref={rootRef}
        style={contentHeightStyle}
      >
        {isMobile && !__embeddedViewMode && (!toolsHide || !navigationHide || breadcrumbs) && (
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
            drawers={drawers}
            activeDrawerId={activeDrawerId}
            onDrawerChange={newDrawerId => {
              onActiveDrawerChange(newDrawerId);
              if (newDrawerId !== activeDrawerId) {
                focusToolsButtons();
                focusDrawersButtons();
              }
            }}
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
              ariaLabels={togglesConfig.navigation.getLabels(ariaLabels)}
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
                    <div className={clsx(testutilStyles.breadcrumbs, styles['breadcrumbs-desktop'])}>{breadcrumbs}</div>
                  )}
                  {contentHeader && (
                    <div
                      className={clsx(
                        styles['content-header-wrapper'],
                        !hasRenderedNotifications && (isMobile || !breadcrumbs) && styles['content-extra-top-padding'],
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

          {finalSplitPanePosition === 'side' && splitPanelWrapped}

          {hasDrawers ? (
            <ResizableDrawer
              contentClassName={clsx(
                activeDrawerId && testutilStyles['active-drawer'],
                activeDrawerId === TOOLS_DRAWER_ID && testutilStyles.tools
              )}
              toggleClassName={testutilStyles['tools-toggle']}
              closeClassName={clsx(
                testutilStyles['active-drawer-close-button'],
                activeDrawerId === TOOLS_DRAWER_ID && testutilStyles['tools-close']
              )}
              ariaLabels={{
                openLabel: activeDrawer?.ariaLabels?.triggerButton,
                closeLabel: activeDrawer?.ariaLabels?.closeButton,
                mainLabel: activeDrawer?.ariaLabels.drawerName,
                resizeHandle: activeDrawer?.ariaLabels?.resizeHandle,
              }}
              width={!isResizeInvalid ? activeDrawerSize : toolsWidth}
              bottomOffset={footerHeight}
              topOffset={headerHeight}
              isMobile={isMobile}
              onToggle={isOpen => {
                if (!isOpen) {
                  focusToolsButtons();
                  focusDrawersButtons();
                  onActiveDrawerChange(null);
                }
              }}
              isOpen={true}
              hideOpenButton={true}
              toggleRefs={drawerRefs}
              type="tools"
              onLoseFocus={loseDrawersFocus}
              activeDrawer={activeDrawer}
              size={!isResizeInvalid ? activeDrawerSize : toolsWidth}
              onResize={changeDetail => onActiveDrawerResize(changeDetail)}
              refs={drawerRefs}
              getMaxWidth={getDrawerMaxWidth}
              toolsContent={drawers?.find(drawer => drawer.id === TOOLS_DRAWER_ID)?.content}
            >
              {activeDrawer?.content}
            </ResizableDrawer>
          ) : (
            !toolsHide && (
              <Drawer
                contentClassName={testutilStyles.tools}
                toggleClassName={testutilStyles['tools-toggle']}
                closeClassName={testutilStyles['tools-close']}
                ariaLabels={togglesConfig.tools.getLabels(ariaLabels)}
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
            )
          )}
          {hasDrawers && drawers.length > 0 && (
            <DrawerTriggersBar
              drawerRefs={drawerRefs}
              bottomOffset={footerHeight}
              topOffset={headerHeight}
              isMobile={isMobile}
              drawers={drawers}
              activeDrawerId={activeDrawerId}
              onDrawerChange={newDrawerId => {
                if (activeDrawerId !== newDrawerId) {
                  focusToolsButtons();
                  focusDrawersButtons();
                }
                onActiveDrawerChange(newDrawerId);
              }}
              ariaLabels={ariaLabels}
            />
          )}
        </div>
      </div>
    );
  }
);

applyDisplayName(AppLayout, 'AppLayout');
export default AppLayout;
