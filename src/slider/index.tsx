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
import { Transition } from '../internal/components/transition';
import PopoverContainer from '../popover/container';
import PopoverBody from '../popover/body';
import Portal from '../internal/components/portal';
import popoverStyles from '../popover/styles.css.js';

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
  hideTooltip,
  thumbOnly,
  valueFormatter,
  ...rest
}: SliderProps) {
  const { __internalRootRef } = useBaseComponent('Slider');
  const baseProps = getBaseProps(rest);

  const range = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLSpanElement>(null);
  const maxRef = useRef<HTMLSpanElement>(null);
  const referenceValueRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const [showPopover, setShowPopover] = React.useState(false);
  const handleRef = useRef<HTMLDivElement>(null);

  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;
  const percent = value !== undefined && getPercent(Math.max(Math.min(value, max), min));

  const formFieldContext = useFormFieldContext(rest);
  const tooltipPositionAdjust = value !== undefined && (value <= min ? -8 : value >= max ? 8 : 0);

  const getStepArray = (step: number) => {
    const steps = [];

    for (let i = min; i <= max; i = i + step) {
      steps.push(i);
    }
    return steps;
  };

  const getLabelPositions = (step: number) => {
    return ((step - min) / (max - min)) * 100 > 100
      ? '100%'
      : ((step - min) / (max - min)) * 100 < 0
      ? '0%'
      : `${((step - min) / (max - min)) * 100}%`;
  };

  useLayoutEffect(() => {
    referenceValueRefs.current = referenceValueRefs.current.slice(0, referenceValues?.length);

    if (referenceValueRefs.current) {
      referenceValueRefs.current.map(item => item && (item.style.marginLeft = `-${item.clientWidth / 2}px`));
    }
  }, [referenceValues?.length]);

  useEffect(() => {
    if (range.current) {
      range.current.style.width = `${percent}%`;
    }
  }, [percent, showPopover]);

  const popoverContent = value !== undefined && (
    <Portal>
      <Transition in={showPopover}>
        {() => (
          <PopoverContainer
            trackRef={handleRef}
            size="small"
            fixedWidth={false}
            position="top"
            arrow={position => (
              <div className={clsx(popoverStyles.arrow, popoverStyles[`arrow-position-${position}`])}>
                <div className={popoverStyles['arrow-outer']} />
                <div className={popoverStyles['arrow-inner']} />
              </div>
            )}
          >
            <PopoverBody dismissButton={false} dismissAriaLabel={undefined} onDismiss={() => {}} header={undefined}>
              {valueFormatter ? valueFormatter(value) : value}
            </PopoverBody>
          </PopoverContainer>
        )}
      </Transition>
    </Portal>
  );

  return (
    <div className={styles['slider-container']}>
      <div className={styles.slider}>
        <div
          ref={handleRef}
          className={clsx(styles['tooltip-thumb'])}
          style={{
            left: `calc(${percent}% - ${tooltipPositionAdjust}px)`,
          }}
        />
        {showPopover && !hideTooltip && popoverContent}
        <div
          className={clsx(styles['slider-track'], {
            [styles.disabled]: disabled,
          })}
        />
        {step && (
          <>
            <div className={clsx(styles.ticks)}>
              {getStepArray(step).map((step, index) => (
                <div
                  key={`step-${index}`}
                  style={{
                    left: getLabelPositions(step),
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
              [styles.error]: invalid,
              [styles.active]: tooltipVisible,
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
        min={min}
        max={max}
        disabled={disabled}
        onFocus={() => {
          setShowPopover(true);
          setTooltipVisible(true);
        }}
        onBlur={() => {
          setShowPopover(false);
          setTooltipVisible(false);
        }}
        onMouseEnter={() => {
          setShowPopover(true);
        }}
        onMouseLeave={() => setShowPopover(false)}
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

      <div className={clsx(styles['slider-labels'])}>
        <span ref={minRef}>{valueFormatter ? valueFormatter(min) : min}</span>
        {referenceValues &&
          referenceValues.length > 0 &&
          referenceValues.map((step, index) => {
            return (
              <span
                ref={el => (referenceValueRefs.current[index] = el)}
                key={`step-${index}`}
                style={{
                  left: getLabelPositions(step),
                }}
                className={clsx(styles['slider-reference'])}
              >
                {valueFormatter ? valueFormatter(step) : step}
              </span>
            );
          })}
        <span ref={maxRef}>{valueFormatter ? valueFormatter(max) : max}</span>
      </div>
    </div>
  );
}

applyDisplayName(Slider, 'Slider');
