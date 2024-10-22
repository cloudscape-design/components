// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { FunnelProvider } from '../internal/analytics/contexts/funnel-context';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { useWizardFunnel } from './analytics/funnel';
import { WizardProps } from './interfaces';
import InternalWizard from './internal';

function BaseWizard({
  onCancel,
  onSubmit,
  onNavigate,
  isLoadingNextStep = false,
  allowSkipTo = false,
  ...props
}: WizardProps) {
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

  const externalProps = getExternalProps(props);
  const { funnelContext } = useWizardFunnel({
    steps: props.steps,
    activeStepIndex: props.activeStepIndex,
    analyticsMetadata,
    isLoadingNextStep,
  });

  return (
    <InternalWizard
      isLoadingNextStep={isLoadingNextStep}
      allowSkipTo={allowSkipTo}
      onCancel={event => {
        funnelContext?.controller?.cancel();
        onCancel?.(event);
      }}
      onSubmit={event => {
        funnelContext?.controller?.submit();
        onSubmit?.(event);
      }}
      onNavigate={event => {
        funnelContext?.controller?.navigate(event.detail.reason, event.detail.requestedStepIndex);
        onNavigate?.(event);
      }}
      {...externalProps}
      {...baseComponentProps}
      {...funnelContext?.controller?.domAttributes}
    />
  );
}

const Wizard = (props: WizardProps) => {
  return (
    <FunnelProvider rootComponent="wizard">
      <BaseWizard {...props} />
    </FunnelProvider>
  );
};

applyDisplayName(Wizard, 'Wizard');

export { WizardProps };
export default Wizard;
