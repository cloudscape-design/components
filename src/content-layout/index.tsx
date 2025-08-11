// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { ContentLayoutProps } from './interfaces.js';
import InternalContentLayout from './internal.js';

export { ContentLayoutProps };

export default function ContentLayout(props: ContentLayoutProps) {
  const baseComponentProps = useBaseComponent('ContentLayout', {
    props: { disableOverlap: props.disableOverlap },
  });
  return <InternalContentLayout {...props} {...baseComponentProps} />;
}

applyDisplayName(ContentLayout, 'ContentLayout');
