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
// import Tooltip from './tooltip.js';
import Tooltip from '../internal/components/tooltip';
import SliderLabels from './slider-labels.js';
import { getPercent, getStepArray, getTickMarkPositions, THUMB_SIZE } from './utils.js';

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

  const rangeRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [showPopover, setShowPopover] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);
  const labelsId = useUniqueId('labels');
  const hasValue = value !== undefined;
  const formFieldContext = useFormFieldContext(rest);

  const percent = hasValue && getPercent(Math.max(Math.min(value, max), min), min, max);

  // at the min and max values, the thumb is not centered.
  const tooltipPositionAdjust =
    hasValue && (value <= min ? THUMB_SIZE - THUMB_SIZE / 2 : value >= max ? THUMB_SIZE + THUMB_SIZE / 2 : THUMB_SIZE);

  useEffect(() => {
    if (rangeRef.current) {
      rangeRef.current.style.width = `${percent}%`;
    }
  }, [percent]);

  const popoverContent = hasValue && (
    <Tooltip value={valueFormatter ? valueFormatter(value) : value} trackRef={handleRef} />
  );

  return (
    <div ref={__internalRootRef} className={styles.root}>
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
          <div className={clsx(styles.ticks)}>
            {getStepArray(step, min, max).map((step, index) => (
              <div
                key={`step-${index}`}
                style={{
                  insetInlineStart: getTickMarkPositions(step, min, max),
                }}
                className={clsx(styles.tick, {
                  [styles['tick-filled']]: !hideFillLine && value && value > step,
                })}
              ></div>
            ))}
          </div>
        )}
        {!hideFillLine && (
          <div
            ref={rangeRef}
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
          [styles.min]: hasValue && value <= min,
          [styles.max]: hasValue && value >= max,
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
