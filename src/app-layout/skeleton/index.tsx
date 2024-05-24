// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { AppLayoutPropsWithDefaults } from '../interfaces';
import { SkeletonLayout } from './layout';

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
  minContentWidth,
  disableContentPaddings,
}: AppLayoutPropsWithDefaults) {
  // render nothing in the skeleton state
  const placeholder = <></>;
  return (
    <SkeletonLayout
      topBar={placeholder}
      notifications={notifications}
      contentHeader={contentHeader}
      content={content}
      navigation={!navigationHide && navigationOpen && navigation && placeholder}
      navigationWidth={navigationWidth}
      tools={!toolsHide && toolsOpen && tools && placeholder}
      toolsWidth={toolsWidth}
      placement={placement}
      contentType={contentType}
      maxContentWidth={maxContentWidth}
      minContentWidth={minContentWidth}
      disableContentPaddings={disableContentPaddings}
    />
  );
}
