// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AppLayoutProps } from '~components';
import { useAppLayoutPlacement } from '~components/app-layout/utils/use-app-layout-placement';
import { applyDefaults } from '~components/app-layout/defaults';
import React from 'react';
import { AppLayoutSkeleton } from '~components/app-layout/skeleton';

// Allow to render app layout in forced skeleton mode for development and testing
export function SkeletonLayout({
  contentType = 'default',
  toolsWidth = 290,
  navigationWidth = 280,
  navigationOpen,
  onNavigationChange = () => {},
  minContentWidth,
  maxContentWidth,
  ...rest
}: AppLayoutProps) {
  const [rootRef, placement] = useAppLayoutPlacement('#h', '#f');
  const defaults = applyDefaults(contentType, { maxContentWidth, minContentWidth }, true);
  return (
    <div ref={rootRef as React.Ref<any>}>
      <AppLayoutSkeleton
        {...rest}
        {...defaults}
        placement={placement}
        contentType={contentType}
        navigationOpen={!!navigationOpen}
        navigationWidth={navigationWidth}
        onNavigationChange={onNavigationChange}
        toolsWidth={toolsWidth}
      />
    </div>
  );
}
