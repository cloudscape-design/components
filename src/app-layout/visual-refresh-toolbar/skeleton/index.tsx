// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { GeneratedAnalyticsMetadataAppLayoutToolbarComponent } from '../../../app-layout-toolbar/analytics-metadata/interfaces';
import ScreenreaderOnly from '../../../internal/components/screenreader-only';
import VisualContext from '../../../internal/components/visual-context';
import { fireNonCancelableEvent } from '../../../internal/events';
import customCssProps from '../../../internal/generated/custom-css-properties';
import { useGetGlobalBreadcrumbs } from '../../../internal/plugins/helpers/use-global-breadcrumbs';
import { computeVerticalLayout } from '../compute-layout';
import { AppLayoutInternalProps, AppLayoutInternals } from '../interfaces';
import {
  AppLayoutAfterMainSlot,
  AppLayoutBeforeMainSlot,
  AppLayoutBottomContentSlot,
  AppLayoutTopContentSlot,
} from '../internal';
import { useMultiAppLayout } from '../multi-layout';
import { useAppLayout } from '../use-app-layout';
import { useSkeletonSlotsAttributes } from './widget-slots/use-skeleton-slots-attributes';

import testutilStyles from '../../test-classes/styles.css.js';
import styles from './styles.css.js';

type AppLayoutState = ReturnType<typeof useAppLayout>;
type SkeletonSlotsAttributes = ReturnType<typeof useSkeletonSlotsAttributes>;

export interface SkeletonLayoutProps {
  appLayoutProps: AppLayoutInternalProps;
  appLayoutState:
    | (Partial<Omit<AppLayoutState, 'appLayoutInternals'>> & { appLayoutInternals: Partial<AppLayoutInternals> } &
        // these props are excluded from the runtime app layout, because they are critical for the initial rendering
        // to prevent layout shifts
        Partial<ReturnType<typeof useMultiAppLayout>> &
        Partial<{
          hasToolbar: boolean;
          verticalOffsets: ReturnType<typeof computeVerticalLayout>;
        }>)
    | null;
}

export interface RootSkeletonLayoutProps extends SkeletonLayoutProps {
  skeletonSlotsAttributes: SkeletonSlotsAttributes | null;
}

const componentAnalyticsMetadata: GeneratedAnalyticsMetadataAppLayoutToolbarComponent = {
  name: 'awsui.AppLayoutToolbar',
  label: {
    selector: 'h1',
    root: 'body',
  },
};

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
    onNavigationChange,
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
      onNavigationToggle:
        appLayoutState?.appLayoutInternals?.onNavigationToggle ??
        function (open: boolean) {
          fireNonCancelableEvent(onNavigationChange, { open });
        },
      navigationFocusRef: appLayoutState?.appLayoutInternals?.navigationFocusControl?.refs.toggle,
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
      drawersFocusRef: appLayoutState?.appLayoutInternals?.drawersFocusControl?.refs.toggle,
      splitPanel,
      splitPanelToggleProps: {
        ...appLayoutState?.appLayoutInternals?.splitPanelToggleConfig,
        active: Boolean(appLayoutState?.splitPanelOpen),
        controlId: appLayoutState?.appLayoutInternals?.splitPanelControlId,
        position: appLayoutState?.splitPanelPosition ?? 'side',
      },
      splitPanelFocusRef: appLayoutState?.appLayoutInternals?.splitPanelFocusControl?.refs.toggle,
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
  // here we merge runtime and built-time props
  const mergedProps = {
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
        breadcrumbs,
        navigation,
        ariaLabels: appLayoutState?.appLayoutInternals?.ariaLabels ?? ariaLabels,
      },
      toolbarProps,
      registered: !!registered,
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
          {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
          data-awsui-app-layout-widget-loaded={false}
          {...wrapperElAttributes}
          className={wrapperElAttributes?.className ?? clsx(styles.root, testutilStyles.root)}
          style={
            wrapperElAttributes?.style ?? {
              [customCssProps.navigationWidth]: `${navigationWidth}px`,
            }
          }
          ref={ref}
        >
          <AppLayoutBeforeMainSlot {...mergedProps} />
          <main {...mainElAttributes} className={mainElAttributes?.className ?? styles['main-landmark']}>
            <AppLayoutTopContentSlot {...mergedProps} />
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
            <AppLayoutBottomContentSlot {...mergedProps} />
          </main>
          <AppLayoutAfterMainSlot {...mergedProps} />
        </div>
      </VisualContext>
    </>
  );
};
