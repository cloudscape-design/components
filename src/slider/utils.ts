// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getPercent(value: number, range: [min: number, max: number]) {
  return ((value - range[0]) / (range[1] - range[0])) * 100;
}
export const getStepArray = (step: number, range: [min: number, max: number]) => {
  const steps = [];

  for (let i = range[0]; i <= range[1]; i = i + step) {
    steps.push(i);
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
