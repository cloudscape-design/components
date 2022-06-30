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
import { SplitPanelWrapper } from './split-panel-wrapper';
import { useFocusControl } from './utils/use-focus-control';
import useWindowWidth from './utils/use-window-width';
import useContentHeight from './utils/use-content-height';
import styles from './styles.css.js';
import testutilStyles from './test-classes/styles.css.js';
import { findUpUntil } from '../internal/utils/dom';
import { AppLayoutDomContext } from '../internal/context/app-layout-context';
import { useContainerQuery } from '../internal/hooks/container-queries';
import { useStableEventHandler } from '../internal/hooks/use-stable-event-handler';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { SplitPanelContextProps, SplitPanelLastInteraction } from '../internal/context/split-panel-context';
import { getSplitPanelDefaultSize, MAIN_PANEL_MIN_HEIGHT } from '../split-panel/utils/size-utils';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import ContentWrapper, { ContentWrapperProps } from './content-wrapper';
import { DarkHeader, DarkHeaderProps } from './dark-header';
import { isMotionDisabled } from '../internal/motion';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
import { NavigationPanel } from './navigation-panel';
import { ToolsAndSplitPanel } from './tools-and-split-panel';
import { usePreviousFrameValue } from '../internal/hooks/use-previous-frame';
import useAppLayoutOffsets from './utils/use-content-width';
import { isDevelopment } from '../internal/is-development';
import { warnOnce } from '../internal/logging';

import RefreshedAppLayout from './visual-refresh';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

export { AppLayoutProps };

