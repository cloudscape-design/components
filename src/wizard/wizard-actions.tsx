// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import { InternalButton } from '../button/internal';
import InternalSpaceBetween from '../space-between/internal';
import styles from './styles.css.js';
import { ButtonProps } from '../button/interfaces';
import Unmount from './unmount';

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
        <InternalButton className={styles['cancel-button']} variant="link" formAction="none" onClick={onCancelClick}>
          {cancelButtonText}
        </InternalButton>
        {showSkipTo && skipToButtonText && (
          <Unmount onUnmount={onSkipUnmount}>
            <InternalButton
              className={styles['skip-to-button']}
              onClick={onSkipToClick}
              formAction="none"
              disabled={isPrimaryLoading}
            >
              {skipToButtonText}
            </InternalButton>
          </Unmount>
        )}
        {showPrevious && (
          <Unmount onUnmount={onPreviousUnmount}>
            <InternalButton
              className={styles['previous-button']}
              onClick={onPreviousClick}
              formAction="none"
              disabled={isPrimaryLoading}
            >
              {previousButtonText}
            </InternalButton>
          </Unmount>
        )}
        <InternalButton
          ref={primaryButtonRef}
          className={styles['primary-button']}
          variant="primary"
          formAction="none"
          onClick={onPrimaryClick}
          loading={isPrimaryLoading}
          loadingText={primaryButtonLoadingText}
        >
          {primaryButtonText}
        </InternalButton>
      </InternalSpaceBetween>
    </div>
  );
}
