// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { getExternalProps } from '../internal/utils/external-props';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';

import { AnalyticsFunnel } from '../internal/analytics/components/analytics-funnel';

import InternalWizard from './internal';
import { WizardProps } from './interfaces';

function Wizard({ isLoadingNextStep = false, allowSkipTo = false, ...props }: WizardProps) {
  const baseComponentProps = useBaseComponent('Wizard', { steps: props.steps, isLoadingNextStep });
  const externalProps = getExternalProps(props);

  return (
    <AnalyticsFunnel
      funnelType="multi-page"
      optionalStepNumbers={props.steps.map((step, index) => (step.isOptional ? index : -1)).filter(step => step !== -1)}
      totalFunnelSteps={props.steps.length}
    >
      <InternalWizard
        isLoadingNextStep={isLoadingNextStep}
        allowSkipTo={allowSkipTo}
        {...externalProps}
        {...baseComponentProps}
      />
    </AnalyticsFunnel>
  );
}

applyDisplayName(Wizard, 'Wizard');

export { WizardProps };
export default Wizard;
