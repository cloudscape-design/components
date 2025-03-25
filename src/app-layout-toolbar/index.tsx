// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { applyDefaults } from '../app-layout/defaults';
import { AppLayoutProps } from '../app-layout/interfaces';
import { useAppLayoutPlacement } from '../app-layout/utils/use-app-layout-placement';
import AppLayoutToolbarInternal from '../app-layout/visual-refresh-toolbar';
import { AppLayoutToolbarPublicContext } from '../app-layout/visual-refresh-toolbar/contexts';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import VisualContext from '../internal/components/visual-context';
import { NonCancelableCustomEvent } from '../internal/events';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { isDevelopment } from '../internal/is-development';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { AppLayoutToolbarProps } from './interfaces';

export { AppLayoutToolbarProps };

const AppLayoutToolbar = React.forwardRef(
  (
    {
      contentType = 'default',
      headerSelector = '#b #h',
      footerSelector = '#b #f',
      navigationWidth = 280,
      toolsWidth = 290,
      maxContentWidth,
      minContentWidth,
      navigationOpen: controlledNavigationOpen,
      onNavigationChange: controlledOnNavigationChange,
      analyticsMetadata,
      ...rest
    }: AppLayoutToolbarProps,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => {
    const isRefresh = useVisualRefresh();
    if (!isRefresh) {
      throw new Error(
        `AppLayoutToolbar component is not supported in the Classic theme. Please switch to the Refresh theme. For more details, refer to the documentation.`
      );
    }
    if (isDevelopment) {
      if (rest.toolsOpen && rest.toolsHide) {
        warnOnce(
          'AppLayoutToolbar',
          `You have enabled both the \`toolsOpen\` prop and the \`toolsHide\` prop. This is not supported. Set \`toolsOpen\` to \`false\` when you set \`toolsHide\` to \`true\`.`
        );
      }
    }
    const { __internalRootRef } = useBaseComponent<HTMLDivElement>(
      'AppLayoutToolbar',
      {
        props: {
          contentType,
          disableContentPaddings: rest.disableContentPaddings,
          navigationWidth,
          navigationHide: rest.navigationHide,
          toolsHide: rest.toolsHide,
          toolsWidth,
          maxContentWidth,
          minContentWidth,
          stickyNotifications: rest.stickyNotifications,
          disableContentHeaderOverlap: rest.disableContentHeaderOverlap,
          navigationTriggerHide: rest.navigationTriggerHide,
        },
        metadata: {
          drawersCount: rest.drawers?.length ?? null,
          hasContentHeader: !!rest.contentHeader,
        },
      },
      analyticsMetadata
    );
    const isMobile = useMobile();

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
    const { navigationOpen: defaultNavigationOpen, ...restDefaults } = applyDefaults(
      contentType,
      { maxContentWidth, minContentWidth },
      isRefresh
    );

    const [navigationOpen = false, setNavigationOpen] = useControllable(
      controlledNavigationOpen,
      controlledOnNavigationChange,
      isMobile ? false : defaultNavigationOpen,
      { componentName: 'AppLayoutToolbar', controlledProp: 'navigationOpen', changeHandler: 'onNavigationChange' }
    );
    const onNavigationChange = (event: NonCancelableCustomEvent<AppLayoutProps.ChangeDetail>) => {
      setNavigationOpen(event.detail.open);
      controlledOnNavigationChange?.(event);
    };

    const [rootRef, placement] = useAppLayoutPlacement(headerSelector, footerSelector);

    // This re-builds the props including the default values
    const props = {
      contentType,
      navigationWidth,
      toolsWidth,
      navigationOpen,
      onNavigationChange,
      ...restDefaults,
      ...rest,
      ariaLabels,
      placement,
    };

    const baseProps = getBaseProps(rest);

    return (
      <AppLayoutToolbarPublicContext.Provider value={true}>
        <div ref={useMergeRefs(__internalRootRef, rootRef)} {...baseProps}>
          <VisualContext contextName="app-layout-toolbar">
            <AppLayoutToolbarInternal ref={ref} {...props} />
          </VisualContext>
        </div>
      </AppLayoutToolbarPublicContext.Provider>
    );
  }
);

applyDisplayName(AppLayoutToolbar, 'AppLayoutToolbar');
export default AppLayoutToolbar;
