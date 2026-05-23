// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataSideNavigationComponent } from './analytics-metadata/interfaces';
import { SideNavigationProps } from './interfaces';
import { InternalSideNavigation } from './internal';

import analyticsSelectors from './analytics-metadata/styles.css.js';

export { SideNavigationProps };

export default function SideNavigation({
  items = [],
  expandIconPosition = 'start',
  collapsed = false,
  variant = 'default',
  ...props
}: SideNavigationProps) {
  const internalProps = useBaseComponent('SideNavigation', {
    props: { expandIconPosition, collapsed, variant },
  });

  const componentAnalyticMetadata: GeneratedAnalyticsMetadataSideNavigationComponent = {
    name: 'awsui.SideNavigation',
    label: `.${analyticsSelectors['header-link-text']}`,
    properties: {
      activeHref: props.activeHref || '',
    },
  };
  return (
    <InternalSideNavigation
      {...props}
      {...internalProps}
      items={items}
      expandIconPosition={expandIconPosition}
      collapsed={collapsed}
      variant={variant}
      {...getAnalyticsMetadataAttribute({ component: componentAnalyticMetadata })}
    />
  );
}

applyDisplayName(SideNavigation, 'SideNavigation');
