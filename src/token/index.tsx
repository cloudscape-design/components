// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataTokenComponent } from './analytics-metadata/interfaces';
import { TokenProps } from './interfaces';
import InternalToken from './internal';

import analyticsSelectors from './analytics-metadata/styles.css.js';

export { TokenProps };

export default function Token(props: TokenProps) {
  const baseComponentProps = useBaseComponent('Token');

  const componentAnalyticsMetadata: GeneratedAnalyticsMetadataTokenComponent = {
    name: 'awsui.Token',
    label: `.${analyticsSelectors.token}`,
    properties: {
      hasPopover: String(!!props.popoverProps),
    },
  };

  return (
    <InternalToken
      {...props}
      {...baseComponentProps}
      {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
    />
  );
}

applyDisplayName(Token, 'Token');
