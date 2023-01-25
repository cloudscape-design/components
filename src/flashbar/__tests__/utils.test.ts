// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getVisibleCollapsedItems, getItemType } from '../utils';
import { FlashbarProps, FlashType } from '../interfaces';

describe('getVisibleCollapsedItems', () => {
  const cases: { description: string; input: FlashType[]; expectedOutput: FlashType[] }[] = [
    {
      description: "All items of type 'success'",
      input: ['success', 'success', 'success'],
      expectedOutput: ['success', 'success', 'success'],
    },
    {
      description: "All items of type 'info'",
      input: ['info', 'info', 'info'],
      expectedOutput: ['info', 'info', 'info'],
    },
    {
      description: "All items of type 'warning'",
      input: ['warning', 'warning', 'warning'],
      expectedOutput: ['warning', 'warning', 'warning'],
    },
    {
      description: "All items of type 'error'",
      input: ['error', 'error', 'error'],
      expectedOutput: ['error', 'error', 'error'],
    },
    {
      description: '1 item of each color',
      input: ['success', 'warning', 'error'],
      expectedOutput: ['success', 'warning', 'error'],
    },
    {
      description: '1 item of different type after the length limit',
      input: ['success', 'success', 'success', 'error'],
      expectedOutput: ['success', 'success', 'error'],
    },
    {
      description: '2 items of 2 different types after the length limit',
      input: ['success', 'success', 'success', 'error', 'info'],
      expectedOutput: ['success', 'error', 'info'],
    },
    {
      description: '1 item of one type and 2 of another type',
      input: ['success', 'error', 'error'],
      expectedOutput: ['success', 'error', 'error'],
    },
    {
      description: '1 item of one type and 3 of another type',
      input: ['success', 'error', 'error', 'error'],
      expectedOutput: ['success', 'error', 'error'],
    },
    {
      description: '2 items of different type but same color, and 2 items of different type and color',
      input: ['info', 'progress', 'success', 'error'],
      expectedOutput: ['info', 'success', 'error'],
    },
    {
      description: '3 items of different color followed by more items',
      input: ['success', 'info', 'error', 'info', 'warning', 'progress'],
      expectedOutput: ['success', 'info', 'error'],
    },
  ];

  it.each(cases)('cases', ({ input, expectedOutput }) => {
    const items = input.map(type =>
      type === 'progress'
        ? {
            type: 'info' as FlashbarProps.Type,
            loading: true,
          }
        : { type }
    );
    const result = getVisibleCollapsedItems(items, 3).map(item => getItemType(item));
    expect(result).toEqual(expectedOutput);
  });

  it('returns the same list if there are more slots than distinct colors', () => {
    const items: FlashbarProps.MessageDefinition[] = [
      { type: 'success' },
      { type: 'error' },
      { type: 'info' },
      { type: 'success' },
    ];
    expect(getVisibleCollapsedItems(items, 4).map(({ type }) => ({ type }))).toEqual(items);
  });
});
