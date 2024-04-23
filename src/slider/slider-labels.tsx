// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import styles from './styles.css.js';
import { useMobile } from '../internal/hooks/use-mobile/index.js';
import customCssProps from '../internal/generated/custom-css-properties/index.js';

export interface SliderLabelProps {
  min: number;
  max: number;
  referenceValues?: ReadonlyArray<number>;
  valueFormatter?: (value: number) => string;
  labelsId: string;
  ariaDescription?: string;
}
export default function SliderLabels({
  min,
  max,
  referenceValues,
  valueFormatter,
  labelsId,
  ariaDescription,
}: SliderLabelProps) {
  const isMobile = useMobile();
  const MAX_LABEL_COUNT = isMobile ? 4 : 10;
  const minDistance = (max - min) / MAX_LABEL_COUNT;

  const getVisibleReferenceValues = () => {
    if (!referenceValues || referenceValues.length === 0) {
      return [];
    }

    const values: Array<number> = [];

    let lastValue = min;
    for (let i = 0; i <= referenceValues.length; i++) {
      if (
        referenceValues[i] > min &&
        referenceValues[i] < max &&
        Math.abs(referenceValues[i] - lastValue) >= minDistance &&
        Math.abs(max - referenceValues[i]) >= minDistance &&
        Number.isInteger(referenceValues[i])
      ) {
        values.push(referenceValues[i]);
        lastValue = referenceValues[i];
      }
    }
    return values;
  };

  function getLabelPosition(index: number) {
    const colSpan = Math.floor(minDistance / 2);
    const positionStart = index - colSpan;
    const positionEnd = index + colSpan;

    // We simplify label treatment if the range is less than the max label count.
    // This is because we don't need to add extra grid columns for necessary width.
    const hasSmallRange = max - min <= MAX_LABEL_COUNT;

    if (hasSmallRange) {
      return {
        min: 1,
        max: (max - min) * 2 - 1,
        posStart: (index - min) * 2,
        posEnd: (index - min) * 2,
      };
    }
    const roundedHalfCol = Math.round(colSpan / 2);

    return {
      min: colSpan * 2 + roundedHalfCol,
      max: (max - min - colSpan) * 2 - roundedHalfCol + 1,
      // add one to center the label
      posStart: (positionStart - min) * 2 + 1 + roundedHalfCol,
      posEnd: (positionEnd - min) * 2 - roundedHalfCol,
    };
  }

  return (
    <>
      <div
        role="list"
        aria-hidden={!valueFormatter && !referenceValues ? 'true' : undefined}
        className={clsx(styles.labels, {
          [styles['labels-noref']]: getVisibleReferenceValues().length === 0,
        })}
        style={{
          [customCssProps.sliderLabelCount]: getVisibleReferenceValues().length === 0 ? 2 : (max - min) * 2,
        }}
        id={!ariaDescription ? labelsId : undefined}
      >
        <span
          role="listitem"
          className={clsx(styles.label, styles['labels-min'])}
          style={{
            [customCssProps.sliderMinEnd]: getLabelPosition(0).min,
          }}
        >
          {valueFormatter ? valueFormatter(min) : min}
        </span>
        {getVisibleReferenceValues().map(step => {
          return (
            <span
              role="listitem"
              key={step}
              style={{
                [customCssProps.sliderReferenceColumn]: getLabelPosition(step).posStart,
                [customCssProps.sliderNextReferenceColumn]: getLabelPosition(step).posEnd,
              }}
              className={clsx(styles.label, styles['labels-reference'])}
            >
              {valueFormatter ? valueFormatter(step) : step}
            </span>
          );
        })}
        <span
          role="listitem"
          className={clsx(styles.label, styles['labels-max'])}
          style={{
            [customCssProps.sliderMaxStart]: !referenceValues ? 2 : getLabelPosition(0).max,
          }}
        >
          {valueFormatter ? valueFormatter(max) : max}
        </span>
      </div>
      {ariaDescription && (
        <div className={clsx(styles['labels-aria-description'])} id={labelsId}>
          {ariaDescription}
        </div>
      )}
    </>
  );
}
