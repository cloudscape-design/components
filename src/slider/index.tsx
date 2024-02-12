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
// import { useContainerQuery } from '@cloudscape-design/component-toolkit';
// import InternalPopover from '../popover/internal.js';

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
  const tooltip = useRef<HTMLDivElement>(null);
  const minRef = useRef<HTMLSpanElement>(null);
  const maxRef = useRef<HTMLSpanElement>(null);
  const referenceValueRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [tooltipVisible, setTooltipVisible] = React.useState(false);
  const [tooltipWidth, setTooltipWidth] = React.useState(0);
  //const [sliderWidth, setSliderWidth] = React.useState(0);
  //const [labelWidths, setLabelWidths] = React.useState<Array<DOMRect | null>>([]);
  //const [visibleLabels, setVisibleLabels] = React.useState(referenceValues);

  //const [width, ref] = useContainerQuery<number>(rect => rect.contentBoxWidth);

  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;
  const percent = value !== undefined && getPercent(Math.max(Math.min(value, max), min));

  const formFieldContext = useFormFieldContext(rest);
  const tooltipPositionAdjust = value && (value <= min ? -8 : value >= max ? 8 : 0);

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

  type ToolTipType = ReturnType<() => [overlapped: boolean, position: string]>; // string

  const isTooltipOffScreen = React.useCallback((): ToolTipType => {
    if (tooltip && tooltip.current) {
      const rect = tooltip.current.getBoundingClientRect();

      return [
        rect.x < 0 ||
          rect.y < 0 ||
          rect.x + rect.width > window.innerWidth ||
          rect.y + rect.height > window.innerHeight,
        rect.x < 0
          ? 'left'
          : rect.y < 0
          ? 'top'
          : rect.x + rect.width > window.innerWidth
          ? 'right'
          : rect.y + rect.height > window.innerHeight
          ? 'bottom'
          : 'none',
      ];
    }
    return [false, 'none'];
  }, []);

  useLayoutEffect(() => {
    if (tooltip.current) {
      document.body.setAttribute('data-tooltip-position', isTooltipOffScreen()[1]);
      const tooltipPos = document.body.getAttribute('data-tooltip-position');

      tooltip.current.style.left =
        isTooltipOffScreen()[1] === 'left'
          ? `calc(${percent}% + 16px - ${tooltipPositionAdjust}px)`
          : isTooltipOffScreen()[1] === 'right'
          ? `calc(${percent}% - ${tooltipPositionAdjust}px - ${tooltipWidth}px - 16px)`
          : `calc(${percent}% - ${tooltipPositionAdjust}px - ${tooltipWidth}px / 2)`;

      tooltip.current.style.bottom = tooltipPos === 'left' || tooltipPos === 'right' ? 'auto' : '55px';
    }

    setTooltipWidth(tooltip.current?.offsetWidth ?? 0);
  }, [tooltipVisible, percent, tooltipWidth, isTooltipOffScreen, tooltipPositionAdjust]);

  // function nonNull(array: Array<number | null>) {
  //   var result = [];
  //   for (var value of array) if (value !== null) result.push(value);
  //   return result;
  // }

  // const removeOverlappingLabels = () => {
  //   let visibleLs = [...labelWidths];
  //   for (let i = 0; i < labelWidths.length; i++) {
  //     if (visibleLs[i] === null) {
  //       return;
  //     }
  //     if (visibleLs[i].x + visibleLs[i].width > visibleLs[i + 1].x) {
  //       delete visibleLs[i + 1];
  //     }
  //   }
  //   console.log(labelWidths, visibleLs);
  //   return visibleLs;
  // };

  // const getVisibleLabels = () => {
  //   const minWidth = minRef.current ? minRef.current.clientWidth : 0;
  //   const maxWidth = maxRef.current ? maxRef.current.clientWidth : 0;
  //   const totalLabelWidths = nonNull([...labelWidths.map(item => (item ? item.width : 0)), minWidth, maxWidth]).reduce(
  //     (s, v) => s + (v || 0),
  //     0
  //   );
  //   const fallbackWidth = totalLabelWidths || 0;
  //   const labelsOverflow = fallbackWidth > sliderWidth;

  //   // const halfReferenceVales = referenceValues?.filter((_, i) => i & 1);

  //   // console.log(labelWidths, totalLabelWidths, sliderWidth, labelsOverflow);

  //   if (labelsOverflow && referenceValues) {
  //     setVisibleLabels(referenceValues);
  //   }

  //   // if (!labelsOverflow && referenceValues) {
  //   //   setVisibleLabels(referenceValues);
  //   // }

  //   //return visibleLabels || [];
  // };

  // useEffect(() => {
  //   setSliderWidth(width || 0);
  // }, [setSliderWidth, width]);

  useLayoutEffect(() => {
    referenceValueRefs.current = referenceValueRefs.current.slice(0, referenceValues?.length);

    if (referenceValueRefs.current) {
      referenceValueRefs.current.map(item => item && (item.style.marginLeft = `-${item.clientWidth / 2}px`));
      //setLabelWidths(referenceValueRefs.current.map(item => item && item.getBoundingClientRect()));
    }
  }, [referenceValues?.length]);

  useEffect(() => {
    if (range.current) {
      range.current.style.width = `${percent}%`;
    }
    // removeOverlappingLabels();
  }, [percent]);

  return (
    <div className={styles['slider-container']}>
      <div className={styles.slider}>
        {!hideTooltip && tooltipVisible && value !== undefined && (
          <div
            style={{
              left: tooltipWidth
                ? `calc(${percent}% - ${tooltipPositionAdjust}px - ${tooltipWidth}px / 2`
                : `${percent}% - ${tooltipPositionAdjust}`,
              bottom: isTooltipOffScreen()[1] === 'left' ? '0' : '55px',
            }}
            className={styles['slider-thumb-label']}
            ref={tooltip}
          >
            {valueFormatter ? valueFormatter(value) : value}
          </div>
        )}
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

      {/* <InternalPopover content={value}>
        <div
          style={{
            left: tooltipWidth ? `calc(${percent}% - ${tooltipWidth}px / 2` : `${percent}%`,
            width: '16px',
            height: '16px',
            background: 'red',
          }}
        />
      </InternalPopover> */}
      <input
        aria-label={ariaLabel}
        aria-labelledby={formFieldContext.ariaLabelledby}
        aria-describedby={formFieldContext.ariaDescribedby}
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
        }}
        className={clsx(styles.thumb, {
          [styles.error]: invalid,
          [styles.disabled]: disabled,
          [styles.min]: value && value <= min,
          [styles.max]: value && value >= max,
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
