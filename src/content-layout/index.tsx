// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { ContentLayoutProps } from './interfaces';
import InternalContentLayout from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';

export { ContentLayoutProps };

export default function ContentLayout(props: ContentLayoutProps) {
  const baseComponentProps = useBaseComponent('ContentLayout', {
    props: { disableOverlap: props.disableOverlap },
  });
  return <InternalContentLayout {...props} {...baseComponentProps} />;
}

applyDisplayName(ContentLayout, 'ContentLayout');
