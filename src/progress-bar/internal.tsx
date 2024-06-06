// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { BoxProps } from '../box/interfaces';
import InternalBox from '../box/internal';
import { ButtonProps } from '../button/interfaces';
import { InternalButton } from '../button/internal';
import InternalStatusIndicator from '../status-indicator/internal';

import { ProgressBarProps } from './interfaces';
import styles from './styles.css.js';

const MAX_VALUE = 100;

const clamp = (value: number, lowerLimit: number, upperLimit: number) => {
  return Math.max(Math.min(value, upperLimit), lowerLimit);
};

interface ProgressProps {
  value: number;
  isInFlash: boolean;
  ariaLabel?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}
export const Progress = ({ value, isInFlash, ariaLabel, ariaLabelledby, ariaDescribedby }: ProgressProps) => {
  const roundedValue = Math.round(value);
  const progressValue = clamp(roundedValue, 0, MAX_VALUE);

  return (
    <div className={styles['progress-container']}>
      <progress
        className={clsx(
          styles.progress,
          progressValue >= MAX_VALUE && styles.complete,
          isInFlash && styles['progress-in-flash']
        )}
        max={MAX_VALUE}
        value={progressValue}
        aria-label={ariaLabel}
        // Ensures aria-label takes precedence over aria-labelledby
        aria-labelledby={!ariaLabel ? ariaLabelledby : undefined}
        aria-describedby={ariaDescribedby}
      />
      <span aria-hidden="true" className={styles['percentage-container']}>
        <InternalBox className={styles.percentage} variant="small" color={isInFlash ? 'inherit' : undefined}>
          {`${progressValue}%`}
        </InternalBox>
      </span>
    </div>
  );
};

interface SmallTextProps {
  color?: BoxProps.Color;
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export const SmallText = ({ color, children, className, id }: SmallTextProps) => {
  return (
    <InternalBox className={clsx(styles['word-wrap'], className)} variant="small" display="block" color={color} id={id}>
      {children}
    </InternalBox>
  );
};

const ResultButton = ({ onClick, children }: ButtonProps) => {
  return (
    <div className={styles['result-button']}>
      <InternalButton formAction="none" onClick={onClick}>
        {children}
      </InternalButton>
    </div>
  );
};

interface ResultStateProps {
  isInFlash: boolean;
  resultText: React.ReactNode;
  resultButtonText?: string;
  status: ProgressBarProps.Status;
  onClick: () => void;
}

export const ResultState = ({ isInFlash, resultText, resultButtonText, status, onClick }: ResultStateProps) => {
  const hasResultButton = !!resultButtonText;

  if (isInFlash) {
    return (
      <div className={styles[`result-container-${status}`]} aria-live="polite" aria-atomic="true">
        <span className={styles['result-text']}>{resultText}</span>
      </div>
    );
  }

  return (
    <div className={styles[`result-container-${status}`]} aria-live="polite" aria-atomic="true">
      <span className={clsx(hasResultButton && styles['with-result-button'])}>
        <InternalStatusIndicator type={status === 'success' ? 'success' : 'error'}>
          <span className={styles['result-text']}>{resultText}</span>
        </InternalStatusIndicator>
      </span>
      {hasResultButton && <ResultButton onClick={onClick}>{resultButtonText}</ResultButton>}
    </div>
  );
};
