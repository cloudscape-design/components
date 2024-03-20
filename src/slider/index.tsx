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
import { useFormFieldContext } from '../internal/context/form-field-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import Tooltip from './tooltip.js';
import SliderLabels from './slider-labels.js';

export { SliderProps };

export default function Slider({
  value,
  min,
  max,
  onChange,
  step,
  disabled,
  invalid,
  ariaLabel,
  referenceValues,
  tickMarks,
  hideFillLine,
  valueFormatter,
  ...rest
}: SliderProps) {
  const { __internalRootRef } = useBaseComponent('Slider');
  const baseProps = getBaseProps(rest);

  const range = useRef<HTMLDivElement>(null);
  const [showPopover, setShowPopover] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const handleRef = useRef<HTMLDivElement>(null);
  const labelsId = useUniqueId('labels');

  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;
  const percent = value !== undefined && getPercent(Math.max(Math.min(value, max), min));

  const formFieldContext = useFormFieldContext(rest);
  const tooltipPositionAdjust = value !== undefined && (value <= min ? 8 : value >= max ? 24 : 16);

  const getStepArray = (step: number) => {
    const steps = [];

    for (let i = min; i <= max; i = i + step) {
      steps.push(i);
    }
    return steps;
  };

  const getTickMarkPositions = (step: number) => {
    return ((step - min) / (max - min)) * 100 > 100
      ? '100%'
      : ((step - min) / (max - min)) * 100 < 0
      ? '0%'
      : `${((step - min) / (max - min)) * 100}%`;
  };

  useEffect(() => {
    if (range.current) {
      range.current.style.width = `${percent}%`;
    }
  }, [percent, showPopover]);

  const popoverContent = value !== undefined && (
    <Tooltip value={valueFormatter ? valueFormatter(value) : value} trackRef={handleRef} />
  );

  return (
    <div className={styles['slider-container']}>
      <div className={styles.slider}>
        <div
          ref={handleRef}
          className={clsx(styles['tooltip-thumb'])}
          style={{
            insetInlineStart: `calc(${percent}% - ${tooltipPositionAdjust}px)`,
          }}
        />
        {showPopover && popoverContent}
        <div
          className={clsx(styles['slider-track'], {
            [styles.disabled]: disabled,
          })}
        />
        {step && tickMarks && (
          <>
            <div className={clsx(styles.ticks)}>
              {getStepArray(step).map((step, index) => (
                <div
                  key={`step-${index}`}
                  style={{
                    insetInlineStart: getTickMarkPositions(step),
                  }}
                  className={clsx(styles.tick, {
                    [styles['tick-filled']]: !hideFillLine && value && value > step,
                  })}
                ></div>
              ))}
            </div>
          </>
        )}
        {!hideFillLine && (
          <div
            ref={range}
            className={clsx(styles['slider-range'], {
              [styles.disabled]: disabled,
              [styles.error]: invalid,
              [styles.active]: isActive,
            })}
          />
        )}
      </div>

      <input
        aria-label={ariaLabel}
        aria-labelledby={formFieldContext.ariaLabelledby}
        aria-describedby={formFieldContext.ariaDescribedby}
        ref={__internalRootRef}
        type="range"
        list={labelsId}
        min={min}
        max={max}
        disabled={disabled}
        onFocus={() => {
          setShowPopover(true);
          setIsActive(true);
        }}
        onBlur={() => {
          setShowPopover(false);
          setIsActive(false);
        }}
        onMouseEnter={() => {
          setShowPopover(true);
        }}
        onMouseLeave={() => {
          setShowPopover(false);
        }}
        step={step}
        value={value ?? ''}
        onChange={event => {
          onChange && fireNonCancelableEvent(onChange, { value: Number(event.target.value) });
        }}
        className={clsx(styles.thumb, {
          [styles.error]: invalid,
          [styles.disabled]: disabled,
          [styles.min]: value !== undefined && value <= min,
          [styles.max]: value !== undefined && value >= max,
        })}
        {...baseProps}
      />

      <SliderLabels
        min={min}
        max={max}
        referenceValues={referenceValues}
        valueFormatter={valueFormatter}
        labelsId={labelsId}
      />
    </div>
  );
}

applyDisplayName(Slider, 'Slider');
