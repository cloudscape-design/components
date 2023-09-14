// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ExpandableSectionProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalExpandableSection, { InternalExpandableSectionProps } from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { AnalyticsFunnelSubStep } from '../internal/analytics/components/analytics-funnel';
import { useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';

export { ExpandableSectionProps };

export default function ExpandableSection({ variant = 'default', ...props }: ExpandableSectionProps) {
  const baseComponentProps = useBaseComponent('ExpandableSection');

  if (variant === 'container' || variant === 'stacked') {
    return (
      <AnalyticsFunnelSubStep>
        <InternalExpandableSectionAsSubstep variant={variant} {...props} {...baseComponentProps} />
      </AnalyticsFunnelSubStep>
    );
  } else {
    return <InternalExpandableSection variant={variant} {...props} {...baseComponentProps} />;
  }
}

function InternalExpandableSectionAsSubstep(props: InternalExpandableSectionProps) {
  const { subStepRef, funnelSubStepProps } = useFunnelSubStep();

  return <InternalExpandableSection {...props} __subStepRef={subStepRef} __funnelSubStepProps={funnelSubStepProps} />;
}

applyDisplayName(ExpandableSection, 'ExpandableSection');
