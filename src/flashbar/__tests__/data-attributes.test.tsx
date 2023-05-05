// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { render } from '@testing-library/react';
import Flashbar from '../../../lib/components/flashbar';
import createWrapper from '../../../lib/components/test-utils/dom';
import { FlashbarProps } from '../interfaces';

const i18nStrings = {
  ariaLabel: 'Notifications',
  notificationBarText: 'Notifications',
  notificationBarAriaLabel: 'View all notifications',
  errorIconAriaLabel: 'Error',
  warningIconAriaLabel: 'Warning',
  successIconAriaLabel: 'Success',
  infoIconAriaLabel: 'Information',
  inProgressIconAriaLabel: 'In progress',
};

function createDataAttributes(items: readonly FlashbarProps.MessageDefinition[]) {
  const itemsByType = {
    progress: 0,
    success: 0,
    warning: 0,
    error: 0,
    info: 0,
  };
  items.forEach(item => {
    if (item.loading) {
      itemsByType.progress++;
    } else if (item.type) {
      itemsByType[item.type]++;
    }
  });
  return Object.fromEntries(Object.entries(itemsByType).map(([key, value]) => [`data-items-${key}`, value]));
}

test.each([false, true])('data attributes are assigned for flashbar with stackItems=%s', stackItems => {
  const items = [
    { type: 'error', header: 'Error 1' },
    { type: 'error', header: 'Error 2' },
    { type: 'warning', header: 'Warning 1' },
  ] as const;

  const { container } = render(
    <Flashbar
      stackItems={stackItems}
      i18nStrings={i18nStrings}
      items={[
        { type: 'error', header: 'Error 1' },
        { type: 'error', header: 'Error 2' },
        { type: 'warning', header: 'Warning 1' },
      ]}
      {...createDataAttributes(items)}
    />
  );

  expect({ ...createWrapper(container).findFlashbar()!.getElement().dataset }).toEqual({
    itemsProgress: '0',
    itemsSuccess: '0',
    itemsWarning: '1',
    itemsError: '2',
    itemsInfo: '0',
  });
});
