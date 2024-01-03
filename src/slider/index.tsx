// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import styles from './styles.css.js';
import { getBaseProps } from '../internal/base-component';
import { SliderProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { fireNonCancelableEvent } from '../internal/events';

export { SliderProps };

export default function Slider({ value, min, max, onChange, step, disabled, ariaLabel, ...rest }: SliderProps) {
  const { __internalRootRef } = useBaseComponent('Slider');
  const baseProps = getBaseProps(rest);

  const handleChange = (value: string) => {
    fireNonCancelableEvent(onChange, { value });
  };

  return (
    <div className={styles['slider-container']}>
      <input
        aria-label={ariaLabel}
        ref={__internalRootRef}
        className={styles.slider}
        type="range"
        value={value ?? ''}
        min={min}
        max={max}
        disabled={disabled}
        step={step}
        onChange={onChange && (event => handleChange(event.target.value))}
        {...baseProps}
      />
      <div className={styles['slider-labels']}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

applyDisplayName(Slider, 'Slider');
