// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { act, render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Button from '../../../lib/components/button';
import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import {
  DATA_ATTR_ANALYTICS_FLASHBAR,
  DATA_ATTR_ANALYTICS_SUPPRESS_FLOW_EVENTS,
} from '../../../lib/components/internal/analytics/selectors';
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
      expect(getGeneratedAnalyticsMetadata(firstDismissButton)).toMatchSnapshot();

      const secondDismissButton = wrapper.findItems()[1].findDismissButton()!.getElement();
      validateComponentNameAndLabels(secondDismissButton, labels);
      expect(getGeneratedAnalyticsMetadata(secondDismissButton)).toMatchSnapshot();
    });
    test('on embedded button', () => {
      const wrapper = renderFlashbar({ stackItems });
      if (stackItems) {
        act(() => wrapper.findToggleButton()!.click());
      }

      const embeddedButton = wrapper.findItems()[2].findActionButton()!.getElement();
      validateComponentNameAndLabels(embeddedButton, labels);

      expect(getGeneratedAnalyticsMetadata(embeddedButton)).toMatchSnapshot();
    });
    test('on button in action slot', () => {
      const wrapper = renderFlashbar({ stackItems });
      if (stackItems) {
        act(() => wrapper.findToggleButton()!.click());
      }

      const buttonInActionSlot = wrapper.findItems()[3].findAction()!.findButton()!.getElement();
      expect(getGeneratedAnalyticsMetadata(buttonInActionSlot)).toMatchSnapshot();
    });
    test('without items', () => {
      const wrapper = renderFlashbar({ stackItems, items: [] });
      const list = wrapper.find('ul')!.getElement();
      validateComponentNameAndLabels(list, labels);
      expect(getGeneratedAnalyticsMetadata(list)).toMatchSnapshot();
    });
  });

  test('on toggle when stackItems=true', () => {
    const wrapper = renderFlashbar({ stackItems: true });
    const toggleButtonWrapper = wrapper.findToggleButton()!;

    validateComponentNameAndLabels(toggleButtonWrapper.getElement(), labels);
    expect(getGeneratedAnalyticsMetadata(toggleButtonWrapper.getElement())).toMatchSnapshot();

    act(() => toggleButtonWrapper.click());

    expect(getGeneratedAnalyticsMetadata(toggleButtonWrapper.getElement())).toMatchSnapshot();
  });

  describe('analytics attributes', () => {
    test(`adds ${DATA_ATTR_ANALYTICS_FLASHBAR} attribute with the flashbar type`, () => {
      const wrapper = renderFlashbar({ items: [{ id: '0', type: 'success' }] });
      expect(wrapper.find(`[${DATA_ATTR_ANALYTICS_FLASHBAR}="success"]`)!.getElement()).toBeInTheDocument();
    });

    test(`adds ${DATA_ATTR_ANALYTICS_FLASHBAR} attribute with the effective flashbar type when loading`, () => {
      const wrapper = renderFlashbar({ items: [{ id: '0', type: 'success', loading: true }] });
      expect(wrapper.find(`[${DATA_ATTR_ANALYTICS_FLASHBAR}="info"]`)!.getElement()).toBeInTheDocument();
    });

    test('adds a data suppress attribute if suppressFlowMetricEvents is set', () => {
      const wrapper = renderFlashbar({
        items: [{ id: '0', type: 'success', analyticsMetadata: { suppressFlowMetricEvents: true } }],
      });
      expect(wrapper.find(`[${DATA_ATTR_ANALYTICS_SUPPRESS_FLOW_EVENTS}]`)).not.toBeNull();
    });
  });
});
