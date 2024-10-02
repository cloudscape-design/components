// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import InternalSpaceBetween from '../space-between/internal';
import { getNavigationActionDetail } from './analytics-metadata/utils';
import Unmount from './unmount';

import styles from './styles.css.js';

interface WizardActionsProps {
  cancelButtonText?: string;
  onCancelClick: () => void;
  isPrimaryLoading: boolean;
  primaryButtonText?: string;
  primaryButtonLoadingText?: string;
  onPrimaryClick: () => void;
  showPrevious: boolean;
  previousButtonText?: string;
  onPreviousClick: () => void;
  showSkipTo: boolean;
  skipToButtonText?: string;
  onSkipToClick: () => void;
  isLastStep: boolean;
  activeStepIndex: number;
  skipToStepIndex: number;
}

export default function WizardActions({
  cancelButtonText,
  onCancelClick,
  isPrimaryLoading,
  primaryButtonText,
  primaryButtonLoadingText,
  onPrimaryClick,
  showPrevious,
  previousButtonText,
  onPreviousClick,
  showSkipTo,
  skipToButtonText,
  onSkipToClick,
  isLastStep,
  activeStepIndex,
  skipToStepIndex,
}: WizardActionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<ButtonProps.Ref>(null);

  const onPreviousUnmount = () => {
    if (containerRef.current?.querySelector(`.${styles['previous-button']}`) === document.activeElement) {
      primaryButtonRef.current?.focus();
    }
  };

  const onSkipUnmount = () => {
    if (containerRef.current?.querySelector(`.${styles['skip-to-button']}`) === document.activeElement) {
      primaryButtonRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef}>
      <InternalSpaceBetween direction="horizontal" size="xs" className={styles['action-buttons']}>
        <InternalButton
          className={styles['cancel-button']}
          variant="link"
          formAction="none"
          onClick={onCancelClick}
          analyticsAction="cancel"
        >
          {cancelButtonText}
        </InternalButton>
        {showSkipTo && skipToButtonText && (
          <Unmount onUnmount={onSkipUnmount}>
            <span {...getNavigationActionDetail(skipToStepIndex, 'skip')}>
              <InternalButton
                className={styles['skip-to-button']}
                onClick={onSkipToClick}
                formAction="none"
                disabled={isPrimaryLoading}
                analyticsAction="navigate"
              >
                {skipToButtonText}
              </InternalButton>
            </span>
          </Unmount>
        )}
        {showPrevious && (
          <Unmount onUnmount={onPreviousUnmount}>
            <span {...getNavigationActionDetail(activeStepIndex - 1, 'previous')}>
              <InternalButton
                className={styles['previous-button']}
                onClick={onPreviousClick}
                formAction="none"
                disabled={isPrimaryLoading}
                analyticsAction="navigate"
              >
                {previousButtonText}
              </InternalButton>
            </span>
          </Unmount>
        )}
        <span {...(isLastStep ? {} : getNavigationActionDetail(activeStepIndex + 1, 'next'))}>
          <InternalButton
            ref={primaryButtonRef}
            className={styles['primary-button']}
            variant="primary"
            formAction="none"
            onClick={onPrimaryClick}
            loading={isPrimaryLoading}
            loadingText={primaryButtonLoadingText}
            analyticsAction={isLastStep ? 'submit' : 'navigate'}
          >
            {primaryButtonText}
          </InternalButton>
        </span>
      </InternalSpaceBetween>
    </div>
  );
}
