// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import {
  activateAnalyticsMetadata,
  GeneratedAnalyticsMetadataFragment,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Alert, { AlertProps } from '../../../lib/components/alert/index.js';
import InternalAlert from '../../../lib/components/alert/internal.js';
import Button from '../../../lib/components/button/index.js';
import createWrapper from '../../../lib/components/test-utils/dom/index.js';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils.js';

import labels from '../../../lib/components/alert/analytics-metadata/styles.css.js';

function renderAlert(props: AlertProps = {}) {
  const renderResult = render(<Alert {...props} />);
  return createWrapper(renderResult.container).findAlert()!;
}

const getMetadata = (label: string, type: string) => {
  const metadata: GeneratedAnalyticsMetadataFragment = {
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Alert',
          label,
          properties: {
            type,
          },
        },
      },
    ],
  };
  return metadata;
};

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
describe('Alert renders correct analytics metadata', () => {
  test('on dismiss button', () => {
    const wrapper = renderAlert({ dismissible: true, i18nStrings: { dismissAriaLabel: 'dismiss label' } });
    const dismissButton = wrapper.findDismissButton()!.getElement();
    validateComponentNameAndLabels(dismissButton, labels);
    expect(getGeneratedAnalyticsMetadata(dismissButton)).toEqual({
      action: 'dismiss',
      detail: {
        label: 'dismiss label',
      },
      ...getMetadata('', 'info'),
    });
  });

  test('on action button', () => {
    const wrapper = renderAlert({ buttonText: 'click me' });
    const actionButton = wrapper.findActionButton()!.getElement();
    validateComponentNameAndLabels(actionButton, labels);
    expect(getGeneratedAnalyticsMetadata(actionButton)).toEqual({
      action: 'buttonClick',
      detail: {
        label: 'click me',
      },
      ...getMetadata('', 'info'),
    });
  });

  test('with header', () => {
    const wrapper = renderAlert({ header: 'alert header' });
    const alertElement = wrapper.getElement();
    validateComponentNameAndLabels(alertElement, labels);
    expect(getGeneratedAnalyticsMetadata(alertElement)).toEqual(getMetadata('alert header', 'info'));
  });

  test('with type', () => {
    const wrapper = renderAlert({ type: 'error' });
    const alertElement = wrapper.getElement();
    validateComponentNameAndLabels(alertElement, labels);
    expect(getGeneratedAnalyticsMetadata(alertElement)).toEqual(getMetadata('', 'error'));
  });

  test('with buttons in actions slot', () => {
    const wrapper = renderAlert({ action: <Button>another button</Button> });
    const buttonElement = wrapper.findActionSlot()!.findButton()!.getElement();
    expect(getGeneratedAnalyticsMetadata(buttonElement)).toEqual({
      action: 'click',
      detail: {
        label: 'another button',
      },
      contexts: [
        {
          type: 'component',
          detail: {
            name: 'awsui.Button',
            label: 'another button',
            properties: {
              disabled: 'false',
              variant: 'normal',
            },
          },
        },
        ...getMetadata('', 'info').contexts!,
      ],
    });
  });
});

test('Internal Alert does not render "component" metadata', () => {
  const renderResult = render(<InternalAlert type="info" />);
  const wrapper = createWrapper(renderResult.container).findAlert()!;
  expect(getGeneratedAnalyticsMetadata(wrapper.getElement())).toEqual({});
});