const AppLayout = React.forwardRef(
  (
    { contentType = 'default', headerSelector = '#b #h', footerSelector = '#b #f', ...rest }: AppLayoutProps,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent<HTMLDivElement>('AppLayout');
    const isRefresh = useVisualRefresh(__internalRootRef);

    // This re-builds the props including the default values
    const props = { contentType, headerSelector, footerSelector, ...rest };

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
    const rootRef = useRef<HTMLDivElement>(null);
    const isMobile = useMobile();
    const isMotionEnabled = rootRef.current ? !isMotionDisabled(rootRef.current) : false;

    const defaults = applyDefaults(contentType, { maxContentWidth, minContentWidth }, false);
    const darkStickyHeaderContentType = ['cards', 'table'].indexOf(contentType) > -1;
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

    const onNavigationToggle = useCallback(
      (open: boolean) => {
        setNavigationOpen(open);
        fireNonCancelableEvent(onNavigationChange, { open });
      },
      [setNavigationOpen, onNavigationChange]
    );
    const onToolsToggle = useCallback(
      (open: boolean) => {
        setToolsOpen(open);
        fireNonCancelableEvent(onToolsChange, { open });
      },
      [setToolsOpen, onToolsChange]
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

    const { contentHeightStyle, headerHeight, footerHeight, panelHeightStyle } = useContentHeight(
      headerSelector,
      footerSelector,
      disableBodyScroll
    );
    const [notificationsHeight, notificationsRef] = useContainerQuery(rect => rect.height);
    const [splitPanelHeight, splitPanelRef] = useContainerQuery(rect => (splitPanel ? rect.height : 0), [splitPanel]);
    const [splitPanelHeaderHeight, splitPanelHeaderMeasureRef] = useContainerQuery(
      rect => (splitPanel ? rect.height : 0),
      [splitPanel]
    );
    const splitPanelHeaderRefObject = useRef(null);
    const splitPanelHeaderRef = useMergeRefs(splitPanelHeaderMeasureRef, splitPanelHeaderRefObject);
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
    const splitPanelPosition = splitPanelPreferences?.position || 'bottom';

    const closedDrawerWidth = 40;
    const effectiveNavigationWidth = navigationHide ? 0 : navigationOpen ? navigationWidth : closedDrawerWidth;
    const effectiveToolsWidth =
      toolsHide && (!splitPanel || splitPanelPreferences?.position !== 'side')
        ? 0
        : toolsOpen
        ? toolsWidth
        : closedDrawerWidth;

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

    const mainContentRef = useRef<HTMLDivElement>(null);
    const legacyScrollRootRef = useRef<HTMLElement>(null);

    const onSplitPanelPreferencesSet = useCallback(
      (detail: { position: 'side' | 'bottom' }) => {
        setSplitPanelPreferences(detail);
        fireNonCancelableEvent(onSplitPanelPreferencesChange, detail);
      },
      [setSplitPanelPreferences, onSplitPanelPreferencesChange]
    );
    const onSplitPanelSizeSet = useCallback(
      (detail: { size: number }) => {
        setSplitPanelSize(detail.size);
        fireNonCancelableEvent(onSplitPanelResize, detail);
      },
      [setSplitPanelSize, onSplitPanelResize]
    );
    const onToggle = useCallback(() => {
      setSplitPanelOpen(!splitPanelOpen);
      fireNonCancelableEvent(onSplitPanelToggle, { open: !splitPanelOpen });
    }, [setSplitPanelOpen, splitPanelOpen, onSplitPanelToggle]);

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

    const getSplitPanelMaxHeight = useStableEventHandler(() => {
      if (typeof document === 'undefined') {
        return 0; // render the split panel in its minimum possible size
      } else if (disableBodyScroll && legacyScrollRootRef.current) {
        return legacyScrollRootRef.current.clientHeight - MAIN_PANEL_MIN_HEIGHT;
      } else {
        return document.documentElement.clientHeight - headerHeight - footerHeight - MAIN_PANEL_MIN_HEIGHT;
      }
    });

    const [isForcedPosition, setIsForcedPosition] = useState(false);
    const finalSplitPanePosition = isForcedPosition ? 'bottom' : splitPanelPosition;

    const splitPaneAvailableOnTheSide = Boolean(splitPanel) && finalSplitPanePosition === 'side';
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
      setIsForcedPosition(isMobile || (defaults.minContentWidth || 0) > contentWidth);
      // This is a workaround to avoid a forced position due to splitPanelSize, which is
      // user controlled variable.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contentWidthWithSplitPanel, defaults.minContentWidth, isMobile]);

    const navigationClosedWidth = navigationHide || isMobile ? 0 : closedDrawerWidth;
    const toolsClosedWidth = toolsHide || isMobile ? 0 : closedDrawerWidth;

    const [splitPanelLastInteraction, setSplitPanelLastInteraction] = useState<undefined | SplitPanelLastInteraction>();
    useEffectOnUpdate(
      () => setSplitPanelLastInteraction(splitPanelOpen ? { type: 'open' } : { type: 'close' }),
      [splitPanelOpen]
    );
    useEffectOnUpdate(() => setSplitPanelLastInteraction({ type: 'position' }), [splitPanelPosition]);

    const contentMaxWidthStyle = !isMobile ? { maxWidth: defaults.maxContentWidth } : undefined;

    const [splitPanelReportedSize, setSplitPanelReportedSize] = useState(0);

    const splitPanelContext: SplitPanelContextProps = {
      topOffset: headerHeight + (finalSplitPanePosition === 'bottom' ? stickyNotificationsHeight || 0 : 0),
      bottomOffset: footerHeight,
      leftOffset:
        leftOffset + (isMobile ? 0 : !navigationHide && navigationOpen ? navigationWidth : navigationClosedWidth),
      rightOffset: rightOffset + (isMobile ? 0 : !toolsHide && toolsOpen ? toolsWidth : toolsClosedWidth),
      position: finalSplitPanePosition,
      size: splitPanelSize,
      getMaxWidth: getSplitPanelMaxWidth,
      getMaxHeight: getSplitPanelMaxHeight,
      getHeader: () => splitPanelHeaderRefObject.current,
      disableContentPaddings,
      contentWidthStyles: contentMaxWidthStyle,
      isOpen: splitPanelOpen,
      isMobile,
      isRefresh: false,
      isForcedPosition,
      lastInteraction: splitPanelLastInteraction,
      splitPanelRef,
      splitPanelHeaderRef,
      onResize: onSplitPanelSizeSet,
      onToggle,
      onPreferencesChange: onSplitPanelPreferencesSet,
      reportSize: setSplitPanelReportedSize,
    };

    const contentWrapperProps: ContentWrapperProps = {
      navigationPadding: navigationHide || !!navigationOpen,
      toolsPadding:
        // tools padding is displayed in one of the three cases
        // 1. Nothing on the that screen edge (no tools panel and no split panel)
        (toolsHide && (!splitPanel || finalSplitPanePosition !== 'side')) ||
        // 2. Tools panel is present and open
        toolsVisible ||
        // 3. Split panel is open in side position
        splitPanelOpenOnTheSide,
      isMobile,
    };

    const navigationRefs = useFocusControl(navigationOpen);
    const toolsRefs = useFocusControl(toolsOpen);

    useImperativeHandle(
      ref,
      () => ({
        openTools: () => onToolsToggle(true),
        closeNavigationIfNecessary: () => {
          if (isMobile) {
            onNavigationToggle(false);
          }
        },
      }),
      [isMobile, onNavigationToggle, onToolsToggle]
    );

    const splitPanelBottomOffset =
      (!splitPanel || finalSplitPanePosition !== 'bottom'
        ? undefined
        : splitPanelOpen
        ? splitPanelHeight
        : splitPanelHeaderHeight) ?? undefined;

    const contentWidthStyles = !isMobile
      ? { minWidth: defaults.minContentWidth, maxWidth: defaults.maxContentWidth }
      : undefined;

    const isToolsDrawerHidden = disableContentPaddings;

    const toolsDrawerWidth = (() => {
      if (isMobile) {
        return 0;
      }

      const toolsPanelWidth = toolsHide ? 0 : toolsOpen ? toolsWidth : closedDrawerWidth;
      const splitPanelWidth =
        !splitPanel || finalSplitPanePosition !== 'side'
          ? 0
          : splitPanelOpen
          ? splitPanelReportedSize
          : closedDrawerWidth;

      return toolsPanelWidth + splitPanelWidth;
    })();

    const navigationDrawerWidth = (() => {
      if (isMobile) {
        return 0;
      }

      return effectiveNavigationWidth;
    })();

    const contentHeaderProps: DarkHeaderProps = {
      isMobile,
      navigationWidth: effectiveNavigationWidth,
      toolsWidth: disableContentPaddings
        ? 0
        : toolsDrawerWidth
        ? toolsDrawerWidth
        : isToolsDrawerHidden
        ? toggleButtonsBarWidth
        : 0,
    };

    const previousContentWidth = usePreviousFrameValue(
      contentWidthWithSplitPanel - (splitPanelOpenOnTheSide ? splitPanelReportedSize : 0)
    );

    const contentScaleX = (() => {
      if (isMobile || !isMotionEnabled || !disableContentPaddings || !previousContentWidth) {
        return undefined;
      }
    })();

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
            >
              {breadcrumbs}
            </MobileToolbar>
          )}
          <div className={clsx(styles.layout, disableBodyScroll && styles['layout-no-scroll'])}>
            {!navigationHide && (
              <NavigationPanel
                ariaLabels={ariaLabels}
                footerHeight={footerHeight}
                headerHeight={headerHeight}
                isHidden={disableContentPaddings}
                isMobile={isMobile}
                isMotionEnabled={isMotionEnabled}
                navigation={navigation}
                navigationDrawerWidth={navigationDrawerWidth}
                navigationOpen={navigationOpen}
                onClick={isMobile ? onNavigationClick : undefined}
                onNavigationToggle={onNavigationToggle}
                panelHeightStyle={panelHeightStyle}
                toggleRefs={navigationRefs}
                navigationWidth={navigationWidth}
              />
            )}
            <main
              ref={legacyScrollRootRef}
              className={clsx(styles['layout-main'], {
                [styles['layout-main-scrollable']]: disableBodyScroll,
                [styles.unfocusable]: isMobile && anyPanelOpen,
              })}
            >
              <div
                style={{
                  marginBottom: splitPanelBottomOffset,
                  transform: contentScaleX ? `scaleX(${contentScaleX})` : undefined,
                }}
              >
                {notifications && (
                  <DarkHeader
                    {...contentHeaderProps}
                    topOffset={headerHeight}
                    sticky={!isMobile && darkStickyHeaderContentType && stickyNotifications}
                  >
                    <Notifications
                      testUtilsClassName={clsx(styles.notifications, testutilStyles.notifications)}
                      labels={ariaLabels}
                      topOffset={headerHeight}
                      sticky={!isMobile && stickyNotifications}
                      ref={notificationsRef}
                      isMobile={isMobile}
                      navigationPadding={contentWrapperProps.navigationPadding}
                      toolsPadding={contentWrapperProps.toolsPadding}
                      contentWidthStyles={contentWidthStyles}
                    >
                      {notifications}
                    </Notifications>
                  </DarkHeader>
                )}
                {((!isMobile && breadcrumbs) || contentHeader) && (
                  <DarkHeader {...contentHeaderProps}>
                    <ContentWrapper {...contentWrapperProps} contentWidthStyles={contentWidthStyles}>
                      {!isMobile && breadcrumbs && (
                        <div
                          className={clsx(
                            styles.breadcrumbs,
                            testutilStyles.breadcrumbs,
                            styles['breadcrumbs-desktop'],
                            darkStickyHeaderContentType && styles['breadcrumbs-desktop-sticky-header']
                          )}
                        >
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
                  </DarkHeader>
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
                    !hasRenderedNotifications &&
                      !breadcrumbs &&
                      !isMobile &&
                      !contentHeader &&
                      styles['content-wrapper-first-child']
                  )}
                >
                  <AppLayoutDomContext.RootProvider
                    value={{
                      stickyOffsetTop:
                        headerHeight + (stickyNotificationsHeight !== null ? stickyNotificationsHeight : 0),
                      stickyOffsetBottom: footerHeight + (splitPanelBottomOffset || 0),
                    }}
                    // eslint-disable-next-line react/forbid-component-props
                    className={clsx(
                      styles.content,
                      testutilStyles.content,
                      !disableContentHeaderOverlap && contentHeader && styles['content-overlapped']
                    )}
                    style={contentWidthStyles}
                  >
                    {content}
                  </AppLayoutDomContext.RootProvider>
                </ContentWrapper>
              </div>
              {finalSplitPanePosition === 'bottom' && (
                <SplitPanelWrapper context={splitPanelContext}>{splitPanel}</SplitPanelWrapper>
              )}
            </main>

            <ToolsAndSplitPanel
              splitPanel={finalSplitPanePosition === 'side' ? splitPanel : undefined}
              ariaLabels={ariaLabels}
              closedDrawerWidth={closedDrawerWidth}
              contentHeightStyle={contentHeightStyle}
              disableContentPaddings={disableContentPaddings}
              drawerWidth={toolsDrawerWidth}
              footerHeight={footerHeight}
              headerHeight={headerHeight}
              isHidden={isToolsDrawerHidden}
              isMobile={isMobile}
              isMotionEnabled={isMotionEnabled}
              onToolsToggle={onToolsToggle}
              panelHeightStyle={panelHeightStyle}
              splitPanelContext={splitPanelContext}
              splitPanelOpen={splitPanelOpenOnTheSide}
              splitPanelReportedSize={splitPanelReportedSize}
              toggleRefs={toolsRefs}
              tools={tools}
              toolsHide={Boolean(toolsHide)}
              toolsOpen={toolsOpen}
              toolsWidth={toolsWidth}
            />
          </div>
        </div>
      </div>
    );
  }
);

applyDisplayName(AppLayout, 'AppLayout');
export default AppLayout;
