// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { useMergeRefs } from '../../internal/hooks/use-merge-refs';
import globalVars from '../../internal/styles/global-vars';
import { AppLayoutProps } from '../interfaces';
import { ActiveDrawersContext } from '../utils/visibility-context';
import { AppLayoutVisibilityContext } from './contexts';
import { AppLayoutInternalProps } from './interfaces';
import {
  AppLayoutDrawer,
  AppLayoutGlobalDrawers,
  AppLayoutNavigation,
  AppLayoutNotifications,
  AppLayoutSkeletonLayout,
  AppLayoutSplitPanelBottom,
  AppLayoutSplitPanelSide,
  AppLayoutToolbar,
} from './internal';
import { useAppLayout } from './use-app-layout';

const AppLayoutVisualRefreshToolbar = React.forwardRef<AppLayoutProps.Ref, AppLayoutInternalProps>(
  (props, forwardRef) => {
    const {
      contentHeader,
      content,
      navigationWidth,
      contentType,
      headerVariant,
      breadcrumbs,
      notifications,
      splitPanel,
      disableContentPaddings,
      minContentWidth,
      maxContentWidth,
      placement,
    } = props;

    const {
      navigationAnimationDisabled,
      isNested,
      isIntersecting,
      hasToolbar,
      intersectionObserverRef,
      rootRef,
      splitPanelOffsets,
      verticalOffsets,
      isMobile,
      appLayoutInternals,
      toolbarProps,
      registered,
      resolvedNavigation,
      resolvedNavigationOpen,
      drawers,
      activeGlobalDrawersIds,
      activeDrawer,
      activeDrawerSize,
      splitPanelPosition,
      splitPanelOpen,
      splitPanelInternals,
    } = useAppLayout(props, forwardRef);

    return (
      <AppLayoutVisibilityContext.Provider value={isIntersecting}>
        {/* Rendering a hidden copy of breadcrumbs to trigger their deduplication */}
        {!hasToolbar && breadcrumbs ? <ScreenreaderOnly>{breadcrumbs}</ScreenreaderOnly> : null}
        <AppLayoutSkeletonLayout
          rootRef={useMergeRefs(intersectionObserverRef, rootRef)}
          isNested={isNested}
          style={{
            paddingBlockEnd: splitPanelOffsets.mainContentPaddingBlockEnd,
            ...(hasToolbar || !isNested
              ? {
                  [globalVars.stickyVerticalTopOffset]: `${verticalOffsets.header}px`,
                  [globalVars.stickyVerticalBottomOffset]: `${splitPanelOffsets.stickyVerticalBottomOffset}px`,
                }
              : {}),
            ...(!isMobile ? { minWidth: `${minContentWidth}px` } : {}),
          }}
          toolbar={
            hasToolbar && <AppLayoutToolbar appLayoutInternals={appLayoutInternals} toolbarProps={toolbarProps!} />
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
          navigationOpen={resolvedNavigationOpen}
          navigationWidth={navigationWidth}
          navigationAnimationDisabled={navigationAnimationDisabled}
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
      </AppLayoutVisibilityContext.Provider>
    );
  }
);

export default AppLayoutVisualRefreshToolbar;
