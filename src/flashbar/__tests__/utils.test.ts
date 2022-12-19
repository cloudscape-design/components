// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getStackedItems } from '../utils';
import { FlashbarProps } from '../interfaces';

describe('getStackedItems', () => {
  const cases: { description: string; input: FlashbarProps.Type[]; expectedOutput: FlashbarProps.Type[] }[] = [
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
  ];

  for (const testCase of cases) {
    it(testCase.description, () => {
      const items = testCase.input.map(type => ({
        type,
      }));
      const result = getStackedItems(items, 3).map(({ type }) => type);
      expect(result).toEqual(testCase.expectedOutput);
    });
  }
});
