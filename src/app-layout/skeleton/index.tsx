// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AppLayoutPropsWithDefaults } from '../interfaces';
import { SkeletonLayout } from './layout';
import { NotificationsContainer, ToolbarContainer } from './containers';

export function AppLayoutSkeleton({
  notifications,
  contentHeader,
  content,

  navigation,
  navigationHide,
  navigationOpen,
  navigationWidth,
  tools,
  toolsHide,
  toolsOpen,
  toolsWidth,

  placement,
  contentType,
  maxContentWidth,
  disableContentPaddings,
}: AppLayoutPropsWithDefaults) {
  // render nothing in the skeleton state
  const placeholder = <></>;
  return (
    <SkeletonLayout
      // TODO support conditional toolbar rendering based on props
      toolbar={<ToolbarContainer>{placeholder}</ToolbarContainer>}
      notifications={notifications && <NotificationsContainer>{notifications}</NotificationsContainer>}
      contentHeader={contentHeader}
      content={content}
      navigation={!navigationHide && navigation && placeholder}
      navigationOpen={navigationOpen}
      navigationWidth={navigationWidth}
      // TODO: support drawers prop
      tools={!toolsHide && tools && placeholder}
      toolsOpen={toolsOpen}
      toolsWidth={toolsWidth}
      placement={placement}
      contentType={contentType}
      maxContentWidth={maxContentWidth}
      disableContentPaddings={disableContentPaddings}
    />
  );
}
