// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Slider, { SliderProps } from '~components/slider';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<SliderProps>([
  {
    value: [-10, 0, 10],
    min: [-10],
    max: [10],
    hideFillLine: [false, true],
    disabled: [false, true],
    tickMarks: [false, true],
    invalid: [false, true],
    step: [0.5, 1, 5],
  },
  {
    value: [0],
    min: [-50],
    max: [50],
    referenceValues: [
      [-40, -30, -20, -10, 0, 10, 20, 30, 40],
      [-25, 25],
    ],
  },
  {
    value: [0, -100, 100],
    min: [50],
    max: [-50],
    step: [undefined, 10, 500],
  },
  {
    value: [10],
    min: [0],
    max: [30],
    valueFormatter: [undefined, value => `${value} is the very long value.`],
    referenceValues: [
      [15],
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
      [2, 3, 8, 9, 10, 17, 19, 25, 26, 29],
      [4.38, 8.3143, 17.999],
    ],
  },
  {
    value: [0],
    min: [-3],
    max: [3],
    valueFormatter: [undefined, value => `${value} is the value.`],
    referenceValues: [undefined, [-2, -1, 0, 1, 2]],
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
          render={permutation => <Slider ariaLabel="Slider" i18nStrings={i18nStrings} {...permutation} />}
        />
      </ScreenshotArea>
    </>
  );
}
