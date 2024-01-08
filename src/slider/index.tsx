// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import { getBaseProps } from '../internal/base-component';
import { SliderProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import { fireNonCancelableEvent } from '../internal/events';

export { SliderProps };

export default function Slider({
  value,
  rangeValue,
  min,
  max,
  onChange,
  onRangeChange,
  step,
  disabled,
  ariaLabel,
  variant = 'default',
  ...rest
}: SliderProps) {
  const { __internalRootRef } = useBaseComponent('Slider');
  const baseProps = getBaseProps(rest);

  const rv0 = rangeValue ? rangeValue[0] : 0;
  const rv1 = rangeValue ? rangeValue[1] : 1;
  const range = useRef<HTMLDivElement>(null);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const getPercent = (value: any) => Math.round(((value - min) / (max - min)) * 100);
    const minPercent = getPercent(rv0);
    const maxPercent = getPercent(rv1);
    const percent = getPercent(value);

    if (range.current && variant === 'range') {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }

    if (range.current && variant === 'default') {
      range.current.style.width = `${percent}%`;
    }
  }, [value, variant, rv0, rv1, min, max]);

  return (
    <div className={styles['slider-container']}>
      <div className={styles.slider}>
        <div className={styles['slider-track']} />
        <div
          ref={range}
          className={clsx(styles['slider-range'], {
            [styles.disabled]: disabled,
          })}
        />
      </div>
      {variant === 'range' && (
        <input
          type="range"
          min={min}
          max={max}
          value={rangeValue ? rangeValue[0] : ''}
          onChange={event => {
            onRangeChange &&
              fireNonCancelableEvent(onRangeChange, { value: [Math.min(Number(event.target.value), rv1 - 1), rv1] });
          }}
          className={clsx(styles.thumb, styles['thumb-left'])}
        />
      )}
      <input
        aria-label={ariaLabel}
        ref={__internalRootRef}
        type="range"
        min={min}
        max={max}
        disabled={disabled}
        step={step}
        value={value ? value : rangeValue ? rangeValue[1] : ''}
        onChange={event => {
          onChange && fireNonCancelableEvent(onChange, { value: Number(event.target.value) });
          onRangeChange &&
            fireNonCancelableEvent(onRangeChange, { value: [rv0, Math.max(Number(event.target.value), rv0 + 1)] });
        }}
        className={clsx(styles.thumb, styles['thumb-right'])}
        {...baseProps}
      />

      <div className={clsx(styles['slider-labels'])}>
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

applyDisplayName(Slider, 'Slider');
