// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ExpandableSectionProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalExpandableSection from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';

export { ExpandableSectionProps };

export default function ExpandableSection({ variant = 'default', ...props }: ExpandableSectionProps) {
  const baseComponentProps = useBaseComponent('ExpandableSection');

  const expandableSection = <InternalExpandableSection variant={variant} {...props} {...baseComponentProps} />;

  if (variant === 'container' || variant === 'stacked') {
    return <AnalyticsFunnelSubStep>{expandableSection}</AnalyticsFunnelSubStep>;
  } else {
    return expandableSection;
  }
}

applyDisplayName(ExpandableSection, 'ExpandableSection');
