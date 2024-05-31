// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import KeyValuePairs, { KeyValuePairsProps } from '../../../lib/components/key-value-pairs';

function renderKeyValuePairs(props: KeyValuePairsProps) {
  const { container } = render(<KeyValuePairs {...props} />);
  return { wrapper: createWrapper(container).findKeyValuePairs()! };
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

  test('renders pairs correctly', () => {
    const { wrapper } = renderKeyValuePairs({
      columns: [
        {
          title: 'Column title 1',
          items: [
            {
              label: 'Label for key 1',
              value: 'Value 1',
            },
            {
              label: 'Label for key 2',
              value: 'Value 2',
            },
          ],
        },
        {
          title: 'Column title 2',
          items: [
            {
              label: 'Label for key 3',
              value: 'Value 3',
            },
            {
              label: 'Label for key 4',
              value: 'Value 4',
            },
          ],
        },
      ],
    });

    expect(wrapper.findColumns()[0].findTitle()!.getElement().textContent).toBe('Column title 1');
    expect(wrapper.findColumns()[0].findPairs()[0].findLabel()!.getElement().textContent).toBe('Label for key 1');
    expect(wrapper.findColumns()[0].findPairs()[0].findInfo()).toBeNull();
    expect(wrapper.findColumns()[0].findPairs()[0].findValue()!.getElement().textContent).toBe('Value 1');
    expect(wrapper.findColumns()[0].findPairs()[1].findLabel()!.getElement().textContent).toBe('Label for key 2');
    expect(wrapper.findColumns()[0].findPairs()[1].findValue()!.getElement().textContent).toBe('Value 2');
    expect(wrapper.findColumns()[1].findTitle()!.getElement().textContent).toBe('Column title 2');
    expect(wrapper.findColumns()[1].findPairs()[0].findLabel()!.getElement().textContent).toBe('Label for key 3');
    expect(wrapper.findColumns()[1].findPairs()[0].findValue()!.getElement().textContent).toBe('Value 3');
  });

  test('renders label with info correctly', () => {
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

    expect(wrapper.findColumns()[0].findPairs()[0].findInfo()!.getElement()).toHaveTextContent('info');
  });
});
