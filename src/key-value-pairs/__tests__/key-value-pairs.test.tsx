// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import KeyValuePairs from '../../../lib/components/key-value-pairs';
import Link from '../../../lib/components/link';
import createWrapper from '../../../lib/components/test-utils/dom';

function renderKeyValuePairs(jsx: React.ReactElement) {
  const { container, ...rest } = render(jsx);
  return { wrapper: createWrapper(container).findKeyValuePairs()!, ...rest };
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

      expect(wrapper.findItems()[0]!.findLabel()!.getElement()).toHaveTextContent('Label for key');
      expect(wrapper.findItems()[0]!.findValue()!.getElement()).toHaveTextContent('Value');
    });

    test('renders label with info correctly', () => {
      const { wrapper } = renderKeyValuePairs(
        <KeyValuePairs
          items={[
            {
              label: 'Label for key',
              value: 'Value',
              info: (
                <Link variant="info" href="#">
                  Info
                </Link>
              ),
            },
          ]}
        />
      );

      const labelId = wrapper.findItems()[0]!.findLabel()!.getElement().getAttribute('id');

      expect(wrapper.findItems()[0]!.findInfo()!.find('a')!.getElement().getAttribute('aria-labelledby')).toContain(
        labelId
      );
      expect(wrapper.findItems()[0]!.findInfo()!.getElement()).toHaveTextContent('Info');
    });

    it.each<string>(['ltr', 'rtl'])(
      'renders label with icons correctly, maintaining logical order, %s',
      (direction: string) => {
        document.body.style.direction = direction;
        const { wrapper } = renderKeyValuePairs(
          <KeyValuePairs
            items={[
              {
                label: 'Label at the end',
                value: 'Value',
                iconName: 'status-info',
                iconAlign: 'start',
                iconAriaLabel: 'info icon at the start',
              },
              {
                label: 'Label at the start',
                value: 'Value',
                iconName: 'external',
                iconAlign: 'end',
                iconAriaLabel: 'external icon at the end',
              },
            ]}
          />
        );

        const nextSibling = wrapper.findItems()[0]!.findIcon()?.getElement().parentElement?.nextElementSibling;
        expect(nextSibling?.firstChild).toBeInstanceOf(HTMLLabelElement);
        expect(nextSibling?.textContent).toBe('Label at the end');
        expect(wrapper.findItems()[0]!.findIcon()?.getElement()).toHaveAttribute(
          'aria-label',
          'info icon at the start'
        );

        const previousSibling = wrapper.findItems()[1]!.findIcon()?.getElement().parentElement?.previousElementSibling;
        expect(previousSibling?.firstChild).toBeInstanceOf(HTMLLabelElement);
        expect(previousSibling?.textContent).toBe('Label at the start');
        expect(wrapper.findItems()[1]!.findIcon()?.getElement()).toHaveAttribute(
          'aria-label',
          'external icon at the end'
        );
      }
    );
  });

  describe('column layout', () => {
    test('renders correctly', () => {
      const { wrapper } = renderKeyValuePairs(
        <KeyValuePairs
          items={[
            {
              type: 'group',
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
              type: 'group',
              title: 'Title 2',
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
      expect(wrapper.findItems()[0].findGroupTitle()!.getElement()).toHaveTextContent('Title');
      expect(wrapper.findItems()[0].findGroupPairs()).toHaveLength(2);
      expect(wrapper.findItems()[1].findGroupPairs()).toHaveLength(1);
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
              type: 'group',
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
      expect(wrapper.findItems()[0].findGroupPairs()).toHaveLength(2);
      expect(wrapper.findItems()[0].findGroupPairs()![0].findLabel()!.getElement()).toHaveTextContent('Column label 1');
      expect(wrapper.findItems()[0].findGroupPairs()![0].findValue()!.getElement()).toHaveTextContent('Column value 1');
      expect(wrapper.findItems()[1]!.findLabel()!.getElement()).toHaveTextContent('Label for key');
      expect(wrapper.findItems()[1]!.findValue()!.getElement()).toHaveTextContent('Value');
    });
  });

  test('renders attributes for assistive technology when set', () => {
    const ariaLabel = 'awesome label';
    const ariaLabelledby = 'awesome labelled by';

    const { wrapper } = renderKeyValuePairs(
      <KeyValuePairs
        ariaLabel={ariaLabel}
        ariaLabelledby={ariaLabelledby}
        items={[
          {
            label: 'Label for key',
            value: 'Value',
          },
        ]}
      />
    );

    expect(wrapper.getElement()).toHaveAttribute('aria-label', ariaLabel);
    expect(wrapper.getElement()).toHaveAttribute('aria-labelledby', ariaLabelledby);
  });
});
