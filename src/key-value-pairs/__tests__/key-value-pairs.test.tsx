// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import KeyValuePairs, { KeyValuePairsProps } from '../../../lib/components/key-value-pairs';

function renderKeyValuePairs(props: KeyValuePairsProps) {
  const { container, debug } = render(<KeyValuePairs {...props} />);
  return { wrapper: createWrapper(container).findKeyValuePairs()!, debug };
}

describe('KeyValuePairs', () => {
  describe('columns', () => {
    test(`renders 1 column correctly`, () => {
      const { wrapper } = renderKeyValuePairs({
        columns: [
          {
            items: [
              {
                label: 'Label for key',
                value: 'Value',
              },
            ],
          },
        ],
      });

      expect(wrapper.findColumns()).toHaveLength(1);
    });

    test(`renders multiple columns correctly`, () => {
      const { wrapper } = renderKeyValuePairs({
        columns: [
          {
            items: [
              {
                label: 'Label for key',
                value: 'Value',
              },
            ],
          },
          {
            items: [
              {
                label: 'Label for key',
                value: 'Value',
              },
            ],
          },
        ],
      });

      expect(wrapper.findColumns()).toHaveLength(2);
    });
  });

  test('renders title correctly', () => {
    const { wrapper } = renderKeyValuePairs({
      columns: [
        {
          title: 'Title',
          items: [
            {
              label: 'Label for key',
              value: 'Value',
            },
          ],
        },
      ],
    });

    expect(wrapper.findColumns()[0].findTitle()!.getElement()).toHaveTextContent('Title');
  });

  test('renders item correctly', () => {
    const { wrapper } = renderKeyValuePairs({
      columns: [
        {
          items: [
            {
              label: 'Label for key',
              value: 'Value',
            },
            {
              label: 'Label for key',
              value: 'Value',
            },
          ],
        },
      ],
    });

    expect(wrapper.findColumns()[0].findKey()!.getElement()).toHaveTextContent('Label for key');
    expect(wrapper.findColumns()[0].findInfo()).toBeNull();
    expect(wrapper.findColumns()[0].findValue()!.getElement()).toHaveTextContent('Value');
  });

  test('renders key with info correctly', () => {
    const { wrapper } = renderKeyValuePairs({
      columns: [
        {
          items: [
            {
              label: 'Label for key',
              value: 'Value',
              info: 'info',
            },
          ],
        },
      ],
    });

    expect(wrapper.findColumns()[0].findInfo()!.getElement()).toHaveTextContent('info');
  });
});
