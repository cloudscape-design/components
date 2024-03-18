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
        referenceValues.length > 1 &&
        (max - val) / (max - min) >= 1 / LABEL_THRESHOLD
      ) {
        values.push(val);
      }
    }

    return values;
  };

  const getColumnSpan = () => {
    return (isMobile ? 10 : 5) * Math.round((max - min) / 100);
  };

  return (
    <div
      role="list"
      className={clsx(styles['slider-labels'], {
        [styles['slider-noref']]: !referenceValues,
      })}
      style={{
        [customCssProps.sliderLabelCount]: !referenceValues ? 2 : (max - min) * 2,
      }}
      id={labelsId}
    >
      <span
        role="option"
        className={clsx(styles['slider-min'])}
        style={{
          [customCssProps.sliderMinEnd]: max - min > LABEL_THRESHOLD ? getColumnSpan() : 1,
        }}
      >
        {valueFormatter ? valueFormatter(min) : min}
      </span>
      {referenceValues &&
        referenceValues.length > 0 &&
        getVisibleReferenceValues().map((step, index) => {
          return (
            <span
              role="option"
              key={`step-${index}`}
              style={{
                [customCssProps.sliderReferenceColumn]:
                  max - min > LABEL_THRESHOLD ? step - min + 2 - getColumnSpan() : step - min + 1,
                [customCssProps.sliderNextReferenceColumn]:
                  max - min > LABEL_THRESHOLD ? step - min + 1 + getColumnSpan() : step - min + 1,
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
          [customCssProps.sliderMaxStart]: !referenceValues
            ? 2
            : max - min > LABEL_THRESHOLD
            ? max - min + 1 - getColumnSpan()
            : max - min + 1,
        }}
      >
        {valueFormatter ? valueFormatter(max) : max}
      </span>
    </div>
  );
}
