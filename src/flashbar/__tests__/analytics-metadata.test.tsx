// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Button from '../../../lib/components/button';
import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import labels from '../../../lib/components/flashbar/analytics-metadata/styles.css.js';

const items: FlashbarProps['items'] = [
  {
    header: 'Failed to update 4 instances',
    type: 'error',
    content: 'This is a dismissible error message.',
    dismissible: true,
    dismissLabel: 'Dismiss message 1',
    onDismiss: () => {},
    id: 'message_1',
  },
  {
    content: 'This is a an info flash.',
    dismissible: true,
    dismissLabel: 'Dismiss message 2',
    onDismiss: () => {},
    id: 'message_2',
  },
  {
    header: 'Warning with button',
    type: 'warning',
    content: 'This is a a warning flash without id.',
    buttonText: 'click me',
    onButtonClick: () => {},
  },
  {
    header: 'Success with action slot 3',
    type: 'success',
    action: <Button>Another action</Button>,
    id: 'message_4',
  },
];

const i18nStrings: FlashbarProps['i18nStrings'] = {
  ariaLabel: 'Notifications',
  notificationBarAriaLabel: 'View all notifications',
  notificationBarText: 'Notifications bar',
  errorIconAriaLabel: 'Error',
  warningIconAriaLabel: 'Warning',
  successIconAriaLabel: 'Success',
  infoIconAriaLabel: 'Info',
  inProgressIconAriaLabel: 'In progress',
};

function renderFlashbar(props: Partial<FlashbarProps> = {}) {
  const renderResult = render(<Flashbar items={items} i18nStrings={i18nStrings} {...props} />);
  return createWrapper(renderResult.container).findFlashbar()!;
}

const getMetadata = (itemPosition?: number, stackItems = false, expanded?: boolean, itemsCount = items.length) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Flashbar',
          label: 'Notifications',
          properties: {
            stackItems: `${!!stackItems}`,
            itemsCount: `${itemsCount}`,
            ...(stackItems && expanded !== undefined ? { expanded: `${expanded}` } : {}),
          },
          ...(itemPosition
            ? {
                innerContext: {
                  itemPosition: `${itemPosition}`,
                  itemLabel: `${items[itemPosition - 1].header || ''}`,
                  itemType: `${items[itemPosition - 1].type || 'info'}`,
                  ...(items[itemPosition - 1].id ? { itemId: items[itemPosition - 1].id } : {}),
                },
              }
            : {}),
        },
      },
    ],
  };
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Flashbar renders correct analytics metadata', () => {
  describe.each([false, true])('with stackItems=%s', stackItems => {
    test('on dismiss button', () => {
      const wrapper = renderFlashbar({ stackItems });
      if (stackItems) {
        act(() => wrapper.findToggleButton()!.click());
      }

      const firstDismissButton = wrapper.findItems()[0].findDismissButton()!.getElement();
      validateComponentNameAndLabels(firstDismissButton, labels);
      expect(getGeneratedAnalyticsMetadata(firstDismissButton)).toEqual({
        action: 'dismiss',
        detail: {
          label: 'Dismiss message 1',
        },
        ...getMetadata(1, stackItems, true),
      });

      const secondDismissButton = wrapper.findItems()[1].findDismissButton()!.getElement();
      validateComponentNameAndLabels(secondDismissButton, labels);
      expect(getGeneratedAnalyticsMetadata(secondDismissButton)).toEqual({
        action: 'dismiss',
        detail: {
          label: 'Dismiss message 2',
        },
        ...getMetadata(2, stackItems, true),
      });
    });
    test('on embedded button', () => {
      const wrapper = renderFlashbar({ stackItems });
      if (stackItems) {
        act(() => wrapper.findToggleButton()!.click());
      }

      const embeddedButton = wrapper.findItems()[2].findActionButton()!.getElement();
      validateComponentNameAndLabels(embeddedButton, labels);
      expect(getGeneratedAnalyticsMetadata(embeddedButton)).toEqual({
        action: 'buttonClick',
        detail: {
          label: 'click me',
        },
        ...getMetadata(3, stackItems, true),
      });
    });
    test('on button in action slot', () => {
      const wrapper = renderFlashbar({ stackItems });
      if (stackItems) {
        act(() => wrapper.findToggleButton()!.click());
      }

      const buttonInActionSlot = wrapper.findItems()[3].findAction()!.findButton()!.getElement();
      expect(getGeneratedAnalyticsMetadata(buttonInActionSlot)).toEqual({
        action: 'click',
        detail: {
          label: 'Another action',
        },
        contexts: [
          {
            type: 'component',
            detail: {
              name: 'awsui.Button',
              label: 'Another action',
              properties: {
                disabled: 'false',
                variant: 'normal',
              },
            },
          },
          ...getMetadata(4, stackItems, true).contexts!,
        ],
      });
    });
    test('without items', () => {
      const wrapper = renderFlashbar({ stackItems, items: [] });
      const list = wrapper.find('ul')!.getElement();
      validateComponentNameAndLabels(list, labels);
      expect(getGeneratedAnalyticsMetadata(list)).toEqual({
        ...getMetadata(undefined, stackItems, false, 0),
      });
    });
  });

  test('on toggle when stackItems=true', () => {
    const wrapper = renderFlashbar({ stackItems: true });
    const toggleButtonWrapper = wrapper.findToggleButton()!;

    validateComponentNameAndLabels(toggleButtonWrapper.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(toggleButtonWrapper.getElement())).toEqual({
      action: 'expand',
      detail: {
        label: 'Notifications bar',
        expanded: 'true',
      },
      ...getMetadata(undefined, true, false),
    });

    act(() => toggleButtonWrapper.click());

    expect(getGeneratedAnalyticsMetadata(toggleButtonWrapper.getElement())).toEqual({
      action: 'expand',
      detail: {
        label: 'Notifications bar',
        expanded: 'false',
      },
      ...getMetadata(undefined, true, true),
    });
  });
});
