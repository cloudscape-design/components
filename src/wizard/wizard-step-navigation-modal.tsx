// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import InternalBox from '../box/internal';
import { InternalButton } from '../button/internal';
import InternalIcon from '../icon/internal';
import InternalModal from '../modal/internal';
import InternalSpaceBetween from '../space-between/internal';
import { WizardProps } from './interfaces';

import styles from './styles.css.js';

interface WizardStepNavigationModalProps {
  activeStepIndex: number;
  farthestStepIndex: number;
  allowSkipTo: boolean;
  i18nStrings: WizardProps.I18nStrings;
  isLoadingNextStep: boolean;
  onStepClick: (stepIndex: number) => void;
  onSkipToClick: (stepIndex: number) => void;
  steps: ReadonlyArray<WizardProps.Step>;
}

export default function WizardStepNavigationModal({
  activeStepIndex,
  farthestStepIndex,
  allowSkipTo,
  i18nStrings,
  isLoadingNextStep,
  onStepClick,
  onSkipToClick,
  steps,
}: WizardStepNavigationModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState(activeStepIndex);

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

  const handleOpenModal = () => {
    setSelectedStepIndex(activeStepIndex);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () => {
    if (selectedStepIndex !== activeStepIndex) {
      // Use 'skip' for forward navigation to unvisited steps, 'step' otherwise
      if (selectedStepIndex > farthestStepIndex) {
        onSkipToClick(selectedStepIndex);
      } else {
        onStepClick(selectedStepIndex);
      }
    }
    setIsModalVisible(false);
  };

  const handleStepSelect = (stepIndex: number) => {
    if (isStepReachable(stepIndex)) {
      setSelectedStepIndex(stepIndex);
    }
  };

  return (
    <div className={styles['collapsed-steps-navigation']}>
      <button
        type="button"
        className={styles['collapsed-steps-trigger']}
        onClick={handleOpenModal}
        aria-label={i18nStrings.navigationAriaLabel}
        disabled={isLoadingNextStep}
      >
        <InternalIcon name="menu" />
        <span className={styles['collapsed-steps-trigger-label']}>{collapsedStepsLabel}</span>
      </button>

      <InternalModal
        visible={isModalVisible}
        onDismiss={handleCloseModal}
        header={i18nStrings.stepNavigationTitle ?? 'Step'}
        size="small"
        closeAriaLabel={i18nStrings.stepNavigationDismissAriaLabel}
        footer={
          <InternalBox float="right">
            <InternalSpaceBetween direction="horizontal" size="xs">
              <InternalButton variant="link" onClick={handleCloseModal}>
                {i18nStrings.cancelButton}
              </InternalButton>
              <InternalButton variant="primary" onClick={handleConfirm}>
                {i18nStrings.stepNavigationConfirmButton ?? 'Ok'}
              </InternalButton>
            </InternalSpaceBetween>
          </InternalBox>
        }
      >
        <ul className={styles['step-navigation-list']} role="radiogroup" aria-label={i18nStrings.navigationAriaLabel}>
          {steps.map((step, index) => {
            const isSelected = selectedStepIndex === index;
            const isReachable = isStepReachable(index);
            const stepLabel = i18nStrings.stepNumberLabel?.(index + 1) ?? `Step ${index + 1}`;

            // Simple: selected (highlighted) or reachable (clickable) or unreachable (disabled)
            const displayStatus = isSelected ? 'selected' : isReachable ? 'visited' : 'unvisited';

            return (
              <li key={index} className={styles['step-navigation-item']}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  aria-disabled={!isReachable}
                  className={clsx(
                    styles['step-navigation-button'],
                    !isReachable && styles['step-navigation-button-disabled']
                  )}
                  onClick={() => handleStepSelect(index)}
                  disabled={!isReachable}
                >
                  <span
                    className={clsx(
                      styles['step-navigation-circle'],
                      styles[`step-navigation-circle-${displayStatus}`]
                    )}
                    aria-hidden="true"
                  />
                  <span className={styles['step-navigation-content']}>
                    <span className={styles['step-navigation-label']}>{stepLabel}</span>
                    <span
                      className={clsx(
                        styles['step-navigation-title'],
                        styles[`step-navigation-title-${displayStatus}`]
                      )}
                    >
                      {step.title}
                      {step.isOptional && <i>{` - ${i18nStrings.optional}`}</i>}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </InternalModal>
    </div>
  );
}
