// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { AppLayoutProps } from './interfaces';
import { AppLayoutInternal } from './internal';

export { AppLayoutProps };

const AppLayout = React.forwardRef(
  (
    { contentType = 'default', headerSelector = '#b #h', footerSelector = '#b #f', ...rest }: AppLayoutProps,
    ref: React.Ref<AppLayoutProps.Ref>
  ) => {
    const { __internalRootRef } = useBaseComponent<HTMLDivElement>('AppLayout', {
      props: {
        contentType,
        disableContentPaddings: rest.disableContentPaddings,
        disableBodyScroll: rest.disableBodyScroll,
        navigationWidth: rest.navigationWidth,
        navigationHide: rest.navigationHide,
        toolsHide: rest.toolsHide,
        toolsWidth: rest.toolsWidth,
        maxContentWidth: rest.maxContentWidth,
        minContentWidth: rest.minContentWidth,
        stickyNotifications: rest.stickyNotifications,
        disableContentHeaderOverlap: rest.disableContentHeaderOverlap,
      },
    });

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
        <AppLayoutInternal ref={ref} {...props} />
      </div>
    );
  }
);

applyDisplayName(AppLayout, 'AppLayout');
export default AppLayout;
