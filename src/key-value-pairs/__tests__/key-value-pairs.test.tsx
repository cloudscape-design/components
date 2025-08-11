// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import Icon from '../../../lib/components/icon/index.js';
import KeyValuePairs from '../../../lib/components/key-value-pairs/index.js';
import Link from '../../../lib/components/link/index.js';
import SpaceBetween from '../../../lib/components/space-between/index.js';
import createWrapper, { IconWrapper } from '../../../lib/components/test-utils/dom/index.js';

jest.mock('@cloudscape-design/component-toolkit/internal', () => ({
  ...jest.requireActual('@cloudscape-design/component-toolkit/internal'),
  warnOnce: jest.fn(),
}));

function renderKeyValuePairs(jsx: React.ReactElement) {
  const { container, ...rest } = render(jsx);
  return { wrapper: createWrapper(container).findKeyValuePairs()!, ...rest };
}

describe('KeyValuePairs', () => {
  afterEach(() => {
    (warnOnce as jest.Mock).mockReset();
  });

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

    test('renders correctly with ReactNode label', () => {
      const { wrapper } = renderKeyValuePairs(
        <KeyValuePairs
          items={[
            {
              label: (
                <SpaceBetween size={'xxs'} direction={'horizontal'} alignItems={'center'}>
                  <Icon name={'status-info'} />
                  Label after icon
                </SpaceBetween>
              ),
              value: 'Value',
            },
            {
              label: (
                <SpaceBetween size={'xxs'} direction={'horizontal'} alignItems={'center'}>
                  Label before icon
                  <Icon name={'external'} />
                </SpaceBetween>
              ),
              value: 'Value',
            },
          ]}
        />
      );

      const firstLabel = wrapper.findItems()[0]!.findLabel();
      expect(firstLabel!.getElement().firstElementChild!.children).toHaveLength(2);
      expect(firstLabel!.findIcon()).toBeInstanceOf(IconWrapper);
      expect(firstLabel!.getElement()).toHaveTextContent('Label after icon');

      const secondLabel = wrapper.findItems()[1]!.findLabel();
      expect(secondLabel!.getElement().firstElementChild!.children).toHaveLength(2);
      expect(secondLabel!.findIcon()).toBeInstanceOf(IconWrapper);
      expect(secondLabel!.getElement()).toHaveTextContent('Label before icon');
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
  });

  describe('warnOnce when columns property exceeds max', () => {
    test.each([
      { columns: 1, warnOnceMessage: false },
      { columns: 2, warnOnceCalled: false },
      {
        columns: 3,
        warnOnceCalled: false,
      },
      { columns: 4, warnOnceCalled: false },
      {
        columns: 5,
        warnOnceCalled: true,
      },
    ])(`warnOnce called = $warnOnceCalled when columns is set to $columns`, ({ columns, warnOnceCalled }) => {
      renderKeyValuePairs(<KeyValuePairs items={[]} columns={columns} />);
      expect(warnOnce).toHaveBeenCalledTimes(warnOnceCalled ? 1 : 0);
    });
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
