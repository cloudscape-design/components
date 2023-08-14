// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { AlertProps } from './interfaces';
import InternalAlert from './internal';
import useBaseComponent from '../internal/hooks/use-base-component';
import { FunnelMetrics } from '../internal/analytics';
import { useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import { getNameFromSelector, getSubStepAllSelector } from '../internal/analytics/selectors';

export { AlertProps };

const Alert = React.forwardRef(
  ({ type = 'info', visible = true, ...props }: AlertProps, ref: React.Ref<AlertProps.Ref>) => {
    const baseComponentProps = useBaseComponent('Alert');

    const { funnelInteractionId, submissionAttempt, funnelState, errorCount } = useFunnel();
    const { stepNumber, stepNameSelector } = useFunnelStep();
    const { subStepSelector, subStepNameSelector } = useFunnelSubStep();

    useEffect(() => {
      if (funnelInteractionId && visible && type === 'error' && funnelState.current !== 'complete') {
        const stepName = getNameFromSelector(stepNameSelector);
        const subStepName = getNameFromSelector(subStepNameSelector);

        errorCount.current++;

        if (subStepSelector) {
          FunnelMetrics.funnelSubStepError({
            funnelInteractionId,
            subStepSelector,
            subStepName,
            subStepNameSelector,
            stepNumber,
            stepName,
            stepNameSelector,
            subStepAllSelector: getSubStepAllSelector(),
          });
        } else {
          FunnelMetrics.funnelError({
            funnelInteractionId,
          });
        }

        return () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          errorCount.current--;
        };
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [funnelInteractionId, visible, submissionAttempt, errorCount]);

    return <InternalAlert type={type} visible={visible} {...props} {...baseComponentProps} ref={ref} />;
  }
);

applyDisplayName(Alert, 'Alert');
export default Alert;
