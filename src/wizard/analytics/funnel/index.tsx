// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useLayoutEffect } from 'react';

import { useFunnel } from '../../../internal/analytics/funnel/hooks/use-funnel';
import { useEffectOnUpdate } from '../../../internal/hooks/use-effect-on-update';
import { WizardProps } from '../../interfaces';

interface UseWizardFunnelProps {
  steps: WizardProps['steps'];
  analyticsMetadata: WizardProps['analyticsMetadata'];
  activeStepIndex: WizardProps['activeStepIndex'];
  isLoadingNextStep: WizardProps['isLoadingNextStep'];
}

export const useWizardFunnel = ({ isLoadingNextStep, ...props }: UseWizardFunnelProps) => {
  const { funnelContext, pageContext } = useFunnel();

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
    funnelContext.controller.setMetadata(props.analyticsMetadata);
    funnelContext.controller.setSteps(steps, props.activeStepIndex);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffectOnUpdate(() => {
    console.log('activeStepIndex', props.activeStepIndex);
  }, [props.activeStepIndex]);

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.steps]);

  useEffectOnUpdate(() => {
    funnelContext?.controller?.validate(Boolean(isLoadingNextStep));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingNextStep]);

  useEffect(() => {
    funnelContext?.controller?.start();

    return () => {
      funnelContext?.controller?.complete();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { funnelContext };
};
