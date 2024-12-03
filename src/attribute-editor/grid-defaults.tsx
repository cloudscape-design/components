// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AttributeEditorProps } from './interfaces';

export const gridDefaults: Record<number, AttributeEditorProps.GridLayout[]> = {
  1: [
    {
      breakpoint: 'xxs',
      rows: [[3, 1]],
    },
    {
      rows: [[1], [1]],
    },
  ],
  2: [
    {
      breakpoint: 'xs',
      rows: [[3, 3, 2]],
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1], [1]],
    },
    {
      rows: [[1], [1], [1]],
    },
  ],
  3: [
    {
      breakpoint: 'xs',
      rows: [[3, 3, 3, 3]],
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1], [1], [1]],
    },
    {
      rows: [[1], [1], [1], [1]],
    },
  ],
  4: [
    {
      breakpoint: 'xs',
      rows: [[3, 3, 3, 3, 4]],
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1], [1, 1], [1]],
    },
    {
      rows: [[1], [1], [1], [1], [1]],
    },
  ],
  5: [
    {
      breakpoint: 's',
      rows: [[3, 3, 3, 3, 3, 5]],
    },
    {
      breakpoint: 'xs',
      rows: [[1, 1, 1], [1, 1], [1]],
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1], [1, 1], [1], [1]],
    },
    {
      rows: [[1], [1], [1], [1], [1], [1]],
    },
  ],
  6: [
    {
      breakpoint: 's',
      rows: [[3, 3, 3, 3, 3, 3, 6]],
    },
    {
      breakpoint: 'xs',
      rows: [[1, 1, 1], [1, 1, 1], [1]],
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1], [1, 1], [1, 1], [1]],
    },
    {
      rows: [[1], [1], [1], [1], [1], [1], [1]],
    },
  ],
  7: [
    {
      breakpoint: 's',
      rows: [[3, 3, 3, 3, 3, 3, 3, 7]],
    },
    {
      breakpoint: 'xs',
      rows: [[1, 1, 1, 1], [1, 1, 1], [1]],
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1], [1, 1], [1, 1], [1], [1]],
    },
    {
      rows: [[1], [1], [1], [1], [1], [1], [1], [1]],
    },
  ],
  8: [
    {
      breakpoint: 's',
      rows: [[3, 3, 3, 3, 3, 3, 3, 3, 8]],
    },
    {
      breakpoint: 'xs',
      rows: [[1, 1, 1, 1], [1, 1, 1, 1], [1]],
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1], [1, 1], [1, 1], [1, 1], [1]],
    },
    {
      rows: [[1], [1], [1], [1], [1], [1], [1], [1], [1]],
    },
  ],
};
