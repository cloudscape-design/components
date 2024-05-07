// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getPercent(value: number, range: [min: number, max: number]) {
  return ((value - range[0]) / (range[1] - range[0])) * 100;
}

function countDecimals(value: number) {
  if (Math.floor(value) === value) {
    return 0;
  }

  const str = Math.abs(value).toString();
  // very small numbers, e.g. 1e-9
  if (str.indexOf('-') !== -1) {
    return parseInt(str.split('-')[1], 10) || 0;
  } else if (str.indexOf('.') !== -1) {
    return str.split('.')[1].length || 0;
  }
  return 0;
}

export const getStepArray = (step: number, [min, max]: [min: number, max: number]) => {
  const steps = [min];

  // JS struggles with rounding errors when using decimals, so include a multiplier
  // to make step calculations integer-based
  const multiplier = Math.pow(10, countDecimals(step));

  let currentStep = min;

  while (currentStep < max) {
    currentStep = (multiplier * currentStep + multiplier * step) / multiplier;
    if (currentStep <= max) {
      steps.push(currentStep);
    }
  }

  return steps;
};

export const findLowerAndHigherValues = <T extends number>(
  array: ReadonlyArray<T>,
  value: T
): { lower: undefined | T; higher: undefined | T } => {
  let sortedArray = [...array];
  sortedArray = sortedArray.sort((a, b) => a - b);

  const index = sortedArray.indexOf(value) || 0;
  const lower = sortedArray[index - 1] || undefined;
  const higher = sortedArray[index + 1] || undefined;

  return { lower, higher };
};

export const valuesAreValid = (referenceValues: ReadonlyArray<number>) => {
  const valuesWithDecimals = referenceValues?.filter(value => !Number.isInteger(value));

  return valuesWithDecimals.length === 0;
};

export const THUMB_SIZE = 16;
