// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { warnOnce } from '../internal/logging';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useControllable } from '../internal/hooks/use-controllable';
import WizardForm from './wizard-form';
import WizardNavigation from './wizard-navigation';
import { WizardProps } from './interfaces';
import styles from './styles.css.js';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';

export { WizardProps };

const scrollToTop = (ref: React.RefObject<HTMLDivElement>) => {
  const overflowRegex = /(auto|scroll)/;
  let parent = ref?.current?.parentElement;
  while (parent && !overflowRegex.test(getComputedStyle(parent).overflow)) {
    parent = parent.parentElement;
  }
  if (parent) {
    parent.scrollTop = 0;
  } else {
    window.scrollTo(window.pageXOffset, 0);
  }
};

export default function Wizard({
  steps,
  activeStepIndex: controlledActiveStepIndex,
  i18nStrings,
  isLoadingNextStep = false,
  allowSkipTo = false,
  secondaryActions,
  onCancel,
  onSubmit,
  onNavigate,
  ...rest
}: WizardProps) {
  const { __internalRootRef } = useBaseComponent('Wizard');
  const baseProps = getBaseProps(rest);

  const [breakpoint, breakpointsRef] = useContainerBreakpoints(['xs']);
  const ref = useMergeRefs(breakpointsRef, __internalRootRef);

  const smallContainer = breakpoint === 'default';

  const [activeStepIndex, setActiveStepIndex] = useControllable(controlledActiveStepIndex, onNavigate, 0, {
    componentName: 'Wizard',
    controlledProp: 'activeStepIndex',
    changeHandler: 'onNavigate',
  });
  const actualActiveStepIndex = activeStepIndex ? Math.min(activeStepIndex, steps.length - 1) : 0;

  const farthestStepIndex = useRef<number>(actualActiveStepIndex);
  farthestStepIndex.current = Math.max(farthestStepIndex.current, actualActiveStepIndex);

  const internalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollToTop(internalRef);
  }, [actualActiveStepIndex]);

  const isVisualRefresh = useVisualRefresh();
  const isLastStep = actualActiveStepIndex >= steps.length - 1;

  const navigationEvent = (requestedStepIndex: number, reason: WizardProps.NavigationReason) => {
    setActiveStepIndex(requestedStepIndex);
    fireNonCancelableEvent(onNavigate, { requestedStepIndex, reason });
  };
  const onStepClick = (stepIndex: number) => navigationEvent(stepIndex, 'step');
  const onSkipToClick = (stepIndex: number) => navigationEvent(stepIndex, 'skip');
  const onCancelClick = () => fireNonCancelableEvent(onCancel);
  const onPreviousClick = () => navigationEvent(actualActiveStepIndex - 1, 'previous');
  const onPrimaryClick = isLastStep
    ? () => fireNonCancelableEvent(onSubmit)
    : () => navigationEvent(actualActiveStepIndex + 1, 'next');

  if (activeStepIndex && activeStepIndex >= steps.length) {
    warnOnce(
      'Wizard',
      `You have set \`activeStepIndex\` to ${activeStepIndex} but you have provided only ${
        steps.length
      } steps. Its value is ignored and the component uses ${steps.length - 1} instead.`
    );
  }

  if (allowSkipTo && !i18nStrings.skipToButtonLabel) {
    warnOnce(
      'Wizard',
      `You have set \`allowSkipTo\` but you have not provided \`i18nStrings.skipToButtonLabel\`. The skip-to button will not be rendered.`
    );
  }

  return (
    <div {...baseProps} className={clsx(styles.root, baseProps.className)} ref={ref}>
      <div
        className={clsx(styles.wizard, isVisualRefresh && styles.refresh, smallContainer && styles['small-container'])}
        ref={internalRef}
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
          className={clsx(styles.form, isVisualRefresh && styles.refresh, smallContainer && styles['small-container'])}
        >
          {isVisualRefresh && <div className={clsx(styles.background, 'awsui-context-content-header')} />}

          <WizardForm
            steps={steps}
            isVisualRefresh={isVisualRefresh}
            showCollapsedSteps={smallContainer}
            i18nStrings={i18nStrings}
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

applyDisplayName(Wizard, 'Wizard');
