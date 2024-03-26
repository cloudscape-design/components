// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const getPercent = (value: number, min: number, max: number) => ((value - min) / (max - min)) * 100;

export const getStepArray = (step: number, min: number, max: number) => {
  const steps = [];

  for (let i = min; i <= max; i = i + step) {
    steps.push(i);
  }
  return steps;
};

export const getTickMarkPositions = (step: number, min: number, max: number) => {
  return ((step - min) / (max - min)) * 100 > 100
    ? '100%'
    : ((step - min) / (max - min)) * 100 < 0
    ? '0%'
    : `${((step - min) / (max - min)) * 100}%`;
};

export const THUMB_SIZE = 16;
