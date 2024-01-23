// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useLayoutEffect, useRef } from 'react';
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
  error,
  ariaLabel,
  stepLabels,
  variant = 'default',
  ...rest
}: SliderProps) {
  const { __internalRootRef } = useBaseComponent('Slider');
  const baseProps = getBaseProps(rest);

  const rv0 = rangeValue ? rangeValue[0] : 0;
  const rv1 = rangeValue ? rangeValue[1] : 1;
  const range = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const [tooltipWidth, setTooltipWidth] = React.useState(0);

  // Set width of the range to decrease from the left side
  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;
  const minPercent = getPercent(Math.max(Math.min(rv0, max), min));
  const maxPercent = getPercent(Math.max(Math.min(rv1, max), min));

  const percent = value && getPercent(Math.max(Math.min(value, max), min));

  const getStepArray = (step: number) => {
    const steps = [];

    for (let i = min; i <= max; i = i + step) {
      steps.push(i);
    }
    console.log(steps);
    return steps;
  };

  useLayoutEffect(() => {
    if (tooltip.current) {
      tooltip.current.style.left = `calc(${percent}% - ${tooltipWidth}px / 2)`;
    }

    setTooltipWidth(tooltip.current?.offsetWidth ?? 0);
  }, [tooltipVisible, percent, tooltipWidth]);

  useEffect(() => {
    if (range.current && variant === 'range') {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = maxPercent > minPercent ? `${maxPercent - minPercent}%` : `1%`;
    }

    if (range.current && variant === 'default') {
      range.current.style.width = `${percent}%`;
    }
  }, [variant, maxPercent, minPercent, percent]);

  return (
    <div className={styles['slider-container']}>
      <div className={styles.slider}>
        {tooltipVisible && variant === 'default' && (
          <div
            style={{ left: tooltipWidth ? `calc(${percent}% - ${tooltipWidth}px / 2` : `${percent}%` }}
            className={styles['slider-thumb-label']}
            ref={tooltip}
          >
            {value}
          </div>
        )}
        <div className={styles['slider-track']} />
        <datalist id="markers" className={clsx(styles.datalist)}>
          {step && getStepArray(step).map((step, index) => <option key={`step-${index}`} value={step}></option>)}
        </datalist>
        <div className={clsx(styles.ticks)}>
          {step &&
            getStepArray(step).map((step, index) => (
              <div
                key={`step-${index}`}
                style={{
                  left:
                    ((step - min) / (max - min)) * 100 > 100
                      ? '100%'
                      : ((step - min) / (max - min)) * 100 < 0
                      ? '0%'
                      : `${((step - min) / (max - min)) * 100}%`,
                }}
                className={clsx(styles.tick, {
                  [styles['tick-filled']]: value && value > step,
                })}
              ></div>
            ))}
        </div>
        <div
          ref={range}
          className={clsx(styles['slider-range'], {
            [styles.disabled]: disabled,
            [styles.error]: error,
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
          className={clsx(styles.thumb, styles['thumb-left'], {
            [styles.error]: error,
          })}
        />
      )}
      <input
        aria-label={ariaLabel}
        ref={__internalRootRef}
        type="range"
        min={min}
        max={max}
        disabled={disabled}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
        //onMouseOver={() => setTooltipVisible(true)}
        //onMouseOut={() => setTooltipVisible(true)}
        step={step}
        value={variant === 'default' ? value ?? '' : rangeValue ? Math.max(rangeValue[1], rv0 + 1) : ''}
        onChange={event => {
          onChange && fireNonCancelableEvent(onChange, { value: Number(event.target.value) });
          onRangeChange &&
            fireNonCancelableEvent(onRangeChange, { value: [rv0, Math.max(Number(event.target.value), rv0 + 1)] });
        }}
        className={clsx(styles.thumb, {
          [styles['thumb-right']]: variant === 'range',
          [styles.error]: error,
        })}
        list="markers"
        {...baseProps}
      />

      <div className={clsx(styles['slider-labels'])}>
        <span>{min}</span>
        {stepLabels &&
          stepLabels.length > 0 &&
          stepLabels.map((step, index) => {
            return (
              <span
                key={`step-${index}`}
                style={{
                  left:
                    ((step - min) / (max - min)) * 100 > 100
                      ? '100%'
                      : ((step - min) / (max - min)) * 100 < 0
                      ? '0%'
                      : `${((step - min) / (max - min)) * 100}%`,
                }}
                className={clsx(styles['slider-reference'])}
              >
                {step}
              </span>
            );
          })}
        <span>{max}</span>
      </div>
    </div>
  );
}

/*

Min: 50

Max: 100

10

((max - min) / labelNum) + min

*/
applyDisplayName(Slider, 'Slider');
