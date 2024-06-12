// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component/index.js';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import { useFormFieldContext } from '../internal/context/form-field-context.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import Tooltip from '../internal/components/tooltip/index.js';
import customCssProps from '../internal/generated/custom-css-properties/index.js';
import { useInternalI18n } from '../i18n/context';

import styles from './styles.css.js';
import { SliderProps } from './interfaces.js';
import SliderLabels from './slider-labels.js';
import SliderTickMarks from './tick-marks.js';
import { getPercent, getStepArray, findLowerAndHigherValues, valuesAreValid, THUMB_SIZE } from './utils.js';

export interface InternalSliderProps extends SliderProps, InternalBaseComponentProps {}

export default function InternalSlider({
  value,
  min,
  max,
  onChange,
  step,
  disabled,
  ariaLabel,
  ariaDescription,
  referenceValues,
  tickMarks,
  hideFillLine,
  valueFormatter,
  i18nStrings,
  __internalRootRef = null,
  ...rest
}: InternalSliderProps) {
  const baseProps = getBaseProps(rest);
  const i18n = useInternalI18n('slider');

  const handleRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const labelsId = useUniqueId('labels');
  const { ariaLabelledby, ariaDescribedby, controlId, invalid, warning } = useFormFieldContext(rest);

  const showWarning = warning && !invalid;

  if (referenceValues && valuesAreValid(referenceValues) === false) {
    warnOnce('Slider', 'All reference values must be integers. Non-integer values will not be displayed.');
  }

  if (min >= max) {
    warnOnce('Slider', 'The min value cannot be greater than the max value.');
  }

  if (step && step > max - min) {
    warnOnce('Slider', 'The step value cannot be greater than the difference between the min and max.');
  }

  if (step && value !== undefined && (value - min) % step !== 0) {
    warnOnce('Slider', 'Slider value must be a multiple of the step. The value will round to the nearest step value.');
  }

  const getValue = () => {
    const stepIsValid = step && step < max - min && step > min;

    if (value === undefined) {
      // this is the default html input's fallback value
      return max < min ? min : min + (max - min) / 2;
    }

    if (!step) {
      return value;
    }

    // if the value is not a multiple of the step, then find the closest step
    // and make that the value (this is also the native input behavior)
    if (step && stepIsValid && (value - min) % step !== 0) {
      const closest = getStepArray(step, [min, max]).reduce(function (prev, curr) {
        return Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev;
      });

      return closest;
    }

    return value;
  };

  const sliderValue = getValue();
  const percent = getPercent(Math.max(Math.min(sliderValue, max), min), [min, max]);

  const getAriaValueText = () => {
    if (valueFormatter && valueFormatter(sliderValue)) {
      return valueFormatter(sliderValue);
    }

    if (valueFormatter && !valueFormatter(sliderValue)) {
      const middleValues = referenceValues ? referenceValues : [];
      const valueArray = [min, ...middleValues, sliderValue, max];
      const prevAndNext = findLowerAndHigherValues(valueArray, sliderValue);
      const previousValue = prevAndNext.lower ? valueFormatter(prevAndNext.lower) : valueFormatter(min);
      const nextValue = prevAndNext.higher ? valueFormatter(prevAndNext.higher) : valueFormatter(max);
      const value = sliderValue;

      return i18n('i18nStrings.valueTextRange', i18nStrings?.valueTextRange(previousValue, value, nextValue), format =>
        format({ value, previousValue, nextValue })
      );
    }

    return undefined;
  };

  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
      {showTooltip && (
        <Tooltip value={valueFormatter ? valueFormatter(sliderValue) : sliderValue} trackRef={handleRef} />
      )}
      <div
        ref={handleRef}
        className={styles['tooltip-thumb']}
        style={{
          [customCssProps.sliderTooltipPosition]: `calc(${percent}% - ${THUMB_SIZE}px)`,
        }}
      />
      <div className={styles.slider}>
        <div
          className={clsx(styles['slider-track'], {
            [styles.disabled]: disabled,
          })}
        />

        {!hideFillLine && (
          <div
            className={clsx(styles['slider-range'], {
              [styles.error]: invalid,
              [styles.warning]: showWarning,
              [styles.active]: isActive,
              [styles['error-active']]: invalid && isActive,
              [styles['warning-active']]: showWarning && isActive,
              [styles.disabled]: disabled,
            })}
            style={{ [customCssProps.sliderRangeInlineSize]: `${percent}%` }}
          />
        )}
      </div>
      {!!step && tickMarks && (
        <SliderTickMarks
          hideFillLine={hideFillLine}
          disabled={disabled}
          invalid={invalid}
          warning={warning}
          isActive={isActive}
          step={step}
          min={min}
          max={max}
          value={sliderValue}
        />
      )}

      <input
        // we need to add this because input[type=range] isn't natively focusable in Safari.
        tabIndex={0}
        aria-label={ariaLabel}
        // aria-labelledby has precedence over aria-label in accessible name calculation.
        // When aria-label is provided for Input, it should override aria-labelledBy from form-field context.
        // If both aria-label and aria-labelledby come from Input props, aria-labelledby will be used in accessible name
        aria-labelledby={ariaLabel && !rest.ariaLabelledby ? undefined : ariaLabelledby}
        // Slider labels, if present and something other than numbers, should be associated to the input with aria-describedby
        aria-describedby={
          valueFormatter ? (ariaDescribedby ? `${labelsId} ${ariaDescribedby}` : labelsId) : ariaDescribedby
        }
        aria-valuetext={getAriaValueText()}
        aria-invalid={invalid ? 'true' : undefined}
        id={controlId}
        type="range"
        min={min}
        max={max}
        disabled={disabled}
        onFocus={() => {
          setShowTooltip(true);
          setIsActive(true);
        }}
        onBlur={() => {
          setShowTooltip(false);
          setIsActive(false);
        }}
        onMouseEnter={() => {
          setShowTooltip(true);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
        onTouchStart={() => {
          setShowTooltip(true);
          setIsActive(true);
        }}
        onTouchEnd={() => {
          setShowTooltip(false);
          setIsActive(false);
        }}
        step={step}
        value={sliderValue}
        onChange={event => {
          onChange && fireNonCancelableEvent(onChange, { value: Number(event.target.value) });
        }}
        className={clsx(styles.thumb, {
          [styles.error]: invalid,
          [styles.warning]: showWarning,
          [styles.disabled]: disabled,
          [styles.min]: sliderValue <= min || max < min,
          [styles.max]: sliderValue >= max && min < max,
        })}
      />

      <SliderLabels
        min={min}
        max={max}
        referenceValues={referenceValues}
        valueFormatter={valueFormatter}
        labelsId={labelsId}
        ariaDescription={ariaDescription}
      />
    </div>
  );
}
