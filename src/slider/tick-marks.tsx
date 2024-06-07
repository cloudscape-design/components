// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import customCssProps from '../internal/generated/custom-css-properties/index.js';
import styles from './styles.css.js';
import { getStepArray } from './utils.js';

export interface SliderTicksProps {
  hideFillLine?: boolean;
  value: number;
  isActive: boolean;
  invalid?: boolean;
  warning?: boolean;
  disabled?: boolean;
  min: number;
  max: number;
  step: number;
}

export interface SliderTickMarkProps extends SliderTicksProps {
  type: 'min' | 'max' | 'step';
}

function TickMark(props: SliderTickMarkProps) {
  const { hideFillLine, value, isActive, invalid, warning, disabled, type, min, max, step } = props;

  const showWarning = warning && !invalid;

  const getType = () => {
    if (type === 'min') {
      return min;
    }
    if (type === 'max') {
      return max;
    }
    return step;
  };

  return (
    <div
      className={clsx(styles.tick, {
        [styles.filled]: !hideFillLine && value > getType(),
        [styles.active]: !hideFillLine && isActive && value > getType(),
        [styles.error]: invalid && !hideFillLine && value > getType(),
        [styles.warning]: showWarning && !hideFillLine && value > getType(),
        [styles['error-active']]: invalid && isActive && !hideFillLine && value > getType(),
        [styles['warning-active']]: showWarning && isActive && !hideFillLine && value > getType(),
        [styles.disabled]: disabled,
        [styles.middle]: type === 'step',
      })}
    />
  );
}

export default function SliderTickMarks(props: SliderTicksProps) {
  const { min, max, step } = props;

  return (
    <div className={styles['ticks-wrapper']}>
      <TickMark {...props} type="min" />
      <div
        className={styles.ticks}
        style={{
          [customCssProps.sliderTickCount]: Math.round((max - min) / step),
        }}
      >
        {getStepArray(step, [min, max]).map((step, index) => (
          <TickMark {...props} type="step" step={step} key={`step-${index}`} />
        ))}
      </div>
      <TickMark {...props} type="max" />
    </div>
  );
}
