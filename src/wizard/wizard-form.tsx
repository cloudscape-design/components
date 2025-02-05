// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { MutableRefObject, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useComponentMetadata } from '@cloudscape-design/component-toolkit/internal';

import InternalForm from '../form/internal';
import InternalHeader from '../header/internal';
import { FunnelMetrics } from '../internal/analytics';
import { AnalyticsFunnelStep } from '../internal/analytics/components/analytics-funnel';
import { useFunnel, useFunnelStep } from '../internal/analytics/hooks/use-funnel';
import { DATA_ATTR_FUNNEL_KEY, FUNNEL_KEY_STEP_NAME } from '../internal/analytics/selectors';
import { BasePropsWithAnalyticsMetadata, getAnalyticsMetadataProps } from '../internal/base-component';
import { PACKAGE_VERSION } from '../internal/environment';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
import { WizardProps } from './interfaces';
import WizardActions from './wizard-actions';
import WizardFormHeader from './wizard-form-header';

import styles from './styles.css.js';

interface WizardFormProps extends InternalBaseComponentProps {
  steps: ReadonlyArray<WizardProps.Step>;
  activeStepIndex: number;
  showCollapsedSteps: boolean;
  i18nStrings: WizardProps.I18nStrings;
  submitButtonText?: string;
  isPrimaryLoading: boolean;
  allowSkipTo: boolean;
  secondaryActions?: React.ReactNode;
  onCancelClick: () => void;
  onPreviousClick: () => void;
  onPrimaryClick: () => void;
  onSkipToClick: (stepIndex: number) => void;
}

export const STEP_NAME_SELECTOR = `[${DATA_ATTR_FUNNEL_KEY}=${FUNNEL_KEY_STEP_NAME}]`;

export default function WizardFormWithAnalytics(props: WizardFormProps) {
  const analyticsMetadata = getAnalyticsMetadataProps(
    props.steps[props.activeStepIndex] as BasePropsWithAnalyticsMetadata
  );
  const __internalRootRef = useComponentMetadata('WizardForm', PACKAGE_VERSION, { ...analyticsMetadata });
  const stepHeaderRef = useRef<HTMLDivElement | null>(null);

  useEffectOnUpdate(() => {
    if (stepHeaderRef && stepHeaderRef.current) {
      stepHeaderRef.current?.focus();
    }
  }, [props.activeStepIndex]);

  return (
    <AnalyticsFunnelStep
      stepIdentifier={analyticsMetadata?.instanceIdentifier}
      stepErrorContext={analyticsMetadata?.errorContext}
      stepNameSelector={STEP_NAME_SELECTOR}
      stepNumber={props.activeStepIndex + 1}
    >
      <WizardForm stepHeaderRef={stepHeaderRef} __internalRootRef={__internalRootRef} {...props} />
    </AnalyticsFunnelStep>
  );
}

function WizardForm({
  __internalRootRef,
  stepHeaderRef,
  steps,
  activeStepIndex,
  showCollapsedSteps,
  i18nStrings,
  submitButtonText,
  isPrimaryLoading,
  allowSkipTo,
  secondaryActions,
  onCancelClick,
  onPreviousClick,
  onPrimaryClick,
  onSkipToClick,
}: WizardFormProps & { stepHeaderRef: MutableRefObject<HTMLDivElement | null> }) {
  const { title, info, description, content, errorText, isOptional } = steps[activeStepIndex] || {};
  const isLastStep = activeStepIndex >= steps.length - 1;
  const skipToTargetIndex = findSkipToTargetIndex(steps, activeStepIndex);

  const { funnelInteractionId, funnelIdentifier } = useFunnel();
  const { funnelStepProps, stepErrorContext } = useFunnelStep();

  const showSkipTo = allowSkipTo && skipToTargetIndex !== -1;
  const skipToButtonText =
    skipToTargetIndex !== -1 && i18nStrings.skipToButtonLabel
      ? i18nStrings.skipToButtonLabel(steps[skipToTargetIndex], skipToTargetIndex + 1)
      : undefined;

  useEffect(() => {
    if (funnelInteractionId && errorText && isLastStep) {
      FunnelMetrics.funnelError({
        funnelInteractionId,
        funnelIdentifier,
        funnelErrorContext: stepErrorContext,
      });
    }
  }, [funnelInteractionId, funnelIdentifier, isLastStep, errorText, stepErrorContext]);

  return (
    <>
      <WizardFormHeader>
        <div className={clsx(styles['collapsed-steps'], !showCollapsedSteps && styles['collapsed-steps-hidden'])}>
          {i18nStrings.collapsedStepsLabel?.(activeStepIndex + 1, steps.length)}
        </div>
        <InternalHeader
          className={styles['form-header-component']}
          variant="h1"
          description={description}
          info={info}
          __headingTagRef={stepHeaderRef}
          __headingTagTabIndex={-1}
        >
          <span className={styles['form-header-component-wrapper']}>
            <span {...{ [DATA_ATTR_FUNNEL_KEY]: FUNNEL_KEY_STEP_NAME }}>{title}</span>
            {isOptional && <i>{` - ${i18nStrings.optional}`}</i>}
          </span>
        </InternalHeader>
      </WizardFormHeader>

      <InternalForm
        __internalRootRef={__internalRootRef}
        className={styles['form-component']}
        actions={
          <WizardActions
            cancelButtonText={i18nStrings.cancelButton}
            primaryButtonText={isLastStep ? submitButtonText ?? i18nStrings.submitButton : i18nStrings.nextButton}
            primaryButtonLoadingText={
              isLastStep ? i18nStrings.submitButtonLoadingAnnouncement : i18nStrings.nextButtonLoadingAnnouncement
            }
            previousButtonText={i18nStrings.previousButton}
            onCancelClick={onCancelClick}
            onPreviousClick={onPreviousClick}
            onPrimaryClick={onPrimaryClick}
            onSkipToClick={() => onSkipToClick(skipToTargetIndex)}
            showPrevious={activeStepIndex !== 0}
            isPrimaryLoading={isPrimaryLoading}
            showSkipTo={showSkipTo}
            skipToButtonText={skipToButtonText}
            isLastStep={isLastStep}
            activeStepIndex={activeStepIndex}
            skipToStepIndex={skipToTargetIndex}
          />
        }
        secondaryActions={secondaryActions}
        errorText={errorText}
        errorIconAriaLabel={i18nStrings.errorIconAriaLabel}
        {...funnelStepProps}
      >
        {content}
      </InternalForm>
    </>
  );
}

function findSkipToTargetIndex(steps: ReadonlyArray<WizardProps.Step>, activeStepIndex: number): number {
  let nextRequiredStepIndex = activeStepIndex;
  do {
    nextRequiredStepIndex++;
  } while (nextRequiredStepIndex < steps.length - 1 && steps[nextRequiredStepIndex].isOptional);

  return nextRequiredStepIndex > activeStepIndex + 1 ? nextRequiredStepIndex : -1;
}
