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

  const handleChange = (value: number) => {
    fireNonCancelableEvent(onChange, { value });
  };

  const rv0 = rangeValue ? rangeValue[0] : 0;
  const rv1 = rangeValue ? rangeValue[1] : 1;
  const range = useRef<HTMLDivElement>(null);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    const getPercent = (value: any) => Math.round(((value - min) / (max - min)) * 100);
    const minPercent = getPercent(rv0);
    const maxPercent = getPercent(rv1);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [rv0, rv1, min, max]);

  if (variant === 'default') {
    return (
      <div>
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
          value={rangeValue ? rangeValue[0] : ''}
          onChange={event => {
            onRangeChange &&
              fireNonCancelableEvent(onRangeChange, { value: [Math.min(Number(event.target.value), rv1 - 1), rv1] });
          }}
          className={clsx(styles.thumb, styles['thumb--left'])}
          style={{ zIndex: rv0 > max - 100 ? '5' : undefined }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={rangeValue ? rangeValue[1] : ''}
          onChange={event => {
            onRangeChange &&
              fireNonCancelableEvent(onRangeChange, { value: [rv0, Math.max(Number(event.target.value), rv0 + 1)] });
          }}
          className={clsx(styles.thumb, styles['thumb--right'])}
        />

        <div className={styles.slider}>
          <div className={styles.slider__track} />
          <div ref={range} className={styles.slider__range} />
        </div>

        <div className={clsx(styles['value-slider-labels'], styles['range-slider-labels'])}>
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    );
  }

  return <div />;
}

applyDisplayName(Slider, 'Slider');
