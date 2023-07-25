// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import InternalForm from '../form/internal';
import InternalHeader from '../header/internal';
import { useMobile } from '../internal/hooks/use-mobile';
import WizardActions from './wizard-actions';
import { WizardProps } from './interfaces';
import WizardFormHeader from './wizard-form-header';
import styles from './styles.css.js';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
import { AnalyticsFunnelStep } from '../internal/analytics/components/analytics-funnel';

interface WizardFormProps {
  steps: ReadonlyArray<WizardProps.Step>;
  activeStepIndex: number;
  isVisualRefresh: boolean;
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

export default function WizardForm({
  steps,
  activeStepIndex,
  isVisualRefresh,
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
}: WizardFormProps) {
  const { title, info, description, content, errorText, isOptional } = steps[activeStepIndex] || {};
  const isLastStep = activeStepIndex >= steps.length - 1;
  const skipToTargetIndex = findSkipToTargetIndex(steps, activeStepIndex);
  const isMobile = useMobile();
  const stepHeaderRef = useRef<HTMLDivElement | null>(null);

  useEffectOnUpdate(() => {
    if (stepHeaderRef && stepHeaderRef.current) {
      stepHeaderRef.current?.focus();
    }
  }, [activeStepIndex]);

  const showSkipTo = allowSkipTo && skipToTargetIndex !== -1;
  const skipToButtonText =
    skipToTargetIndex !== -1 && i18nStrings.skipToButtonLabel
      ? i18nStrings.skipToButtonLabel(steps[skipToTargetIndex], skipToTargetIndex + 1)
      : undefined;

  return (
    <>
      <AnalyticsFunnelStep
        stepNameSelector={`.${styles['form-header-component-wrapper']}`}
        stepNumber={activeStepIndex + 1}
      >
        {({ funnelStepProps }) => (
          <>
            <WizardFormHeader isMobile={isMobile || showCollapsedSteps} isVisualRefresh={isVisualRefresh}>
              <div className={clsx(styles['collapsed-steps'], !showCollapsedSteps && styles['collapsed-steps-hidden'])}>
                {i18nStrings.collapsedStepsLabel?.(activeStepIndex + 1, steps.length)}
              </div>
              <InternalHeader
                className={styles['form-header-component']}
                variant="h1"
                description={description}
                info={info}
              >
                <span className={styles['form-header-component-wrapper']} tabIndex={-1} ref={stepHeaderRef}>
                  {title}
                  {isOptional && <i>{` - ${i18nStrings.optional}`}</i>}
                </span>
              </InternalHeader>
            </WizardFormHeader>

            <InternalForm
              className={clsx(styles['form-component'])}
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
        )}
      </AnalyticsFunnelStep>
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
