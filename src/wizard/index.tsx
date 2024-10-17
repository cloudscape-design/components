// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect } from 'react';

import { FunnelProvider } from '../internal/analytics/contexts/funnel-context';
import { useFunnel } from '../internal/analytics/hooks/use-funnel';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { getExternalProps } from '../internal/utils/external-props';
import { WizardProps } from './interfaces';
import InternalWizard from './internal';

function FunnelEnabledWizard({
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

  const funnel = useFunnel();

  useLayoutEffect(() => {
    if (!funnel || !funnel.controller) {
      return;
    }

    // TODO: Use global breadcrumbs plugin for funnel name
    // TODO: Use global breadcrumbs plugin for resource type
    const funnelName = document.querySelector<HTMLElement>('[data-analytics-funnel-key=funnel-name]')?.innerText || '';
    const steps = [
      ...props.steps.map((step, index) => {
        return { index, name: step.title, optional: step.isOptional, metadata: step.analyticsMetadata };
      }),
    ];

    funnel.controller.setName(funnelName);
    funnel.controller.setMetadata(analyticsMetadata);
    funnel.controller.setSteps(steps, props.activeStepIndex);
    funnel.controller.start();

    return () => {
      funnel.controller?.complete();
    };

    // Don't rerun hook each time the active step index changes. We only want the initial value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnel]);

  const externalProps = getExternalProps(props);

  useEffect(() => {
    if (!isLoadingNextStep) {
      funnel?.controller?.validate(false);
    }
  }, [isLoadingNextStep, funnel]);

  return (
    <InternalWizard
      isLoadingNextStep={isLoadingNextStep}
      allowSkipTo={allowSkipTo}
      onCancel={event => {
        funnel?.controller?.cancel();
        onCancel?.(event);
      }}
      onSubmit={event => {
        funnel?.controller?.validate(isLoadingNextStep);
        funnel?.controller?.submit();
        onSubmit?.(event);
      }}
      onNavigate={event => {
        funnel?.controller?.navigate(event.detail.reason, event.detail.requestedStepIndex);
        onNavigate?.(event);
      }}
      {...externalProps}
      {...baseComponentProps}
    />
  );
}

applyDisplayName(Wizard, 'Wizard');

export { WizardProps };
export default function Wizard(props: WizardProps) {
  return (
    <FunnelProvider rootComponent="wizard">
      <FunnelEnabledWizard {...props} />
    </FunnelProvider>
  );
}
