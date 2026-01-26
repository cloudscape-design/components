// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import InternalBox from '../box/internal';
import InternalIcon from '../icon/internal';
import Dropdown from '../internal/components/dropdown';
import OptionsList from '../internal/components/options-list';
import { WizardProps } from './interfaces';

import styles from './styles.css.js';

interface WizardStepNavigationDropdownProps {
  activeStepIndex: number;
  farthestStepIndex: number;
  allowSkipTo: boolean;
  i18nStrings: WizardProps.I18nStrings;
  isLoadingNextStep: boolean;
  onStepClick: (stepIndex: number) => void;
  onSkipToClick: (stepIndex: number) => void;
  steps: ReadonlyArray<WizardProps.Step>;
}

export default function WizardStepNavigationDropdown({
  activeStepIndex,
  farthestStepIndex,
  allowSkipTo,
  i18nStrings,
  isLoadingNextStep,
  onStepClick,
  onSkipToClick,
  steps,
}: WizardStepNavigationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const collapsedStepsLabel = i18nStrings.collapsedStepsLabel?.(activeStepIndex + 1, steps.length);

  // A step is reachable if it's the current step, a previously visited step, or the immediate next step
  const isStepReachable = (index: number): boolean => {
    if (isLoadingNextStep) {
      return false;
    }
    // Current step or any previously visited step
    if (index <= farthestStepIndex) {
      return true;
    }
    // Immediate next step is always reachable
    if (index === activeStepIndex + 1) {
      return true;
    }
    // Skip-to: all intermediate steps must be optional
    if (allowSkipTo) {
      for (let i = activeStepIndex + 1; i < index; i++) {
        if (!steps[i].isOptional) {
          return false;
        }
      }
      return true;
    }
    return false;
  };

  const handleStepClick = (stepIndex: number) => {
    if (!isStepReachable(stepIndex)) {
      return;
    }

    // Close dropdown first
    setIsOpen(false);

    // Don't navigate if already on this step
    if (stepIndex === activeStepIndex) {
      return;
    }

    // Use 'skip' for forward navigation to unvisited steps, 'step' otherwise
    if (stepIndex > farthestStepIndex) {
      onSkipToClick(stepIndex);
    } else {
      onStepClick(stepIndex);
    }
  };

  const trigger = (
    <button
      type="button"
      className={styles['collapsed-steps-trigger']}
      onClick={() => setIsOpen(!isOpen)}
      aria-label={i18nStrings.navigationAriaLabel}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      disabled={isLoadingNextStep}
    >
      <InternalIcon name="menu" />
      <span className={styles['collapsed-steps-trigger-label']}>{collapsedStepsLabel}</span>
      <InternalIcon name="caret-down-filled" />
    </button>
  );

  return (
    <div className={styles['collapsed-steps-navigation']}>
      <Dropdown
        open={!isLoadingNextStep && isOpen}
        onDropdownClose={() => setIsOpen(false)}
        trigger={trigger}
        stretchWidth={false}
        expandToViewport={false}
      >
        <OptionsList
          open={isOpen}
          position="static"
          role="listbox"
          tagOverride="ul"
          decreaseBlockMargin={true}
          ariaLabel={i18nStrings.navigationAriaLabel}
          statusType="finished"
        >
          <ul className={styles['step-navigation-dropdown-list']} role="listbox">
            {steps.map((step, index) => {
              const isActive = activeStepIndex === index;
              const isReachable = isStepReachable(index);
              const stepLabel = i18nStrings.stepNumberLabel?.(index + 1) ?? `Step ${index + 1}`;

              return (
                <li
                  key={index}
                  role="option"
                  aria-selected={isActive}
                  aria-disabled={!isReachable}
                  className={clsx(
                    styles['step-navigation-dropdown-item'],
                    isActive && styles['step-navigation-dropdown-item-active'],
                    !isReachable && styles['step-navigation-dropdown-item-disabled']
                  )}
                  onClick={() => handleStepClick(index)}
                >
                  <span
                    className={clsx(
                      styles['step-navigation-dropdown-circle'],
                      isActive && styles['step-navigation-dropdown-circle-active'],
                      !isActive && isReachable && styles['step-navigation-dropdown-circle-reachable'],
                      !isReachable && styles['step-navigation-dropdown-circle-disabled']
                    )}
                    aria-hidden="true"
                  />
                  <span className={styles['step-navigation-dropdown-content']}>
                    <InternalBox
                      variant="small"
                      color={!isReachable ? 'text-status-inactive' : undefined}
                      display="block"
                    >
                      {stepLabel}
                    </InternalBox>
                    <span
                      className={clsx(
                        styles['step-navigation-dropdown-title'],
                        isActive && styles['step-navigation-dropdown-title-active'],
                        !isReachable && styles['step-navigation-dropdown-title-disabled']
                      )}
                    >
                      {step.title}
                      {step.isOptional && <i>{` - ${i18nStrings.optional}`}</i>}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </OptionsList>
      </Dropdown>
    </div>
  );
}
