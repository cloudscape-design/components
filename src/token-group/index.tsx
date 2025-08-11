// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GeneratedAnalyticsMetadataTokenGroupComponent } from './analytics-metadata/interfaces.js';
import { TokenGroupProps } from './interfaces.js';
import InternalTokenGroup from './internal.js';

export { TokenGroupProps };

export default function TokenGroup({ items = [], alignment = 'horizontal', ...props }: TokenGroupProps) {
  const baseComponentProps = useBaseComponent('TokenGroup', {
    props: { alignment, disableOuterPadding: props.disableOuterPadding, limit: props.limit, readOnly: props.readOnly },
  });

  const componentAnalyticsMetadata: GeneratedAnalyticsMetadataTokenGroupComponent = {
    name: 'awsui.TokenGroup',
    label: 'invalid',
    properties: {
      itemsCount: `${items.length}`,
    },
  };

  return (
    <InternalTokenGroup
      items={items}
      alignment={alignment}
      {...props}
      {...baseComponentProps}
      {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
    />
  );
}

applyDisplayName(TokenGroup, 'TokenGroup');
