// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '../../../lib/components/test-utils/dom';
import KeyValuePairs from '../../../lib/components/key-value-pairs';

function renderKeyValuePairs(jsx: React.ReactElement) {
  const { container } = render(jsx);
  return { wrapper: createWrapper(container).findKeyValuePairs()! };
}

describe('KeyValuePairs', () => {
  describe('item rendering', () => {
    test('renders correctly', () => {
      const { wrapper } = renderKeyValuePairs(
        <KeyValuePairs
          items={[
            {
              label: 'Label for key',
              value: 'Value',
            },
          ]}
        />
      );

      expect(wrapper.findItems()[0].findPair()!.getElement()).not.toBeNull();
      expect(wrapper.findItems()[0].findPair()!.findLabel()!.getElement()).toHaveTextContent('Label for key');
      expect(wrapper.findItems()[0].findPair()!.findValue()!.getElement()).toHaveTextContent('Value');
    });

    test('renders label with info correctly', () => {
      const { wrapper } = renderKeyValuePairs(
        <KeyValuePairs
          items={[
            {
              label: 'Label for key',
              value: 'Value',
              info: 'Info',
            },
          ]}
        />
      );

      expect(wrapper.findItems()[0].findPair()!.findInfo()!.getElement()).toHaveTextContent('Info');
    });
  });

  describe('column layout', () => {
    test('renders correctly', () => {
      const { wrapper } = renderKeyValuePairs(
        <KeyValuePairs
          items={[
            {
              title: 'Title',
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
            {
              items: [
                {
                  label: 'Label for key',
                  value: 'Value',
                },
              ],
            },
          ]}
        />
      );

      expect(wrapper.findItems()).toHaveLength(2);
      expect(wrapper.findItems()[0].findTitle()!.getElement()).toHaveTextContent('Title');
      expect(wrapper.findItems()[0].findItemPairs()).toHaveLength(2);
      expect(wrapper.findItems()[1].findItemPairs()).toHaveLength(1);
    });
  });

  describe('flat layout', () => {
    test('renders correctly', () => {
      const { wrapper } = renderKeyValuePairs(
        <KeyValuePairs
          items={[
            {
              label: 'Label for key',
              value: 'Value',
            },
            {
              label: 'Label for key',
              value: 'Value',
            },
            {
              label: 'Label for key',
              value: 'Value',
            },
          ]}
        />
      );

      expect(wrapper.findItems()).toHaveLength(3);
    });
  });

  describe('combined layout', () => {
    test('renders correctly', () => {
      const { wrapper } = renderKeyValuePairs(
        <KeyValuePairs
          items={[
            {
              title: 'Column title',
              items: [
                { label: 'Column label 1', value: 'Column value 1' },
                { label: 'Column label 2', value: 'Column value 2' },
              ],
            },
            {
              label: 'Label for key',
              value: 'Value',
            },
            {
              label: 'Label for key',
              value: 'Value',
            },
            {
              label: 'Label for key',
              value: 'Value',
            },
          ]}
        />
      );

      expect(wrapper.findItems()).toHaveLength(4);
      expect(wrapper.findItems()[0].findItemPairs()).toHaveLength(2);
      expect(wrapper.findItems()[0].findItemPairs()![0].findLabel()!.getElement()).toHaveTextContent('Column label 1');
      expect(wrapper.findItems()[0].findItemPairs()![0].findValue()!.getElement()).toHaveTextContent('Column value 1');
      expect(wrapper.findItems()[1].findPair()!.findLabel()!.getElement()).toHaveTextContent('Label for key');
      expect(wrapper.findItems()[1].findPair()!.findValue()!.getElement()).toHaveTextContent('Value');
    });
  });
});
