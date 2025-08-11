// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React from 'react';

import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { ExpandableSectionProps } from './interfaces.js';
import InternalExpandableSection from './internal.js';

export { ExpandableSectionProps };

export default function ExpandableSection({ variant = 'default', ...props }: ExpandableSectionProps) {
  const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
  const baseComponentProps = useBaseComponent(
    'ExpandableSection',
    {
      props: {
        disableContentPaddings: props.disableContentPaddings,
        headingTagOverride: props.headingTagOverride,
        variant,
      },
      metadata: {
        hasInstanceIdentifier: Boolean(analyticsMetadata?.instanceIdentifier),
        hasHeaderActions: Boolean(props.headerActions),
      },
    },
    analyticsMetadata
  );

  return (
    <InternalExpandableSection
      variant={variant}
      {...props}
      {...baseComponentProps}
      __injectAnalyticsComponentMetadata={true}
    />
  );
}

applyDisplayName(ExpandableSection, 'ExpandableSection');
