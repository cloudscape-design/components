// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import { activateAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { getGeneratedAnalyticsMetadata } from '@cloudscape-design/component-toolkit/internal/analytics-metadata/utils';

import Button from '../../../lib/components/button';
import Modal from '../../../lib/components/modal';
import InternalModal from '../../../lib/components/modal/internal';
import createWrapper from '../../../lib/components/test-utils/dom';
import { validateComponentNameAndLabels } from '../../internal/__tests__/analytics-metadata-test-utils';

import labels from '../../../lib/components/modal/analytics-metadata/styles.css.js';

const modalHeader = 'Modal title';
const contexts = [
  {
    type: 'component',
    detail: {
      name: 'awsui.Modal',
      label: modalHeader,
    },
  },
];

beforeAll(() => {
  activateAnalyticsMetadata(true);
});
test('Modal renders correct analytics metadata', () => {
  const modalRoot = document.createElement('div');
  document.body.appendChild(modalRoot);
  const { container } = render(
    <Modal
      visible={true}
      modalRoot={modalRoot}
      closeAriaLabel="Close modal"
      footer={<Button variant="primary">Confirm</Button>}
      header={modalHeader}
    >
      content
    </Modal>,
    {
      container: modalRoot,
    }
  );
  const wrapper = createWrapper(container).findModal()!;
  validateComponentNameAndLabels(wrapper.findDismissButton()!.getElement(), labels);
  expect(getGeneratedAnalyticsMetadata(wrapper.findDismissButton()!.getElement())).toEqual({
    action: 'dismiss',
    detail: {
      label: 'Close modal',
    },
    contexts,
  });

  expect(getGeneratedAnalyticsMetadata(wrapper.findFooter()!.findButton()!.getElement())).toEqual({
    action: 'click',
    detail: {
      label: 'Confirm',
    },
    contexts: [
      {
        type: 'component',
        detail: {
          name: 'awsui.Button',
          label: 'Confirm',
          properties: {
            variant: 'primary',
            disabled: 'false',
          },
        },
      },
      ...contexts,
    ],
  });
});

test('Internal Modal does not render "component" metadata', () => {
  const modalRoot = document.createElement('div');
  document.body.appendChild(modalRoot);
  const { container } = render(
    <InternalModal size="medium" visible={true} modalRoot={modalRoot} closeAriaLabel="Close modal" header={modalHeader}>
      content
    </InternalModal>,
    {
      container: modalRoot,
    }
  );
  const wrapper = createWrapper(container).findModal()!;
  validateComponentNameAndLabels(wrapper.findDismissButton()!.getElement(), labels);
  expect(getGeneratedAnalyticsMetadata(wrapper.findDismissButton()!.getElement())).toEqual({
    action: 'dismiss',
    detail: {
      label: 'Close modal',
    },
  });
});
