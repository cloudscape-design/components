// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { useEffect } from 'react';

import { useUniqueId } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { FunnelMetrics } from '../internal/analytics';
import { useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import { getSubStepAllSelector, getTextFromSelector } from '../internal/analytics/selectors';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { GeneratedAnalyticsMetadataAlertComponent } from './analytics-metadata/interfaces';
import { AlertProps } from './interfaces';
import InternalAlert from './internal';

import analyticsSelectors from './analytics-metadata/styles.css.js';

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
    const { stepNumber, stepNameSelector, stepIdentifier, subStepCount, stepErrorContext, subStepConfiguration } =
      useFunnelStep();
    const { subStepSelector, subStepNameSelector, subStepIdentifier, subStepErrorContext } = useFunnelSubStep();

    const messageSlotId = useUniqueId('alert-');

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
              errorContext: analyticsMetadata.errorContext || subStepErrorContext,
            });
          } else if (stepNameSelector) {
            FunnelMetrics.funnelStepError({
              funnelInteractionId,
              stepNumber,
              stepNameSelector,
              stepName,
              stepIdentifier,
              currentDocument: baseComponentProps.__internalRootRef.current?.ownerDocument,
              totalSubSteps: subStepCount.current,
              funnelIdentifier,
              subStepAllSelector: getSubStepAllSelector(),
              errorContext: analyticsMetadata.errorContext || stepErrorContext,
              subStepConfiguration: subStepConfiguration.current?.get(stepNumber),
              stepErrorSelector: '#' + messageSlotId,
            });
          } else {
            FunnelMetrics.funnelError({
              funnelIdentifier,
              funnelInteractionId,
              errorContext: analyticsMetadata.errorContext || funnelErrorContext,
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
        messageSlotId={messageSlotId}
        {...getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata })}
      />
    );
  }
);

applyDisplayName(Alert, 'Alert');
export default Alert;
