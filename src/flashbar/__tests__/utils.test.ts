// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import {
  getVisibleCollapsedItems,
  getItemType,
  isElementTopBeyondViewport,
} from '../../../lib/components/flashbar/utils';
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

  for (const testCase of cases) {
    it(testCase.description, () => {
      const items = testCase.input.map(type =>
        type === 'progress'
          ? {
              type: 'info' as FlashbarProps.Type,
              loading: true,
            }
          : { type }
      );
      const result = getVisibleCollapsedItems(items, 3).map(item => getItemType(item));
      expect(result).toEqual(testCase.expectedOutput);
    });
  }

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

describe('isElementTopBeyondViewport', () => {
  beforeAll(() => {
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      width: 100,
      height: 100,
      top,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: top,
      toJSON: () => null,
    }));
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });
  let top = 0;
  const element = document.createElement('div');

  it('returns true when element top is negative', () => {
    top = -1;
    expect(isElementTopBeyondViewport(element)).toBe(true);
  });

  it('returns false when element top is positive', () => {
    top = 1;
    expect(isElementTopBeyondViewport(element)).toBe(false);
  });

  it('returns false when element top is zero', () => {
    top = 0;
    expect(isElementTopBeyondViewport(element)).toBe(false);
  });
});
