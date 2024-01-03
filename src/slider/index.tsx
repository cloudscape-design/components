// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState, useRef, useCallback } from 'react';
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

  const handleChange = (value: number) => {
    fireNonCancelableEvent(onChange, { value });
  };

  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(value => Math.round(((value - min) / (max - min)) * 100), [min, max]);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onRangeChange && fireNonCancelableEvent(onRangeChange, { value: [minVal, maxVal] });
  }, [minVal, maxVal, onRangeChange]);

  if (variant === 'default') {
    return (
      <div className={styles['slider-container']}>
        <input
          aria-label={ariaLabel}
          ref={__internalRootRef}
          className={styles['value-slider']}
          type="range"
          value={value ?? ''}
          min={min}
          max={max}
          disabled={disabled}
          step={step}
          onChange={onChange && (event => handleChange(Number(event.target.value)))}
          {...baseProps}
        />
        <div className={styles['value-slider-labels']}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }

  if (variant === 'range') {
    return (
      <div className={styles['slider-container']}>
        <input
          type="range"
          min={min}
          max={max}
          value={rangeValue && rangeValue[0]}
          onChange={event => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className={clsx(styles.thumb, styles['thumb--left'])}
          style={{ zIndex: minVal > max - 100 && '5' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={rangeValue && rangeValue[1]}
          onChange={event => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className={clsx(styles.thumb, styles['thumb--right'])}
        />

        <div className={styles.slider}>
          <div className={styles.slider__track} />
          <div ref={range} className={styles.slider__range} />
        </div>

        <div className={styles['value-slider-labels']}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }

  return <div />;
}

applyDisplayName(Slider, 'Slider');
