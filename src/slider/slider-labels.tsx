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
  referenceValues?: Array<number>;
  valueFormatter?: (value: number) => string;
  labelsId: string;
}
export default function SliderLabels({ min, max, referenceValues, valueFormatter, labelsId }: SliderLabelProps) {
  const isMobile = useMobile();
  const LABEL_THRESHOLD = isMobile ? 5 : 10;

  const getVisibleReferenceValues = () => {
    if (!referenceValues) {
      return [];
    }

    const values: number[] = [];
    for (let i = 0; i <= LABEL_THRESHOLD - 2; i++) {
      const val = referenceValues?.find(value => (value - (values[i - 1] || 0)) / (max - min) >= 1 / LABEL_THRESHOLD);

      if (
        val &&
        !values.includes(val) &&
        referenceValues.length >= 1 &&
        (max - val) / (max - min) >= 1 / LABEL_THRESHOLD
      ) {
        values.push(val);
      }
    }

    return values;
  };

  function getLabelPosition(index: number) {
    const minDistance = (max - min) / LABEL_THRESHOLD;
    const colSpan = Math.floor(minDistance / 2);
    const positionStart = index - colSpan;
    const positionEnd = index + colSpan;

    return {
      min: colSpan * 2,
      max: (max - colSpan) * 2,
      // add one to center the label
      posStart: positionStart * 2 + 1,
      posEnd: positionEnd * 2,
    };
  }

  return (
    <div
      role="list"
      className={clsx(styles.labels, {
        [styles['labels-noref']]: !referenceValues,
      })}
      style={{
        [customCssProps.sliderLabelCount]: !referenceValues ? 2 : (max - min) * 2,
      }}
      id={labelsId}
    >
      <span
        role="option"
        className={clsx(styles.label, styles['labels-min'])}
        style={{
          [customCssProps.sliderMinEnd]: max - min > LABEL_THRESHOLD ? getLabelPosition(0).min : 1,
        }}
      >
        {valueFormatter ? valueFormatter(min) : min}
      </span>
      {getVisibleReferenceValues().map((step, index) => {
        return (
          <span
            role="option"
            key={`step-${index}`}
            style={{
              [customCssProps.sliderReferenceColumn]:
                max - min > LABEL_THRESHOLD ? getLabelPosition(step).posStart : step * 2 - min,
              [customCssProps.sliderNextReferenceColumn]:
                max - min > LABEL_THRESHOLD ? getLabelPosition(step).posEnd : step * 2 - min,
            }}
            className={clsx(styles.label, styles['labels-reference'])}
          >
            {valueFormatter ? valueFormatter(step) : step}
          </span>
        );
      })}
      <span
        role="option"
        className={clsx(styles.label, styles['labels-max'])}
        style={{
          [customCssProps.sliderMaxStart]: !referenceValues
            ? 2
            : max - min > LABEL_THRESHOLD
            ? getLabelPosition(0).max
            : (max - min) * 2 - 1,
        }}
      >
        {valueFormatter ? valueFormatter(max) : max}
      </span>
    </div>
  );
}
