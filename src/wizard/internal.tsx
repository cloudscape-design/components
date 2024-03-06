// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useControllable } from '../internal/hooks/use-controllable';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { getContentHeaderClassName } from '../internal/utils/content-header-utils';

import { useInternalI18n } from '../i18n/context';

import { FunnelMetrics } from '../internal/analytics';
import { useFunnel } from '../internal/analytics/hooks/use-funnel';
import { getNameFromSelector, getSubStepAllSelector } from '../internal/analytics/selectors';

import WizardForm, { STEP_NAME_SELECTOR } from './wizard-form';
import WizardNavigation from './wizard-navigation';

import { WizardProps } from './interfaces';

import styles from './styles.css.js';
import { useFunnelChangeEvent } from './analytics';
import { shouldRemoveHighContrastHeader } from '../internal/utils/content-header-utils';

type InternalWizardProps = WizardProps & InternalBaseComponentProps;

export default function InternalWizard({
  steps,
  activeStepIndex: controlledActiveStepIndex,
  submitButtonText,
  isLoadingNextStep = false,
  allowSkipTo = false,
  secondaryActions,
  onCancel,
  onSubmit,
  onNavigate,
  __internalRootRef,
  ...rest
}: InternalWizardProps) {
  const baseProps = getBaseProps(rest);

  const [breakpoint, breakpointsRef] = useContainerBreakpoints(['xs']);
  const ref = useMergeRefs(breakpointsRef, __internalRootRef);

  const smallContainer = breakpoint === 'default';

  const [activeStepIndex, setActiveStepIndex] = useControllable(controlledActiveStepIndex, onNavigate, 0, {
    componentName: 'Wizard',
    controlledProp: 'activeStepIndex',
    changeHandler: 'onNavigate',
  });
  const { funnelInteractionId, funnelSubmit, funnelCancel, funnelProps, funnelNextOrSubmitAttempt } = useFunnel();
  const actualActiveStepIndex = activeStepIndex ? Math.min(activeStepIndex, steps.length - 1) : 0;

  const farthestStepIndex = useRef<number>(actualActiveStepIndex);
  farthestStepIndex.current = Math.max(farthestStepIndex.current, actualActiveStepIndex);

  const isVisualRefresh = useVisualRefresh();
  const isLastStep = actualActiveStepIndex >= steps.length - 1;

  const navigationEvent = (requestedStepIndex: number, reason: WizardProps.NavigationReason) => {
    if (funnelInteractionId) {
      const stepName = getNameFromSelector(STEP_NAME_SELECTOR);

      FunnelMetrics.funnelStepNavigation({
        navigationType: reason,
        funnelInteractionId,
        stepNumber: actualActiveStepIndex + 1,
        stepName,
        stepNameSelector: STEP_NAME_SELECTOR,
        destinationStepNumber: requestedStepIndex + 1,
        subStepAllSelector: getSubStepAllSelector(),
      });
    }

    setActiveStepIndex(requestedStepIndex);
    fireNonCancelableEvent(onNavigate, { requestedStepIndex, reason });
  };
  const onStepClick = (stepIndex: number) => navigationEvent(stepIndex, 'step');
  const onSkipToClick = (stepIndex: number) => navigationEvent(stepIndex, 'skip');
  const onCancelClick = () => {
    funnelCancel();
    fireNonCancelableEvent(onCancel);
  };
  const onPreviousClick = () => navigationEvent(actualActiveStepIndex - 1, 'previous');
  const onPrimaryClick = () => {
    funnelNextOrSubmitAttempt();

    if (isLastStep) {
      funnelSubmit();
      fireNonCancelableEvent(onSubmit);
    } else {
      navigationEvent(actualActiveStepIndex + 1, 'next');
    }
  };

  useFunnelChangeEvent(funnelInteractionId, steps);

  const i18n = useInternalI18n('wizard');
  const skipToButtonLabel = i18n(
    'i18nStrings.skipToButtonLabel',
    rest.i18nStrings?.skipToButtonLabel,
    format => task => format({ task__title: task.title })
  );

  const i18nStrings: WizardProps.I18nStrings = {
    ...rest.i18nStrings,
    skipToButtonLabel,
    stepNumberLabel: i18n(
      'i18nStrings.stepNumberLabel',
      rest.i18nStrings?.stepNumberLabel,
      format => stepNumber => format({ stepNumber })
    ),
    collapsedStepsLabel: i18n(
      'i18nStrings.collapsedStepsLabel',
      rest.i18nStrings?.collapsedStepsLabel,
      format => (stepNumber, stepsCount) => format({ stepNumber, stepsCount })
    ),
    navigationAriaLabel: i18n('i18nStrings.navigationAriaLabel', rest.i18nStrings?.navigationAriaLabel),
    cancelButton: i18n('i18nStrings.cancelButton', rest.i18nStrings?.cancelButton),
    previousButton: i18n('i18nStrings.previousButton', rest.i18nStrings?.previousButton),
    nextButton: i18n('i18nStrings.nextButton', rest.i18nStrings?.nextButton),
    optional: i18n('i18nStrings.optional', rest.i18nStrings?.optional),
  };

  if (activeStepIndex && activeStepIndex >= steps.length) {
    warnOnce(
      'Wizard',
      `You have set \`activeStepIndex\` to ${activeStepIndex} but you have provided only ${
        steps.length
      } steps. Its value is ignored and the component uses ${steps.length - 1} instead.`
    );
  }

  if (allowSkipTo && !skipToButtonLabel) {
    warnOnce(
      'Wizard',
      `You have set \`allowSkipTo\` but you have not provided \`i18nStrings.skipToButtonLabel\`. The skip-to button will not be rendered.`
    );
  }

  return (
    <div {...baseProps} {...funnelProps} ref={ref} className={clsx(styles.root, baseProps.className)}>
      <div
        className={clsx(
          styles.wizard,
          isVisualRefresh && styles.refresh,
          smallContainer && styles['small-container'],
          shouldRemoveHighContrastHeader() && styles['remove-high-contrast-header']
        )}
      >
        <WizardNavigation
          activeStepIndex={actualActiveStepIndex}
          farthestStepIndex={farthestStepIndex.current}
          allowSkipTo={allowSkipTo}
          hidden={smallContainer}
          i18nStrings={i18nStrings}
          isVisualRefresh={isVisualRefresh}
          isLoadingNextStep={isLoadingNextStep}
          onStepClick={onStepClick}
          onSkipToClick={onSkipToClick}
          steps={steps}
        />
        <div
          className={clsx(
            styles.form,
            isVisualRefresh && styles.refresh,
            smallContainer && styles['small-container'],
            shouldRemoveHighContrastHeader() && styles['remove-high-contrast-header']
          )}
        >
          {isVisualRefresh && <div className={clsx(styles.background, getContentHeaderClassName())} />}
          <WizardForm
            steps={steps}
            isVisualRefresh={isVisualRefresh}
            showCollapsedSteps={smallContainer}
            i18nStrings={i18nStrings}
            submitButtonText={submitButtonText}
            activeStepIndex={actualActiveStepIndex}
            isPrimaryLoading={isLoadingNextStep}
            allowSkipTo={allowSkipTo}
            secondaryActions={secondaryActions}
            onCancelClick={onCancelClick}
            onPreviousClick={onPreviousClick}
            onSkipToClick={onSkipToClick}
            onPrimaryClick={onPrimaryClick}
          />
        </div>
      </div>
    </div>
  );
}
