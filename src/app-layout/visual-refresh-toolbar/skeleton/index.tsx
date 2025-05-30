// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import ScreenreaderOnly from '../../../internal/components/screenreader-only';
import VisualContext from '../../../internal/components/visual-context';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { useGetGlobalBreadcrumbs } from '../../../internal/plugins/helpers/use-global-breadcrumbs';
import { computeVerticalLayout } from '../compute-layout';
import { AppLayoutInternalProps } from '../interfaces';
import {
  AppLayoutSkeletonBottomContentSlot,
  AppLayoutSkeletonSideSlot,
  AppLayoutSkeletonTopContentSlot,
  AppLayoutSkeletonTopSlot,
} from '../internal';
import { useMultiAppLayout } from '../multi-layout';
import { useAppLayout } from '../use-app-layout';
import { useSkeletonSlotsAttributes } from './widget-slots/use-skeleton-slots-attributes';

import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

export interface SkeletonLayoutProps {
  appLayoutProps: AppLayoutInternalProps;
  appLayoutState:
    | (ReturnType<typeof useAppLayout> &
        Partial<ReturnType<typeof useMultiAppLayout>> &
        Partial<{
          hasToolbar: boolean;
          verticalOffsets: ReturnType<typeof computeVerticalLayout>;
        }>)
    | null;
}

export interface RootSkeletonLayoutProps extends SkeletonLayoutProps {
  skeletonSlotsAttributes: ReturnType<typeof useSkeletonSlotsAttributes> | null;
}

