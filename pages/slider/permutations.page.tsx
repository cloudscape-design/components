// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box } from '~components';
import Slider, { SliderProps } from '~components/slider';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<SliderProps & { label: string }>([
  {
    label: ['Value'],
    value: [-10, 0, 10],
    min: [-10],
    max: [10],
    step: [1],
  },
  {
    label: ['Ticks, value'],
    value: [-10, -9, 0, 9, 10],
    min: [-10],
    max: [10],
    tickMarks: [true],
    step: [1],
  },
  {
    label: ['Ticks, value, larger step'],
    value: [-10, -9, 0, 9, 10],
    min: [-10],
    max: [10],
    tickMarks: [true],
    step: [2],
  },
  {
    label: ['Ticks, invalid'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    invalid: [true],
    step: [1],
  },
  {
    label: ['Ticks, warning'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    warning: [true],
    step: [1],
  },
  {
    label: ['Ticks, invalid, warning'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    invalid: [true],
    warning: [true],
    step: [1],
  },
  {
    label: ['Ticks, disabled'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    disabled: [true],
    step: [1],
  },
  {
    label: ['Ticks, read-only'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    readOnly: [true],
    step: [1],
  },
  {
    label: ['Ticks, read-only, disabled'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    readOnly: [true],
    disabled: [true],
    step: [1],
  },
  {
    label: ['Ticks, invalid, warning, read-only'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    invalid: [true],
    warning: [true],
    readOnly: [true],
    step: [1],
  },
  {
    label: ['Ticks, invalid, warning, disabled'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    invalid: [true],
    warning: [true],
    disabled: [true],
    step: [1],
  },
  {
    label: ['Ticks, hide fill line'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    hideFillLine: [true],
    step: [1],
  },
  {
    label: ['Ticks, hide fill line, invalid'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    hideFillLine: [true],
    invalid: [true],
    step: [1],
  },
  {
    label: ['Ticks, hide fill line, disabled'],
    value: [0],
    min: [-10],
    max: [10],
    tickMarks: [true],
    hideFillLine: [true],
    disabled: [true],
    step: [1],
  },
  {
    label: ['Reference values'],
    value: [0],
    min: [-50],
    max: [50],
    referenceValues: [
      [-40, -30, -20, -10, 0, 10, 20, 30, 40],
      [-25, 25],
    ],
  },
  {
    label: ['Long reference values'],
    value: [10],
    min: [0],
    max: [30],
    valueFormatter: [value => `${value} is the very long value.`],
    referenceValues: [
      [15],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
      [2, 3, 8, 9, 10, 17, 19, 25, 26, 29],
      [4.38, 8.3143, 17.999],
    ],
  },
]);

export default function SliderPermutations() {
  const i18nStrings = {
    valueTextRange: (previousValue: string, value: number, nextValue: string) =>
      `${value}, between ${previousValue} and ${nextValue}`,
  };

  return (
    <>
      <h1>Slider permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={(permutation, index) => (
            <Box>
              <label htmlFor={`label-${index}`}>{permutation.label}</label>
              <Slider ariaLabel="Slider" controlId={`slider-${index}`} i18nStrings={i18nStrings} {...permutation} />
            </Box>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
