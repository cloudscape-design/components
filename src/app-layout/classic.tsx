// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useControllable } from '../internal/hooks/use-controllable';
import { useMobile } from '../internal/hooks/use-mobile';
import { fireNonCancelableEvent } from '../internal/events';
import { AppLayoutProps, AppLayoutPropsWithDefaults } from './interfaces';
import { Notifications } from './notifications';
import { MobileToolbar } from './mobile-toolbar';
import { useFocusControl } from './utils/use-focus-control';
import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';
import { findUpUntil } from '../internal/utils/dom';
import { AppLayoutContext } from '../internal/context/app-layout-context';
import { SplitPanelSideToggleProps } from '../internal/context/split-panel-context';
import {
  CONSTRAINED_MAIN_PANEL_MIN_HEIGHT,
  CONSTRAINED_PAGE_HEIGHT,
  getSplitPanelDefaultSize,
  MAIN_PANEL_MIN_HEIGHT,
} from '../split-panel/utils/size-utils';
import ContentWrapper, { ContentWrapperProps } from './content-wrapper';
import { Drawer, DrawerTriggersBar } from './drawer';
import { ResizableDrawer } from './drawer/resizable-drawer';
import {
  SPLIT_PANEL_MIN_WIDTH,
  SideSplitPanelDrawer,
  SplitPanelProvider,
  SplitPanelProviderProps,
} from './split-panel';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';

import { useSplitPanelFocusControl } from './utils/use-split-panel-focus-control';
import { TOOLS_DRAWER_ID, useDrawers } from './utils/use-drawers';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { togglesConfig } from './toggles';