export const SkeletonLayout = (props: RootSkeletonLayoutProps) => {
  const { appLayoutProps, appLayoutState, skeletonSlotsAttributes } = props;
  const {
    contentHeader,
    content,
    navigationWidth,
    navigationTriggerHide,
    breadcrumbs,
    toolsHide,
    splitPanel,
    placement,
    navigationHide,
    ariaLabels,
    navigation,
    navigationOpen,
    ...rest
  } = appLayoutProps;

  const ref = useMergeRefs(appLayoutState?.intersectionObserverRef, appLayoutState?.rootRef);
  const { __forceDeduplicationType: forceDeduplicationType, __embeddedViewMode: embeddedViewMode } = rest as any;
  //navigation must be null if hidden so toolbar knows to hide the toggle button
  const resolvedNavigation = navigationHide ? null : navigation || <></>;
  //navigation must not be open if navigationHide is true
  const resolvedNavigationOpen = !!resolvedNavigation && navigationOpen;
  const { registered, toolbarProps } = useMultiAppLayout(
    {
      forceDeduplicationType,
      ariaLabels: appLayoutState?.appLayoutInternals?.ariaLabels ?? ariaLabels,
      navigation: resolvedNavigation && !navigationTriggerHide,
      navigationOpen: Boolean(resolvedNavigationOpen),
      onNavigationToggle: appLayoutState?.appLayoutInternals?.onNavigationToggle ?? function () {},
      navigationFocusRef: appLayoutState?.appLayoutInternals?.navigationFocusControl.refs.toggle,
      breadcrumbs,
      activeDrawerId: appLayoutState?.activeDrawer?.id ?? null,
      // only pass it down if there are non-empty drawers or tools
      drawers: appLayoutState?.drawers?.length || !toolsHide ? appLayoutState?.drawers : undefined,
      globalDrawersFocusControl: appLayoutState?.appLayoutInternals?.globalDrawersFocusControl,
      globalDrawers: appLayoutState?.appLayoutInternals?.globalDrawers?.length
        ? appLayoutState?.appLayoutInternals?.globalDrawers
        : undefined,
      activeGlobalDrawersIds: appLayoutState?.activeGlobalDrawersIds,
      onActiveGlobalDrawersChange: appLayoutState?.appLayoutInternals?.onActiveGlobalDrawersChange,
      onActiveDrawerChange: appLayoutState?.appLayoutInternals?.onActiveDrawerChange,
      drawersFocusRef: appLayoutState?.appLayoutInternals?.drawersFocusControl.refs.toggle,
      splitPanel,
      splitPanelToggleProps: {
        ...appLayoutState?.appLayoutInternals?.splitPanelToggleConfig,
        active: Boolean(appLayoutState?.splitPanelOpen),
        controlId: appLayoutState?.appLayoutInternals?.splitPanelControlId,
        position: appLayoutState?.splitPanelPosition ?? 'side',
      },
      splitPanelFocusRef: appLayoutState?.appLayoutInternals?.splitPanelFocusControl.refs.toggle,
      onSplitPanelToggle: appLayoutState?.appLayoutInternals?.onSplitPanelToggle ?? function () {},
      expandedDrawerId: appLayoutState?.expandedDrawerId,
      setExpandedDrawerId: appLayoutState?.setExpandedDrawerId ?? function () {},
    },
    appLayoutState?.isIntersecting ?? true
  );
  const hasToolbar = !embeddedViewMode && !!toolbarProps;
  const discoveredBreadcrumbs = useGetGlobalBreadcrumbs(hasToolbar && !breadcrumbs);
  const verticalOffsets = computeVerticalLayout({
    topOffset: placement.insetBlockStart,
    hasVisibleToolbar: hasToolbar && appLayoutState?.appLayoutInternals?.toolbarState !== 'hide',
    notificationsHeight: appLayoutState?.notificationsHeight ?? 0,
    toolbarHeight: appLayoutState?.toolbarHeight ?? 0,
    stickyNotifications: Boolean(appLayoutState?.appLayoutInternals?.stickyNotifications),
  });
  const combinedProps = {
    ...props,
    appLayoutState: {
      ...appLayoutState,
      appLayoutInternals: {
        ...appLayoutState?.appLayoutInternals,
        globalDrawers: appLayoutState?.appLayoutInternals?.globalDrawers ?? [],
        discoveredBreadcrumbs,
        verticalOffsets,
        placement,
        navigationOpen: resolvedNavigationOpen,
      },
      toolbarProps,
      registered,
      hasToolbar,
      verticalOffsets,
      resolvedNavigation: appLayoutState?.resolvedNavigation ?? resolvedNavigation,
      resolvedNavigationOpen: appLayoutState?.resolvedNavigationOpen ?? resolvedNavigationOpen,
    },
  };
  const {
    wrapperElAttributes,
    mainElAttributes,
    getContentWrapperElAttributes,
    contentHeaderElAttributes,
    contentElAttributes,
  } = skeletonSlotsAttributes ?? {};

  const contentWrapperElAttributes = getContentWrapperElAttributes?.(toolbarProps, verticalOffsets);

  return (
    <>
      {/* Rendering a hidden copy of breadcrumbs to trigger their deduplication */}
      {!hasToolbar && breadcrumbs ? <ScreenreaderOnly>{breadcrumbs}</ScreenreaderOnly> : null}
      <VisualContext contextName="app-layout-toolbar">
        <div
          {...wrapperElAttributes}
          className={wrapperElAttributes?.className ?? clsx(styles.root, testutilStyles.root)}
          style={
            wrapperElAttributes?.style ?? {
              [customCssProps.navigationWidth]: `${navigationWidth}px`,
            }
          }
          ref={ref}
        >
          <AppLayoutSkeletonTopSlot {...(combinedProps as any)} />
          <main {...mainElAttributes} className={mainElAttributes?.className ?? styles['main-landmark']}>
            <AppLayoutSkeletonTopContentSlot {...(combinedProps as any)} />
            <div
              {...contentWrapperElAttributes}
              className={
                contentWrapperElAttributes?.className ??
                clsx(styles.main, { [styles['main-disable-paddings']]: appLayoutProps.disableContentPaddings })
              }
            >
              {contentHeader && <div {...contentHeaderElAttributes}>{contentHeader}</div>}
              {/*delay rendering the content until registration of this instance is complete*/}
              <div {...contentElAttributes} className={contentElAttributes?.className ?? testutilStyles.content}>
                {registered ? content : null}
              </div>
            </div>
            <AppLayoutSkeletonBottomContentSlot {...(combinedProps as any)} />
          </main>
          <AppLayoutSkeletonSideSlot {...(combinedProps as any)} />
        </div>
      </VisualContext>
    </>
  );
};
