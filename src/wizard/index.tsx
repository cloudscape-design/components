// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect } from 'react';

import { FunnelProvider } from '../internal/analytics/contexts/funnel-context';
import { useFunnel } from '../internal/analytics/hooks/use-funnel';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
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

  const { funnelContext, pageContext } = useFunnel();
  console.log(pageContext);

  useLayoutEffect(() => {
    if (!funnelContext || !funnelContext.controller) {
      return;
    }

    const steps = [
      ...props.steps.map((step, index) => {
        return { index, name: step.title, optional: step.isOptional, metadata: step.analyticsMetadata };
      }),
    ];

    funnelContext.controller.setName(pageContext.getPageName() || 'Unknown funnel name');
    funnelContext.controller.setMetadata(analyticsMetadata);
    funnelContext.controller.setSteps(steps, props.activeStepIndex);

    // Don't rerun hook each time the active step index changes. We only want the initial value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funnelContext, props.steps]);

  useEffectOnUpdate(() => {
    if (!funnelContext || !funnelContext.controller) {
      return;
    }

    const steps = [
      ...props.steps.map((step, index) => {
        return { index, name: step.title, optional: step.isOptional, metadata: step.analyticsMetadata };
      }),
    ];
    funnelContext.controller.updateSteps(steps);
  }, [funnelContext, props.steps]);

  useEffect(() => {
    funnelContext?.controller?.start();

    return () => {
      funnelContext?.controller?.complete();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const externalProps = getExternalProps(props);

  useEffect(() => {
    if (!isLoadingNextStep) {
      funnelContext?.controller?.validate(false);
    }
  }, [isLoadingNextStep, funnelContext]);

  return (
    <InternalWizard
      isLoadingNextStep={isLoadingNextStep}
      allowSkipTo={allowSkipTo}
      onCancel={event => {
        funnelContext?.controller?.cancel();
        onCancel?.(event);
      }}
      onSubmit={event => {
        funnelContext?.controller?.validate(isLoadingNextStep);
        funnelContext?.controller?.submit();
        onSubmit?.(event);
      }}
      onNavigate={event => {
        funnelContext?.controller?.navigate(event.detail.reason, event.detail.requestedStepIndex);
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
