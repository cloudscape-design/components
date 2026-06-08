// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { useMergeRefs, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import { NonCancelableCustomEvent } from '../internal/events';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { isDevelopment } from '../internal/is-development';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { applyDefaults } from './defaults';
import { AppLayoutProps } from './interfaces';
import { AppLayoutInternal } from './internal';
import { useAppLayoutPlacement } from './utils/use-app-layout-placement';
import { useAriaLabels } from './utils/use-aria-labels';

export { AppLayoutProps };

const AppLayout = React.forwardRef(
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
    }: AppLayoutProps,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => {
    if (isDevelopment) {
      if (rest.toolsOpen && rest.toolsHide) {
        warnOnce(
          'AppLayout',
          `You have enabled both the \`toolsOpen\` prop and the \`toolsHide\` prop. This is not supported. Set \`toolsOpen\` to \`false\` when you set \`toolsHide\` to \`true\`.`
        );
      }
    }
    const { __internalRootRef } = useBaseComponent(
      'AppLayout',
      {
        props: {
          contentType,
          disableContentPaddings: rest.disableContentPaddings,
          disableBodyScroll: rest.disableBodyScroll,
          navigationWidth,
          navigationHide: rest.navigationHide,
          toolsHide: rest.toolsHide,
          toolsWidth,
          maxContentWidth,
          minContentWidth,
          stickyNotifications: rest.stickyNotifications,
          disableContentHeaderOverlap: rest.disableContentHeaderOverlap,
        },
        metadata: {
          drawersCount: rest.drawers?.length ?? null,
          hasContentHeader: !!rest.contentHeader,
        },
      },
      analyticsMetadata
    );
    const isRefresh = useVisualRefresh();
    const isMobile = useMobile();

    const ariaLabels = useAriaLabels(rest.ariaLabels);
    const { navigationOpen: defaultNavigationOpen, ...restDefaults } = applyDefaults(
      contentType,
      { maxContentWidth, minContentWidth },
      isRefresh
    );

    const [navigationOpen = false, setNavigationOpen] = useControllable(
      controlledNavigationOpen,
      controlledOnNavigationChange,
      isMobile ? false : defaultNavigationOpen,
      { componentName: 'AppLayout', controlledProp: 'navigationOpen', changeHandler: 'onNavigationChange' }
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
      <div ref={useMergeRefs(__internalRootRef, rootRef)} {...baseProps}>
        <AppLayoutInternal ref={ref} {...props} />
      </div>
    );
  }
);

applyDisplayName(AppLayout, 'AppLayout');
export default AppLayout;
