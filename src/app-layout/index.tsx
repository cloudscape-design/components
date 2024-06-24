// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import useBaseComponent from '../internal/hooks/use-base-component';
import { getBaseProps } from '../internal/base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { AppLayoutProps } from './interfaces';
import { AppLayoutInternal } from './internal';
import { isDevelopment } from '../internal/is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

export { AppLayoutProps };

const AppLayout = React.forwardRef(
  (
    {
      contentType = 'default',
      headerSelector = '#b #h',
      footerSelector = '#b #f',
      navigationWidth = 280,
      toolsWidth = 290,
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
    const { __internalRootRef } = useBaseComponent<HTMLDivElement>('AppLayout', {
      props: {
        contentType,
        disableContentPaddings: rest.disableContentPaddings,
        disableBodyScroll: rest.disableBodyScroll,
        navigationWidth,
        navigationHide: rest.navigationHide,
        toolsHide: rest.toolsHide,
        toolsWidth,
        maxContentWidth: rest.maxContentWidth,
        minContentWidth: rest.minContentWidth,
        stickyNotifications: rest.stickyNotifications,
        disableContentHeaderOverlap: rest.disableContentHeaderOverlap,
      },
      metadata: {
        drawersCount: rest.drawers?.length ?? null,
        hasContentHeader: !!rest.contentHeader,
      },
    });
    const baseProps = getBaseProps(rest);

    return (
      <div ref={__internalRootRef} {...baseProps}>
        <AppLayoutInternal
          ref={ref}
          contentType={contentType}
          headerSelector={headerSelector}
          footerSelector={footerSelector}
          navigationWidth={navigationWidth}
          toolsWidth={toolsWidth}
          {...rest}
        />
      </div>
    );
  }
);

applyDisplayName(AppLayout, 'AppLayout');
export default AppLayout;
