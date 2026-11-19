// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { flattenOptions } from '../../utils/flatten-options';

describe('flattenOptions', () => {
  const options = [
    {
      label: 'Group 1',
      options: [
        {
          label: 'Child 1',
        },
        {
          label: 'Child 2',
          disabled: true,
        },
      ],
    },
    {
      label: 'Option 1',
      labelTag: 'bx',
    },
    {
      label: 'Group 2',
      disabled: true,
      options: [
        {
          label: 'Child 1',
        },
        {
          label: 'Child 2',
          disabled: true,
        },
      ],
    },
  ];

  const { flatOptions, parentMap } = flattenOptions(options);

  test('should flatten options', () => {
    expect(flatOptions).toEqual([
      {
        type: 'parent',
        option: {
          label: 'Group 1',
          options: [
            {
              label: 'Child 1',
            },
            {
              label: 'Child 2',
              disabled: true,
            },
          ],
        },
      },
      {
        type: 'child',
        option: {
          label: 'Child 1',
        },
      },
      {
        option: {
          disabled: true,
          label: 'Child 2',
        },
        disabled: true,
        type: 'child',
      },
      {
        option: { label: 'Option 1', labelTag: 'bx' },
      },
      {
        option: {
          label: 'Group 2',
          disabled: true,
          options: [
            {
              label: 'Child 1',
            },
            {
              label: 'Child 2',
              disabled: true,
            },
          ],
        },
        disabled: true,
        type: 'parent',
      },
      {
        option: {
          label: 'Child 1',
        },
        disabled: true,
        type: 'child',
      },
      {
        option: {
          label: 'Child 2',
          disabled: true,
        },
        disabled: true,
        type: 'child',
      },
    ]);
  });

  test('should return parent by a child', () => {
    expect(parentMap.get(flatOptions[1])).toEqual({
      option: {
        label: 'Group 1',
        options: [
          {
            label: 'Child 1',
          },
          {
            label: 'Child 2',
            disabled: true,
          },
        ],
      },
      type: 'parent',
    });
  });
});
