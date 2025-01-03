// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AttributeEditorProps } from './interfaces';

export const gridDefaults: Record<number, AttributeEditorProps.GridLayout[]> = {
  1: [
    {
      breakpoint: 'xxs',
      rows: [[3]],
    },
    {
      rows: [[1]],
      removeButton: {
        ownRow: true,
      },
    },
  ],
  2: [
    {
      breakpoint: 'xs',
      rows: [[3, 3]],
      removeButton: {
        width: 2,
      },
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1]],
      removeButton: {
        ownRow: true,
      },
    },
    {
      rows: [[1], [1]],
    },
  ],
  3: [
    {
      breakpoint: 'xs',
      rows: [[3, 3, 3]],
      removeButton: {
        width: 3,
      },
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1], [1]],
      removeButton: {
        ownRow: true,
      },
    },
    {
      rows: [[1], [1], [1]],
    },
  ],
  4: [
    {
      breakpoint: 'xs',
      rows: [[3, 3, 3, 3]],
      removeButton: {
        width: 4,
      },
    },
    {
      breakpoint: 'xxs',
      rows: [
        [1, 1],
        [1, 1],
      ],
    },
    {
      rows: [[1], [1], [1], [1]],
    },
  ],
  5: [
    {
      breakpoint: 's',
      rows: [[3, 3, 3, 3, 3]],
      removeButton: {
        width: 5,
      },
    },
    {
      breakpoint: 'xs',
      rows: [
        [1, 1, 1],
        [1, 1],
      ],
    },
    {
      breakpoint: 'xxs',
      rows: [[1, 1], [1, 1], [1]],
    },
    {
      rows: [[1], [1], [1], [1], [1]],
    },
  ],
  6: [
    {
      breakpoint: 's',
      rows: [[3, 3, 3, 3, 3, 3]],
      removeButton: {
        width: 6,
      },
    },
    {
      breakpoint: 'xs',
      rows: [
        [1, 1, 1],
        [1, 1, 1],
      ],
    },
    {
      breakpoint: 'xxs',
      rows: [
        [1, 1],
        [1, 1],
        [1, 1],
      ],
    },
    {
      rows: [[1], [1], [1], [1], [1], [1]],
    },
  ],
};
