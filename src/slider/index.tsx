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
import { useUniqueId } from '../internal/hooks/use-unique-id';
import customCssProps from '../internal/generated/custom-css-properties';

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
  tickMarks,
  hideFillLine,
  valueFormatter,
  ...rest
}: SliderProps) {
  const { __internalRootRef } = useBaseComponent('Slider');
  const baseProps = getBaseProps(rest);

  // const [visibleLabels, setVisibleLabels] = React.useState(referenceValues);
  const range = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLSpanElement>(null);
  const maxRef = useRef<HTMLSpanElement>(null);
  const referenceValueRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const [showPopover, setShowPopover] = React.useState(false);
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

  const getLabelPositions = (step: number) => {
    return ((step - min) / (max - min)) * 100 > 100
      ? '100%'
      : ((step - min) / (max - min)) * 100 < 0
      ? '0%'
      : `${((step - min) / (max - min)) * 100}%`;
  };

  // useEffect(() => {
  //   const isOverlapping = (item1: HTMLSpanElement | null, item2: HTMLSpanElement | null) => {
  //     if (item1 === null || item2 === null) {
  //       return false;
  //     }
  //     const x = item1?.getBoundingClientRect().right > item2?.getBoundingClientRect().left;

  //     return x;
  //   };
  //   const hasOverlap = isOverlapping(referenceValueRefs.current[0], referenceValueRefs.current[1]);

  //   const checkOverlap = () => {
  //     if (hasOverlap) {
  //       setVisibleLabels(referenceValues?.filter((_, i) => i & 1));
  //     }
  //   };
  //   const timeoutId = setTimeout(() => {
  //     checkOverlap();
  //   }, 0);

  //   document.addEventListener('resize', checkOverlap);
  //   return () => {
  //     document.removeEventListener('resize', checkOverlap);
  //     clearTimeout(timeoutId);
  //   };
  // }, [referenceValues]);

  useLayoutEffect(() => {
    referenceValueRefs.current = referenceValueRefs.current.slice(0, referenceValues?.length);

    if (referenceValueRefs.current) {
      // referenceValueRefs.current.map(item => item && (item.style.marginInlineStart = `-${item.clientWidth / 2}px`));
    }
  }, [referenceValues?.length]);

  useEffect(() => {
    if (range.current) {
      range.current.style.width = `${percent}%`;
    }
  }, [percent, showPopover]);

  const popoverContent = value !== undefined && (
    <Portal>
      <Transition in={true}>
        {() => (
          <PopoverContainer
            trackRef={handleRef}
            trackKey={value}
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

  const getVisibleReferenceValues = () => {
    // [0, 100] [2,20,21,50,99] => [20,50]
    // [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

    if (!referenceValues) {
      return [];
    }

    const newValues = [];

    const lowestVal = referenceValues?.find(value => value / (max - min) >= 1 / 10);
    newValues.push(lowestVal);
    const lowestVal2 = referenceValues?.find(value => (value - (lowestVal || 0)) / (max - min) >= 1 / 10);
    if (
      lowestVal2 &&
      !newValues.includes(lowestVal2) &&
      referenceValues.length > 1 &&
      (max - lowestVal2) / max >= 1 / 10
    ) {
      newValues.push(lowestVal2);
    }
    const lowestVal3 = referenceValues?.find(value => (value - (lowestVal2 || 0)) / (max - min) >= 1 / 10);
    if (
      lowestVal3 &&
      !newValues.includes(lowestVal3) &&
      referenceValues.length > 2 &&
      (max - lowestVal3) / max >= 1 / 10
    ) {
      newValues.push(lowestVal3);
    }
    const lowestVal4 = referenceValues?.find(value => (value - (lowestVal3 || 0)) / (max - min) >= 1 / 10);
    if (
      lowestVal4 &&
      !newValues.includes(lowestVal4) &&
      referenceValues.length > 3 &&
      (max - lowestVal4) / max >= 1 / 10
    ) {
      newValues.push(lowestVal4);
    }
    const lowestVal5 = referenceValues?.find(value => (value - (lowestVal4 || 0)) / (max - min) >= 1 / 10);
    if (
      lowestVal5 &&
      !newValues.includes(lowestVal5) &&
      referenceValues.length > 4 &&
      (max - lowestVal5) / max >= 1 / 10
    ) {
      newValues.push(lowestVal5);
    }
    const lowestVal6 = referenceValues?.find(value => (value - (lowestVal5 || 0)) / (max - min) >= 1 / 10);
    if (
      lowestVal6 &&
      !newValues.includes(lowestVal6) &&
      referenceValues.length > 5 &&
      (max - lowestVal6) / max >= 1 / 10
    ) {
      console.log(max, lowestVal6, max - lowestVal6);
      newValues.push(lowestVal6);
    }
    const lowestVal7 = referenceValues?.find(value => (value - (lowestVal6 || 0)) / (max - min) >= 1 / 10);
    if (
      lowestVal7 &&
      !newValues.includes(lowestVal7) &&
      referenceValues.length > 6 &&
      (max - lowestVal7) / max >= 1 / 10
    ) {
      newValues.push(lowestVal7);
    }
    const lowestVal8 = referenceValues?.find(value => (value - (lowestVal7 || 0)) / (max - min) >= 1 / 10);
    if (
      lowestVal8 &&
      !newValues.includes(lowestVal8) &&
      referenceValues.length > 7 &&
      (max - lowestVal8) / max >= 1 / 10
    ) {
      newValues.push(lowestVal8);
    }
    const lowestVal9 = referenceValues?.find(value => (value - (lowestVal8 || 0)) / (max - min) >= 1 / 10);
    if (
      lowestVal9 &&
      !newValues.includes(lowestVal9) &&
      referenceValues.length > 8 &&
      (max - lowestVal9) / max >= 1 / 10
    ) {
      newValues.push(lowestVal9);
    }

    // const filteredValues = referenceValues?.filter((value, index, values) => {
    //   const valueBefore = values[0] ? 0 : values[index - 1];
    //   if ((value - valueBefore) / (max - min) >= 1 / 10 && value / (max - min) <= 9 / 10) {
    //     return value;
    //   }
    // });

    console.log(newValues);
    return newValues;
  };

  return (
    <div className={styles['slider-container']} ref={containerRef}>
      <div className={styles.slider}>
        <div
          ref={handleRef}
          className={clsx(styles['tooltip-thumb'])}
          style={{
            insetInlineStart: `calc(${percent}% - ${tooltipPositionAdjust}px)`,
          }}
        />
        {showPopover && !hideTooltip && popoverContent}
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
                    insetInlineStart: getLabelPositions(step),
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
        list={labelsId}
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

      <div
        role="list"
        className={clsx(styles['slider-labels'])}
        style={{
          [customCssProps.sliderLabelCount]: (max - min) * 2,
          //[customCssProps.sliderLabelCount]: max - min,
        }}
        id={labelsId}
      >
        <span
          role="option"
          className={clsx(styles['slider-min'])}
          style={{
            [customCssProps.sliderMinEnd]: max - min > 10 ? 5 * Math.round((max - min) / 100) : 1,
          }}
          ref={minRef}
        >
          {valueFormatter ? valueFormatter(min) : min}
        </span>
        {referenceValues &&
          referenceValues.length > 0 &&
          getVisibleReferenceValues().map((step, index) => {
            return (
              <span
                role="option"
                ref={el => (referenceValueRefs.current[index] = el)}
                key={`step-${index}`}
                style={{
                  [customCssProps.sliderReferenceColumn]:
                    max - min > 10 ? step - min + 1 - 4 * Math.round((max - min) / 100) : step - min + 1,
                  [customCssProps.sliderNextReferenceColumn]:
                    max - min > 10 ? step - min + 1 + 5 * Math.round((max - min) / 100) : step - min + 1 || max - min,
                  //[customCssProps.sliderNextReferenceColumn]: steps[index + 1] || max - 1,
                }}
                className={clsx(styles['slider-reference'])}
              >
                {valueFormatter ? valueFormatter(step) : step}
              </span>
            );
          })}
        <span
          role="option"
          className={clsx(styles['slider-max'])}
          style={{
            [customCssProps.sliderMaxStart]:
              max - min > 10 ? max - min + 1 - 5 * Math.round((max - min) / 100) : max - min + 1,
          }}
          ref={maxRef}
        >
          {valueFormatter ? valueFormatter(max) : max}
        </span>
      </div>
    </div>
  );
}

applyDisplayName(Slider, 'Slider');
