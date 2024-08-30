// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { AnalyticsFunnel } from '../internal/analytics/components/analytics-funnel';
import { useFunnel } from '../internal/analytics/hooks/use-funnel';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { getStepConfiguration } from './analytics';
import { WizardProps } from './interfaces';
import InternalWizard from './internal';

function Wizard({ isLoadingNextStep = false, allowSkipTo = false, ...props }: WizardProps) {
  const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
  const baseComponentProps = useBaseComponent(
    'Wizard',
    {
      props: {
        allowSkipTo,
        flowType: analyticsMetadata.flowType,
      },
      metadata: {
        hasInstanceIdentifier: Boolean(analyticsMetadata?.instanceIdentifier),
        hasResourceType: Boolean(analyticsMetadata?.resourceType),
      },
    },
    analyticsMetadata
  );
  const { wizardCount } = useFunnel();
  const externalProps = getExternalProps(props);

  useEffect(() => {
    wizardCount.current++;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => void wizardCount.current--;
  }, [wizardCount]);

  return (
    <AnalyticsFunnel
      funnelIdentifier={analyticsMetadata?.instanceIdentifier}
      funnelFlowType={analyticsMetadata?.flowType}
      funnelErrorContext={analyticsMetadata?.errorContext}
      funnelResourceType={analyticsMetadata?.resourceType}
      funnelType="multi-page"
      optionalStepNumbers={props.steps
        .map((step, index) => (step.isOptional ? index + 1 : -1))
        .filter(step => step !== -1)}
      totalFunnelSteps={props.steps.length}
      stepConfiguration={getStepConfiguration(props.steps)}
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
