// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel.js';
import { FunnelMetrics } from '../internal/analytics/index.js';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component/index.js';
import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { GeneratedAnalyticsMetadataAlertComponent } from './analytics-metadata/interfaces.js';
import { AlertProps } from './interfaces.js';
import InternalAlert from './internal.js';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import { getSubStepAllSelector, getTextFromSelector } from '../internal/analytics/selectors.js';

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

    const { funnelIdentifier, funnelInteractionId, funnelErrorContext, submissionAttempt, funnelState, errorCount } =
      useFunnel();
    const { stepNumber, stepNameSelector, stepIdentifier } = useFunnelStep();
    const { subStepSelector, subStepNameSelector, subStepIdentifier, subStepErrorContext } = useFunnelSubStep();

    useEffect(() => {
      if (funnelInteractionId && visible && type === 'error' && funnelState.current !== 'complete') {
        const stepName = getTextFromSelector(stepNameSelector);
        const subStepName = getTextFromSelector(subStepNameSelector);

        errorCount.current++;

        // We don't want to report an error if it is hidden, e.g. inside an Expandable Section.
        const errorIsVisible = (baseComponentProps.__internalRootRef.current?.getBoundingClientRect()?.width ?? 0) > 0;

        if (errorIsVisible) {
          if (subStepSelector) {
            FunnelMetrics.funnelSubStepError({
              funnelInteractionId,
              funnelIdentifier,
              stepIdentifier,
              subStepSelector,
              subStepName,
              subStepNameSelector,
              stepNumber,
              stepName,
              stepNameSelector,
              subStepAllSelector: getSubStepAllSelector(),
              subStepIdentifier,
              subStepErrorContext,
            });
          } else {
            FunnelMetrics.funnelError({
              funnelIdentifier,
              funnelInteractionId,
              funnelErrorContext,
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

    const componentAnalyticsMetadata: GeneratedAnalyticsMetadataAlertComponent = {
      name: 'awsui.Alert',
      label: `.${analyticsSelectors.header}`,
      properties: {
        type,
      },
    };

    return (
      <InternalAlert
        type={type}
        visible={visible}
        {...props}
        {...baseComponentProps}
        ref={ref}
        {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
      />
    );
  }
);

applyDisplayName(Alert, 'Alert');
export default Alert;
