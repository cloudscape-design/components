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
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';

export { AlertProps };

const Alert = React.forwardRef(
  ({ type = 'info', visible = true, ...props }: AlertProps, ref: React.Ref<AlertProps.Ref>) => {
    const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
    const baseComponentProps = useBaseComponent<HTMLDivElement>(
      'Alert',
      {
        props: { type, visible, dismissible: props.dismissible },
      },
      analyticsMetadata
    );

    const { funnelInteractionId, submissionAttempt, funnelState, errorCount } = useFunnel();
    const { stepNumber, stepNameSelector } = useFunnelStep();
    const { subStepSelector, subStepNameSelector } = useFunnelSubStep();

    useEffect(() => {
      if (funnelInteractionId && visible && type === 'error' && funnelState.current !== 'complete') {
        const stepName = getNameFromSelector(stepNameSelector);
        const subStepName = getNameFromSelector(subStepNameSelector);

        errorCount.current++;

        // We don't want to report an error if it is hidden, e.g. inside an Expandable Section.
        const errorIsVisible = (baseComponentProps.__internalRootRef.current?.getBoundingClientRect()?.width ?? 0) > 0;

        if (errorIsVisible) {
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
              instanceIdentifier: analyticsMetadata?.instanceIdentifier,
              errorContext: analyticsMetadata?.errorContext,
            });
          } else {
            FunnelMetrics.funnelError({
              funnelInteractionId,
            });
          }
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
