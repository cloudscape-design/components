// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { useMergeRefs, useStableCallback, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { SplitPanelSideToggleProps } from '../../../internal/context/split-panel-context';
import { fireNonCancelableEvent } from '../../../internal/events';
import { useControllable } from '../../../internal/hooks/use-controllable';
import { useIntersectionObserver } from '../../../internal/hooks/use-intersection-observer';
import { useMobile } from '../../../internal/hooks/use-mobile';
import { metrics } from '../../../internal/metrics';
import { useGetGlobalBreadcrumbs } from '../../../internal/plugins/helpers/use-global-breadcrumbs';
import { WidgetMessage } from '../../../internal/plugins/widget/interfaces';
import globalVars from '../../../internal/styles/global-vars';
import { getSplitPanelDefaultSize } from '../../../split-panel/utils/size-utils';
import { AppLayoutProps } from '../../interfaces';
import { SplitPanelProviderProps } from '../../split-panel';
import { MIN_DRAWER_SIZE, OnChangeParams, useDrawers } from '../../utils/use-drawers';
import { useAsyncFocusControl, useMultipleFocusControl } from '../../utils/use-focus-control';
import { useGlobalScrollPadding } from '../../utils/use-global-scroll-padding';
import { useSplitPanelFocusControl } from '../../utils/use-split-panel-focus-control';
import {
  computeHorizontalLayout,
  computeSplitPanelOffsets,
  computeVerticalLayout,
  CONTENT_PADDING,
} from '../compute-layout';
import { AppLayoutState } from '../interfaces';
import { AppLayoutInternalProps, AppLayoutInternals } from '../interfaces';
import { useAiDrawer } from './use-ai-drawer';
import { useBottomDrawers } from './use-bottom-drawers';
import { useFeatureNotifications } from './use-feature-notifications';
import { useWidgetMessages } from './use-widget-messages';

