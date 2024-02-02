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
import { useFormFieldContext } from '../internal/context/form-field-context';

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
  referenceValues,
  hideTooltip,
  thumbOnly,
  valueFormatter,
  variant = 'default',
  ...rest
}: SliderProps) {
  const { __internalRootRef } = useBaseComponent('Slider');
  const baseProps = getBaseProps(rest);

  const rv0 = rangeValue ? rangeValue[0] : 0;
  const rv1 = rangeValue ? rangeValue[1] : 1;
  const range = useRef<HTMLDivElement>(null);
  const tooltip = useRef<HTMLDivElement>(null);
  const referenceValueRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const [tooltipWidth, setTooltipWidth] = React.useState(0);

  // Set width of the range to decrease from the left side
  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;
  const minPercent = getPercent(Math.max(Math.min(rv0, max), min));
  const maxPercent = getPercent(Math.max(Math.min(rv1, max), min));

  const percent = value !== undefined && getPercent(Math.max(Math.min(value, max), min));

  const formFieldContext = useFormFieldContext(rest);

  const getStepArray = (step: number) => {
    const steps = [];

    for (let i = min; i <= max; i = i + step) {
      steps.push(i);
    }
    return steps;
  };

  useLayoutEffect(() => {
    if (tooltip.current) {
      tooltip.current.style.left = `calc(${percent}% - ${tooltipWidth}px / 2)`;
    }

    setTooltipWidth(tooltip.current?.offsetWidth ?? 0);
  }, [tooltipVisible, percent, tooltipWidth]);

  useLayoutEffect(() => {
    referenceValueRefs.current = referenceValueRefs.current.slice(0, referenceValues?.length);

    if (referenceValueRefs.current) {
      referenceValueRefs.current.map(item => item && (item.style.marginLeft = `-${item.clientWidth / 2}px`));
    }
  }, [referenceValues?.length]);

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
        {!hideTooltip && tooltipVisible && variant === 'default' && value !== undefined && (
          <div
            style={{ left: tooltipWidth ? `calc(${percent}% - ${tooltipWidth}px / 2` : `${percent}%` }}
            className={styles['slider-thumb-label']}
            ref={tooltip}
          >
            {valueFormatter ? valueFormatter(value) : value}
          </div>
        )}
        <div className={styles['slider-track']} />
        {step && (
          <>
            <div className={clsx(styles.ticks)}>
              {getStepArray(step).map((step, index) => (
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
                    [styles['tick-filled']]: !thumbOnly && value && value > step,
                  })}
                ></div>
              ))}
            </div>
          </>
        )}
        {!thumbOnly && (
          <div
            ref={range}
            className={clsx(styles['slider-range'], {
              [styles.disabled]: disabled,
              [styles.error]: error,
            })}
          />
        )}
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
            [styles.disabled]: disabled,
          })}
        />
      )}

      <input
        aria-label={ariaLabel}
        aria-labelledby={formFieldContext.ariaLabelledby}
        ref={__internalRootRef}
        type="range"
        min={min}
        max={max}
        disabled={disabled}
        onFocus={() => setTooltipVisible(true)}
        onBlur={() => setTooltipVisible(false)}
        step={step}
        value={value ?? ''}
        onChange={event => {
          onChange && fireNonCancelableEvent(onChange, { value: Number(event.target.value) });
          onRangeChange &&
            fireNonCancelableEvent(onRangeChange, { value: [rv0, Math.max(Number(event.target.value), rv0 + 1)] });
        }}
        className={clsx(styles.thumb, {
          [styles['thumb-right']]: variant === 'range',
          [styles.error]: error,
          [styles.disabled]: disabled,
        })}
        {...baseProps}
      />

      <div className={clsx(styles['slider-labels'])}>
        <span>{valueFormatter ? valueFormatter(min) : min}</span>
        {referenceValues &&
          referenceValues.length > 0 &&
          referenceValues.map((step, index) => {
            return (
              <span
                ref={el => (referenceValueRefs.current[index] = el)}
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
                {valueFormatter ? valueFormatter(step) : step}
              </span>
            );
          })}
        <span>{valueFormatter ? valueFormatter(max) : max}</span>
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
