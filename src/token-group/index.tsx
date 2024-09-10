// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataTokenGroupComponent } from './analytics-metadata/interfaces';
import { TokenGroupProps } from './interfaces';
import InternalTokenGroup from './internal';

export { TokenGroupProps };

export default function TokenGroup({ items = [], alignment = 'horizontal', ...props }: TokenGroupProps) {
  const baseComponentProps = useBaseComponent('TokenGroup', {
    props: { alignment, disableOuterPadding: props.disableOuterPadding, limit: props.limit },
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