export const useAppLayout = (
  hasToolbar: boolean,
  {
    ariaLabels,
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
    headerVariant,
    breadcrumbs,
    stickyNotifications,
    splitPanelPreferences: controlledSplitPanelPreferences,
    splitPanelOpen: controlledSplitPanelOpen,
    splitPanel,
    splitPanelSize: controlledSplitPanelSize,
    onSplitPanelToggle,
    onSplitPanelResize,
    onSplitPanelPreferencesChange,
    minContentWidth,
    placement,
    navigationTriggerHide,
    ...rest
  }: AppLayoutInternalProps,
  forwardRef: ForwardedRef<AppLayoutProps.Ref>
): AppLayoutState => {
  const isMobile = useMobile();
  const splitPanelControlId = useUniqueId('split-panel');
  const [toolbarState, setToolbarState] = useState<'show' | 'hide'>('show');
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const [notificationsHeight, setNotificationsHeight] = useState(0);
  const [navigationAnimationDisabled, setNavigationAnimationDisabled] = useState(true);
  const [splitPanelAnimationDisabled, setSplitPanelAnimationDisabled] = useState(true);
  const [isNested, setIsNested] = useState(false);
  const [expandedDrawerId, setInternalExpandedDrawerId] = useState<string | null>(null);
  const rootRefInternal = useRef<HTMLDivElement>(null);
  // This workaround ensures the ref is defined before checking if the app layout is nested.
  // On initial render, the ref might be undefined because this component loads asynchronously via the widget API.
  const onMountRootRef = useCallback(node => {
    setIsNested(getIsNestedInAppLayout(node));
  }, []);

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

  const setExpandedDrawerId = (value: string | null) => {
    setInternalExpandedDrawerId(value);

    if (aiDrawer?.onToggleFocusMode && (value === aiDrawer?.id || value === null)) {
      fireNonCancelableEvent(aiDrawer.onToggleFocusMode, {
        isExpanded: !!value,
      });
    }
  };

  const onGlobalDrawerFocus = (drawerId: string, open: boolean) => {
    globalDrawersFocusControl.setFocus({ force: true, drawerId, open });
  };

  const onAddNewActiveDrawer = (drawerId: string) => {
    // If either a local drawer or a bottom drawer is already open, and we attempt to open a new one,
    // it will replace the existing one instead of opening an additional drawer,
    // since only one local drawer is supported. Therefore, layout calculations are not necessary.
    if ((activeDrawer && drawers?.find(drawer => drawer.id === drawerId)) || activeGlobalBottomDrawerId === drawerId) {
      return;
    }
    // get the size of drawerId. it could be either local or global drawer
    const combinedDrawers = [...(drawers || []), ...globalDrawers];
    const newDrawer = combinedDrawers.find(drawer => drawer.id === drawerId);
    if (!newDrawer) {
      return;
    }
    const newDrawerSize = Math.min(newDrawer.defaultSize ?? drawerSizes[drawerId] ?? MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);
    //   check if the active drawers could be resized to fit the new drawers
    //   to do this, we need to take all active drawers, sum up their min sizes, truncate it from resizableSpaceAvailable
    //   and compare a given number with the new drawer id min size

    // the total size of all global drawers resized to their min size
    const availableSpaceForNewDrawer = resizableSpaceAvailable - totalActiveDrawersMinSize;
    if (availableSpaceForNewDrawer >= newDrawerSize) {
      return;
    }

    // now we made sure we cannot accommodate the new drawer with existing ones
    closeFirstDrawer();
  };

  const onGlobalBottomDrawerFocus = () => {
    bottomDrawersFocusControl.setFocus();
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
  } = useDrawers(
    {
      ...rest,
      onGlobalDrawerFocus,
      onAddNewActiveDrawer,
      expandedDrawerId,
      setExpandedDrawerId,
    },
    ariaLabels,
    {
      ariaLabels,
      toolsHide,
      toolsOpen,
      tools,
      toolsWidth,
      onToolsToggle,
    }
  );
  const {
    aiDrawer,
    aiDrawerMessageHandler,
    onActiveAiDrawerChange,
    activeAiDrawer,
    activeAiDrawerId,
    activeAiDrawerSize,
    minAiDrawerSize,
    onActiveAiDrawerResize,
  } = useAiDrawer({
    getMaxAiDrawerSize: () => maxAiDrawerSize,
    onAiDrawerFocus: () => aiDrawerFocusControl.setFocus(),
    expandedDrawerId,
    setExpandedDrawerId,
  });
  const aiDrawerFocusControl = useAsyncFocusControl(!!activeAiDrawer?.id, true, activeAiDrawer?.id);

  const {
    bottomDrawers,
    activeBottomDrawer,
    onActiveBottomDrawerChange: onActiveGlobalBottomDrawerChange,
    activeBottomDrawerSize: activeGlobalBottomDrawerSize,
    minBottomDrawerSize: minGlobalBottomDrawerSize,
    onActiveBottomDrawerResize,
    bottomDrawersMessageHandler,
  } = useBottomDrawers({
    onBottomDrawerFocus: onGlobalBottomDrawerFocus,
    expandedDrawerId,
    setExpandedDrawerId,
    drawersOpenQueue,
  });
  const activeGlobalBottomDrawerId = activeBottomDrawer?.id ?? null;

  const { featureNotificationsProps, featureNotificationsMessageHandler } = useFeatureNotifications({
    activeDrawersIds: [...activeGlobalDrawersIds, ...(activeDrawer ? [activeDrawer.id] : [])],
  });

  const checkAIDrawerIdExists = (id: string) => {
    return aiDrawer?.id === id;
  };

  const checkBottomDrawerIdExists = (id: string) => {
    return !!bottomDrawers.find(drawer => drawer.id === id);
  };

  const checkDrawerIdExists = (id: string) => {
    return checkAIDrawerIdExists(id) || checkBottomDrawerIdExists(id);
  };

  const drawerGenericMessageHandler = (message: WidgetMessage) => {
    switch (message.type) {
      case 'expandDrawer':
        if (!checkDrawerIdExists(message.payload.id)) {
          metrics.sendOpsMetricObject('awsui-widget-drawer-incorrect-id', {
            id: message.payload.id,
            type: message.type,
            bottomDrawers: bottomDrawers.map(drawer => drawer.id).join(','),
            aiDrawer: aiDrawer?.id ?? '',
          });
        }
        setExpandedDrawerId(message.payload.id);
        break;
      case 'exitExpandedMode':
        setExpandedDrawerId(null);
        break;
    }
  };

  useWidgetMessages(hasToolbar, message => {
    if (message.type === 'expandDrawer' || message.type === 'exitExpandedMode') {
      drawerGenericMessageHandler(message);
      return;
    }

    if (message.type === 'registerFeatureNotifications' || message.type === 'showFeaturePromptIfPossible') {
      featureNotificationsMessageHandler(message);
      return;
    }

    if (!('payload' in message && 'id' in message.payload)) {
      metrics.sendOpsMetricObject('awsui-widget-drawer-incorrect-payload', {
        type: message.type,
        bottomDrawers: bottomDrawers.map(drawer => drawer.id).join(','),
        aiDrawer: aiDrawer?.id ?? '',
      });
      return;
    }

    const { id } = message.payload;

    if (checkAIDrawerIdExists(id) || message.type === 'registerLeftDrawer') {
      aiDrawerMessageHandler(message);
      return;
    }

    if (checkBottomDrawerIdExists(id) || message.type === 'registerBottomDrawer') {
      bottomDrawersMessageHandler(message);
      return;
    }

    metrics.sendOpsMetricObject('awsui-widget-drawer-incorrect-id', {
      id,
      type: message.type,
      bottomDrawers: bottomDrawers.map(drawer => drawer.id).join(','),
      aiDrawer: aiDrawer?.id ?? '',
    });
  });

  const onActiveDrawerChangeHandler = (
    drawerId: string | null,
    params: OnChangeParams = { initiatedByUserAction: true }
  ) => {
    onActiveDrawerChange(drawerId, params);
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
    setSplitPanelAnimationDisabled(false);
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
  const [splitPanelHeaderBlockSize, setSplitPanelHeaderBlockSize] = useState(0);

  const onSplitPanelResizeHandler = (size: number) => {
    setSplitPanelSize(size);
    fireNonCancelableEvent(onSplitPanelResize, { size });
  };

  const [splitPanelToggleConfig, setSplitPanelToggleConfig] = useState<SplitPanelSideToggleProps>({
    ariaLabel: undefined,
    displayed: false,
  });

  const [bottomDrawerReportedSize, setBottomDrawerReportedSize] = useState(0);

  const globalDrawersFocusControl = useMultipleFocusControl(true, activeGlobalDrawersIds);
  const drawersFocusControl = useAsyncFocusControl(!!activeDrawer?.id, true, activeDrawer?.id);
  const bottomDrawersFocusControl = useAsyncFocusControl(
    !!activeGlobalBottomDrawerId,
    true,
    activeGlobalBottomDrawerId
  );
  const navigationFocusControl = useAsyncFocusControl(navigationOpen, navigationTriggerHide);
  const splitPanelFocusControl = useSplitPanelFocusControl([splitPanelPreferences, splitPanelOpen]);

  const onNavigationToggle = useStableCallback(({ isOpen, autoFocus }: { isOpen: boolean; autoFocus: boolean }) => {
    setNavigationAnimationDisabled(false);
    navigationFocusControl.setFocus({ force: false, autoFocus });
    fireNonCancelableEvent(onNavigationChange, { open: isOpen });
  });

  useImperativeHandle(forwardRef, () => ({
    closeNavigationIfNecessary: () => isMobile && onNavigationToggle({ isOpen: false, autoFocus: true }),
    openTools: () => onToolsToggle(true),
    focusToolsClose: () => drawersFocusControl.setFocus({ force: true }),
    focusActiveDrawer: () => drawersFocusControl.setFocus({ force: true }),
    focusSplitPanel: () => splitPanelFocusControl.setLastInteraction({ type: 'open' }),
    focusNavigation: () => navigationFocusControl.setFocus({ force: true }),
  }));

  const resolvedStickyNotifications = !!stickyNotifications && !isMobile;
  //navigation must be null if hidden so toolbar knows to hide the toggle button
  const resolvedNavigation = navigationHide ? null : navigation || <></>;
  //navigation must not be open if navigationHide is true
  const resolvedNavigationOpen = !!resolvedNavigation && navigationOpen;
  const {
    maxDrawerSize,
    maxSplitPanelSize,
    splitPanelForcedPosition,
    splitPanelPosition,
    maxGlobalDrawersSizes,
    resizableSpaceAvailable,
    maxAiDrawerSize,
  } = computeHorizontalLayout({
    activeDrawerSize: activeDrawer ? activeDrawerSize : 0,
    splitPanelSize,
    minContentWidth,
    navigationOpen: resolvedNavigationOpen,
    navigationWidth,
    placement,
    splitPanelOpen,
    splitPanelPosition: splitPanelPreferences?.position,
    isMobile,
    activeGlobalDrawersSizes,
    activeAiDrawerSize,
  });

  const verticalOffsets = computeVerticalLayout({
    topOffset: placement.insetBlockStart,
    hasVisibleToolbar: hasToolbar && toolbarState !== 'hide',
    notificationsHeight: notificationsHeight ?? 0,
    toolbarHeight: toolbarHeight ?? 0,
    stickyNotifications: resolvedStickyNotifications,
  });

  const { ref: intersectionObserverRef, isIntersecting } = useIntersectionObserver({ initialState: true });

  const rootRef = useMergeRefs(rootRefInternal, intersectionObserverRef, onMountRootRef);

  const discoveredBreadcrumbs = useGetGlobalBreadcrumbs(hasToolbar && !breadcrumbs);

  useGlobalScrollPadding(verticalOffsets.header ?? 0);

  const getMaxGlobalBottomDrawerHeight = useCallback(() => {
    const splitPanelSize = splitPanelOpen && splitPanelPosition === 'bottom' ? splitPanelReportedSize : 0;
    const availableHeight =
      document.documentElement.clientHeight - placement.insetBlockStart - placement.insetBlockEnd - splitPanelSize;

    // skip reading sizes in JSDOM
    if (availableHeight === 0) {
      return Infinity;
    }

    // If the page is likely zoomed in at 200%, allow the split panel to fill the content area.
    return availableHeight < 400 ? availableHeight - 40 : availableHeight - 250;
  }, [splitPanelOpen, splitPanelPosition, splitPanelReportedSize, placement.insetBlockStart, placement.insetBlockEnd]);

  const appLayoutInternals: AppLayoutInternals = {
    ariaLabels: ariaLabelsWithDrawers,
    headerVariant,
    isMobile,
    breadcrumbs,
    discoveredBreadcrumbs,
    stickyNotifications: resolvedStickyNotifications,
    navigationOpen: resolvedNavigationOpen,
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
    drawersOpenQueue: drawersOpenQueue.current,
    setToolbarHeight,
    setNotificationsHeight,
    onSplitPanelToggle: onSplitPanelToggleHandler,
    onNavigationToggle: isOpen => onNavigationToggle({ isOpen, autoFocus: true }),
    onActiveDrawerChange: onActiveDrawerChangeHandler,
    onActiveDrawerResize,
    splitPanelAnimationDisabled,
    expandedDrawerId,
    setExpandedDrawerId,
    aiDrawer,
    onActiveAiDrawerChange,
    activeAiDrawer,
    activeAiDrawerId,
    activeAiDrawerSize,
    minAiDrawerSize,
    maxAiDrawerSize,
    aiDrawerFocusControl,
    onActiveAiDrawerResize,
  };

  const splitPanelInternals: SplitPanelProviderProps = {
    bottomOffset: 0,
    getMaxHeight: useCallback(() => {
      const bottomDrawerHeight = activeGlobalBottomDrawerId ? bottomDrawerReportedSize : 0;
      const availableHeight =
        document.documentElement.clientHeight -
        placement.insetBlockStart -
        placement.insetBlockEnd -
        bottomDrawerHeight;
      // If the page is likely zoomed in at 200%, allow the split panel to fill the content area.
      return availableHeight < 400 ? availableHeight - 40 : availableHeight - 250;
    }, [activeGlobalBottomDrawerId, bottomDrawerReportedSize, placement.insetBlockEnd, placement.insetBlockStart]),
    maxWidth: maxSplitPanelSize,
    isForcedPosition: splitPanelForcedPosition,
    isOpen: splitPanelOpen,
    leftOffset: 0,
    onPreferencesChange: onSplitPanelPreferencesChangeHandler,
    onResize: onSplitPanelResizeHandler,
    onToggle: onSplitPanelToggleHandler,
    position: splitPanelPosition,
    reportSize: useStableCallback(size => setSplitPanelReportedSize(size)),
    reportHeaderHeight: useStableCallback(size => setSplitPanelHeaderBlockSize(size)),
    headerHeight: splitPanelHeaderBlockSize,
    rightOffset: 0,
    size: splitPanelSize,
    topOffset: 0,
    setSplitPanelToggle: setSplitPanelToggleConfig,
    refs: splitPanelFocusControl.refs,
  };

  const closeFirstDrawer = useStableCallback(() => {
    let drawerToClose = drawersOpenQueue.current[drawersOpenQueue.current.length - 1];
    if (drawerToClose === activeBottomDrawer?.id) {
      drawerToClose = drawersOpenQueue.current[drawersOpenQueue.current.length - 2];
    }
    if (activeDrawer && activeDrawer?.id === drawerToClose) {
      onActiveDrawerChange(null, { initiatedByUserAction: true });
    } else if (activeGlobalDrawersIds.includes(drawerToClose)) {
      onActiveGlobalDrawersChange(drawerToClose, { initiatedByUserAction: true });
    }
  });

  useEffect(() => {
    // Close navigation drawer on mobile so that the main content is visible
    if (isMobile) {
      onNavigationToggle({ isOpen: false, autoFocus: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const getTotalActiveDrawersMinSize = () => {
    const combinedDrawers = [...(drawers || []), ...globalDrawers];
    let result = activeGlobalDrawersIds
      .map(activeDrawerId =>
        Math.min(
          combinedDrawers.find(drawer => drawer.id === activeDrawerId)?.defaultSize ?? MIN_DRAWER_SIZE,
          MIN_DRAWER_SIZE
        )
      )
      .reduce((acc, curr) => acc + curr, 0);
    if (activeDrawer) {
      result += Math.min(activeDrawer?.defaultSize ?? MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);
    }
    if (activeAiDrawer) {
      result += Math.min(activeAiDrawer?.defaultSize ?? MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);
    }

    return result;
  };

  const totalActiveDrawersMinSize = getTotalActiveDrawersMinSize();

  useEffect(() => {
    if (isMobile) {
      return;
    }

    const activeNavigationWidth = !navigationHide && navigationOpen ? navigationWidth : 0;
    const scrollWidth = activeNavigationWidth + CONTENT_PADDING + totalActiveDrawersMinSize;
    const hasHorizontalScroll = scrollWidth > placement.inlineSize;
    if (hasHorizontalScroll) {
      if (!navigationHide && navigationOpen) {
        onNavigationToggle({ isOpen: false, autoFocus: false });
        return;
      }

      closeFirstDrawer();
    }
  }, [
    totalActiveDrawersMinSize,
    closeFirstDrawer,
    isMobile,
    navigationHide,
    navigationOpen,
    navigationWidth,
    onNavigationToggle,
    placement.inlineSize,
  ]);

  /**
   * Returns true if the AppLayout is nested
   * Does not apply to iframe
   */
  const getIsNestedInAppLayout = (element: HTMLElement | null): boolean => {
    let currentElement: Element | null = element?.parentElement ?? null;

    // this traverse is needed only for JSDOM
    // in real browsers the globalVar will be propagated to all descendants and this loops exits after initial iteration
    while (currentElement) {
      if (getComputedStyle(currentElement).getPropertyValue(globalVars.stickyVerticalTopOffset)) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }

    return false;
  };

  const splitPanelOffsets = computeSplitPanelOffsets({
    placement,
    hasSplitPanel: !!splitPanel,
    splitPanelOpen,
    splitPanelPosition,
    splitPanelFullHeight: splitPanelReportedSize,
    splitPanelHeaderHeight: splitPanelHeaderBlockSize,
  });

  return {
    rootRef,
    isIntersecting,
    appLayoutInternals,
    splitPanelInternals,
    widgetizedState: {
      ...appLayoutInternals,
      aiDrawerExpandedMode: expandedDrawerId === activeAiDrawer?.id,
      isNested,
      navigationAnimationDisabled,
      verticalOffsets,
      splitPanelOffsets,
      activeGlobalBottomDrawerId,
      onActiveGlobalBottomDrawerChange,
      activeGlobalBottomDrawerSize,
      bottomDrawerReportedSize,
      minGlobalBottomDrawerSize,
      getMaxGlobalBottomDrawerHeight,
      reportBottomDrawerSize: useStableCallback(size => setBottomDrawerReportedSize(size)),
      onActiveBottomDrawerResize,
      bottomDrawers,
      bottomDrawersFocusControl,
      featureNotificationsProps,
    },
  };
};
