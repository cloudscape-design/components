// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';

import { FunnelMetrics } from '../internal/analytics';
import { AnalyticsFunnel, AnalyticsFunnelStep } from '../internal/analytics/components/analytics-funnel';
import { useFunnel, useFunnelNameSelector, useFunnelStepRef } from '../internal/analytics/hooks/use-funnel';
import { getSubStepAllSelector, getTextFromSelector } from '../internal/analytics/selectors';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { ButtonContext, ButtonContextProps } from '../internal/context/button-context';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { FormProps } from './interfaces';
import InternalForm from './internal';

import headerStyles from '../header/styles.css.js';
import analyticsSelectors from './analytics-metadata/styles.css.js';

export { FormProps };

const FormWithAnalytics = ({
  variant = 'full-page',
  actions,
  errorText,
  __internalRootRef,
  ...props
}: FormProps & ReturnType<typeof useBaseComponent<HTMLElement>>) => {
  const {
    funnelIdentifier,
    funnelInteractionId,
    funnelProps,
    funnelSubmit,
    funnelNextOrSubmitAttempt,
    errorCount,
    submissionAttempt,
    funnelErrorContext,
  } = useFunnel();

  const funnelStepInfo = useFunnelStepRef();

  const handleActionButtonClick: ButtonContextProps['onClick'] = ({ variant }) => {
    if (variant === 'primary') {
      funnelNextOrSubmitAttempt();
      funnelSubmit();
    }
  };

  const errorSlotId = useUniqueId('form-error-');

  useEffect(() => {
    if (funnelInteractionId && errorText) {
      errorCount.current++;

      const stepName = getTextFromSelector(funnelStepInfo.current.stepNameSelector);

      FunnelMetrics.funnelStepError({
        funnelInteractionId,
        stepNumber: funnelStepInfo.current.stepNumber,
        stepNameSelector: funnelStepInfo.current.stepNameSelector,
        stepName,
        stepIdentifier: funnelStepInfo.current.stepIdentifier,
        currentDocument: __internalRootRef.current?.ownerDocument,
        totalSubSteps: funnelStepInfo.current.subStepCount.current,
        funnelIdentifier,
        subStepAllSelector: getSubStepAllSelector(),
        errorContext: funnelStepInfo.current.stepErrorContext,
        subStepConfiguration: funnelStepInfo.current.subStepConfiguration.current?.get(
          funnelStepInfo.current.stepNumber
        ),
        stepErrorSelector: '#' + errorSlotId,
      });

      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        errorCount.current--;
      };
    }
  }, [
    funnelInteractionId,
    funnelIdentifier,
    errorText,
    submissionAttempt,
    errorCount,
    funnelErrorContext,
    errorSlotId,
    __internalRootRef,
    funnelStepInfo,
  ]);

  return (
    <ButtonContext.Provider value={{ onClick: handleActionButtonClick }}>
      <InternalForm
        variant={variant}
        actions={actions}
        errorText={errorText}
        __errorSlotId={errorSlotId}
        {...props}
        {...funnelProps}
        {...funnelStepInfo.current.funnelStepProps}
        __internalRootRef={__internalRootRef}
        __injectAnalyticsComponentMetadata={true}
      />
    </ButtonContext.Provider>
  );
};

export default function Form({ variant = 'full-page', ...props }: FormProps) {
  const analyticsMetadata = getAnalyticsMetadataProps(props as BasePropsWithAnalyticsMetadata);
  const baseComponentProps = useBaseComponent<HTMLElement>(
    'Form',
    {
      props: {
        variant,
        flowType: analyticsMetadata?.flowType,
      },
      metadata: {
        hasResourceType: Boolean(analyticsMetadata?.resourceType),
        hasInstanceIdentifier: Boolean(analyticsMetadata?.instanceIdentifier),
      },
    },
    analyticsMetadata
  );
  const inheritedFunnelNameSelector = useFunnelNameSelector();
  const funnelNameSelector =
    inheritedFunnelNameSelector || `.${analyticsSelectors.header} .${headerStyles['heading-text']}`;

  return (
    <AnalyticsFunnel
      funnelIdentifier={analyticsMetadata?.instanceIdentifier}
      funnelFlowType={analyticsMetadata?.flowType}
      funnelErrorContext={analyticsMetadata?.errorContext}
      funnelResourceType={analyticsMetadata?.resourceType}
      funnelType="single-page"
      optionalStepNumbers={[]}
      totalFunnelSteps={1}
      funnelNameSelectors={() => [funnelNameSelector, `.${analyticsSelectors.header}`]}
    >
      <AnalyticsFunnelStep
        stepIdentifier={analyticsMetadata?.instanceIdentifier}
        stepErrorContext={analyticsMetadata?.errorContext}
        stepNumber={1}
      >
        <FormWithAnalytics variant={variant} {...props} {...baseComponentProps} />
      </AnalyticsFunnelStep>
    </AnalyticsFunnel>
  );
}

applyDisplayName(Form, 'Form');