const ClassicAppLayout = React.forwardRef(
  (
    {
      navigation,
      navigationWidth,
      navigationHide,
      navigationOpen,
      tools,
      toolsWidth,
      toolsHide,
      toolsOpen: controlledToolsOpen,
      breadcrumbs,
      notifications,
      stickyNotifications,
      contentHeader,
      disableContentHeaderOverlap,
      content,
      contentType,
      disableContentPaddings,
      disableBodyScroll,
      maxContentWidth,
      minContentWidth,
      placement,
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
    }: AppLayoutPropsWithDefaults,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => {
    // Private API for embedded view mode
    const __embeddedViewMode = Boolean((rest as any).__embeddedViewMode);

    const rootRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();

    const [toolsOpen = false, setToolsOpen] = useControllable(controlledToolsOpen, onToolsChange, false, {
      componentName: 'AppLayout',
      controlledProp: 'toolsOpen',
      changeHandler: 'onToolsChange',
    });
    const onToolsToggle = (open: boolean) => {
      setToolsOpen(open);
      focusToolsButtons();
      fireNonCancelableEvent(onToolsChange, { open });
    };

    const {
      drawers,
      activeDrawer,
      minDrawerSize,
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

    const [headerFooterHeight, setHeaderFooterHeight] = useState(0);
    // Delay applying changes in header/footer height, as applying them immediately can cause
    // ResizeOberver warnings due to the algorithm thinking that the change might have side-effects
    // further up the tree, therefore blocking notifications to prevent loops
    useEffect(() => {
      const id = requestAnimationFrame(() =>
        setHeaderFooterHeight(placement.insetBlockStart + placement.insetBlockEnd)
      );
      return () => cancelAnimationFrame(id);
    }, [placement.insetBlockStart, placement.insetBlockEnd]);
    const contentHeightStyle = {
      [disableBodyScroll ? 'height' : 'minHeight']: `calc(100vh - ${headerFooterHeight}px)`,
    };

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
      if (activeDrawer && activeDrawerSize) {
        return activeDrawerSize;
      }

      if (toolsHide || drawers) {
        return 0;
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

    const getSplitPanelMaxHeight = useStableCallback(() => {
      if (typeof document === 'undefined') {
        return 0; // render the split panel in its minimum possible size
      } else if (disableBodyScroll && legacyScrollRootRef.current) {
        const availableHeight = legacyScrollRootRef.current.clientHeight;
        return availableHeight < CONSTRAINED_PAGE_HEIGHT ? availableHeight : availableHeight - MAIN_PANEL_MIN_HEIGHT;
      } else {
        const availableHeight =
          document.documentElement.clientHeight - placement.insetBlockStart - placement.insetBlockEnd;
        return availableHeight < CONSTRAINED_PAGE_HEIGHT
          ? availableHeight - CONSTRAINED_MAIN_PANEL_MIN_HEIGHT
          : availableHeight - MAIN_PANEL_MIN_HEIGHT;
      }
    });

    const rightDrawerBarWidth = drawers ? (drawers.length > 1 ? closedDrawerWidth : 0) : 0;
    const contentPadding = 80;
    // all content except split-panel + drawers/tools area
    const resizableSpaceAvailable = Math.max(
      0,
      placement.inlineSize - effectiveNavigationWidth - minContentWidth - contentPadding - rightDrawerBarWidth
    );

    // if there is no space to display split panel in the side, force to bottom
    const isSplitPanelForcedPosition =
      isMobile || resizableSpaceAvailable - effectiveToolsWidth < SPLIT_PANEL_MIN_WIDTH;
    const finalSplitPanePosition = isSplitPanelForcedPosition ? 'bottom' : splitPanelPosition;

    const splitPaneAvailableOnTheSide = splitPanelDisplayed && finalSplitPanePosition === 'side';

    const sideSplitPanelSize = splitPaneAvailableOnTheSide ? (splitPanelOpen ? splitPanelSize : closedDrawerWidth) : 0;
    const splitPanelMaxWidth = Math.max(0, resizableSpaceAvailable - effectiveToolsWidth);
    const drawerMaxSize = Math.max(0, resizableSpaceAvailable - sideSplitPanelSize);

    const navigationClosedWidth = navigationHide || isMobile ? 0 : closedDrawerWidth;

    const contentMaxWidthStyle = !isMobile ? { maxWidth: maxContentWidth } : undefined;

    const [splitPanelReportedSize, setSplitPanelReportedSize] = useState(0);
    const [splitPanelReportedHeaderHeight, setSplitPanelReportedHeaderHeight] = useState(0);

    const splitPanelContextProps: SplitPanelProviderProps = {
      topOffset: placement.insetBlockStart + (finalSplitPanePosition === 'bottom' ? stickyNotificationsHeight || 0 : 0),
      bottomOffset: placement.insetBlockEnd,
      leftOffset:
        placement.insetInlineStart +
        (isMobile ? 0 : !navigationHide && navigationOpen ? navigationWidth : navigationClosedWidth),
      rightOffset: isMobile ? 0 : placement.insetInlineEnd + effectiveToolsWidth + rightDrawerBarWidth,
      position: finalSplitPanePosition,
      size: splitPanelSize,
      maxWidth: splitPanelMaxWidth,
      getMaxHeight: getSplitPanelMaxHeight,
      disableContentPaddings,
      contentWidthStyles: contentMaxWidthStyle,
      isOpen: splitPanelOpen,
      isForcedPosition: isSplitPanelForcedPosition,
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
      contentWidthStyles: !isMobile ? { minWidth: minContentWidth, maxWidth: maxContentWidth } : undefined,
      toolsPadding:
        // tools padding is displayed in one of the three cases
        // 1. Nothing on the that screen edge (no tools panel and no split panel)
        toolsHide ||
        (hasDrawers && !activeDrawer && (!splitPanelDisplayed || finalSplitPanePosition !== 'side')) ||
        // 2. Tools panel is present and open
        toolsVisible ||
        // 3. Split panel is open in side position
        (splitPaneAvailableOnTheSide && splitPanelOpen),
      isMobile,
    };

    useImperativeHandle(ref, () => ({
      openTools: () => onToolsToggle(true),
      closeNavigationIfNecessary: () => {
        if (isMobile) {
          onNavigationToggle(false);
        }
      },
      focusToolsClose: () => {
        if (hasDrawers) {
          focusDrawersButtons(true);
        } else {
          focusToolsButtons(true);
        }
      },
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
            topOffset={placement.insetBlockStart}
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
              bottomOffset={placement.insetBlockEnd}
              topOffset={placement.insetBlockStart}
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
                  topOffset={disableBodyScroll ? 0 : placement.insetBlockStart}
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
                      (disableBodyScroll ? (isMobile ? -9999 : 0) : placement.insetBlockStart) +
                      (isMobile ? 0 : stickyNotificationsHeight !== null ? stickyNotificationsHeight : 0),
                    stickyOffsetBottom: placement.insetBlockEnd + (splitPanelBottomOffset || 0),
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
                mainLabel: activeDrawer?.ariaLabels?.drawerName,
                resizeHandle: activeDrawer?.ariaLabels?.resizeHandle,
              }}
              minWidth={minDrawerSize}
              maxWidth={drawerMaxSize}
              width={activeDrawerSize}
              bottomOffset={placement.insetBlockEnd}
              topOffset={placement.insetBlockStart}
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
              onResize={changeDetail => onActiveDrawerResize(changeDetail)}
              refs={drawerRefs}
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
                width={toolsWidth}
                bottomOffset={placement.insetBlockEnd}
                topOffset={placement.insetBlockStart}
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
              bottomOffset={placement.insetBlockEnd}
              topOffset={placement.insetBlockStart}
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

export default ClassicAppLayout;
