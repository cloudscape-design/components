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
  const hasValue = value !== undefined;
  const { ariaLabelledby, ariaDescribedby, controlId, invalid } = useFormFieldContext(rest);

  const percent = hasValue && getPercent(Math.max(Math.min(value, max), min), [min, max]);

  if (referenceValues && valuesAreValid(referenceValues) === false) {
    warnOnce('Slider', 'All reference values must be integers. Non-integer values will not be displayed.');
  }

  if (min >= max) {
    warnOnce('Slider', 'The min value cannot be greater than the max value.');
  }

  if (step && step > max - min) {
    warnOnce('Slider', 'The step value cannot be greater than the difference between the min and max.');
  }

  const tooltip = hasValue && <Tooltip value={valueFormatter ? valueFormatter(value) : value} trackRef={handleRef} />;

  const getAriaValueText = () => {
    if (value !== undefined && valueFormatter && valueFormatter(value)) {
      return valueFormatter(value);
    }

    if (value && valueFormatter && !valueFormatter(value)) {
      const middleValues = referenceValues ? referenceValues : [];
      const valueArray = [min, ...middleValues, value, max];
      const prevAndNext = findLowerAndHigherValues(valueArray, value);
      const previousValue = prevAndNext.lower ? valueFormatter(prevAndNext.lower) : valueFormatter(min);
      const nextValue = prevAndNext.higher ? valueFormatter(prevAndNext.higher) : valueFormatter(max);

      return i18n('i18nStrings.valueTextRange', i18nStrings?.valueTextRange(previousValue, value, nextValue), format =>
        format({ value, previousValue, nextValue })
      );
    }

    return undefined;
  };

  return (
    <div {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
      <div className={styles.slider}>
        <div
          ref={handleRef}
          className={clsx(styles['tooltip-thumb'])}
          style={{
            [customCssProps.sliderTooltipPosition]: `calc(${percent}% - ${THUMB_SIZE}px)`,
          }}
        />
        {showTooltip && tooltip}
        <div
          className={clsx(styles['slider-track'], {
            [styles.disabled]: disabled,
          })}
        />

        {!hideFillLine && (
          <div
            className={clsx(styles['slider-range'], {
              [styles.error]: invalid,
              [styles.active]: isActive,
              [styles['error-active']]: invalid && isActive,
              [styles.disabled]: disabled,
            })}
            style={{ [customCssProps.sliderRangeInlineSize]: `${percent}%` }}
          />
        )}
      </div>
      {step && tickMarks && (
        <div
          className={clsx(styles.ticks)}
          style={{
            [customCssProps.sliderTickCount]: Math.round((max - min) / step),
          }}
        >
          {getStepArray(step, [min, max]).map((step, index) => (
            <div
              key={`step-${index}`}
              className={clsx(styles.tick, {
                [styles.filled]: !hideFillLine && hasValue && value > step,
                [styles.active]: !hideFillLine && hasValue && isActive && value > step,
                [styles.error]: invalid && !hideFillLine && hasValue && value > step,
                [styles['error-active']]: invalid && isActive && !hideFillLine && hasValue && value > step,
                [styles.disabled]: disabled,
              })}
            ></div>
          ))}
        </div>
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
        value={value ?? ''}
        onChange={event => {
          onChange && fireNonCancelableEvent(onChange, { value: Number(event.target.value) });
        }}
        className={clsx(styles.thumb, {
          [styles.error]: invalid,
          [styles.disabled]: disabled,
          [styles.min]: (hasValue && value <= min) || max < min,
          [styles.max]: hasValue && value >= max && min < max,
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
