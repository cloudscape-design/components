// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import { render } from '@testing-library/react';

import { disableMotion } from '@cloudscape-design/global-styles';

import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import createWrapper from '../../../lib/components/test-utils/dom';

const defaultItems: FlashbarProps.MessageDefinition[] = [
  {
    type: 'success',
    dismissible: true,
    header: 'Success',
    content: 'Everything went fine',
  },
  {
    type: 'error',
    dismissible: true,
    header: 'Error',
    content: 'Something went wrong',
  },
  {
    type: 'info',
    dismissible: true,
    header: 'Info',
    content: 'Something went',
  },
];

function StatefulFlashbar({ stackItems }: { stackItems: boolean }) {
  const [items, setItems] = useState(defaultItems);
  const itemsWithDismiss = items.map(item => ({
    ...item,
    onDismiss: () => setItems(prev => prev.filter(prevItem => prevItem !== item)),
  }));
  return <Flashbar stackItems={stackItems} items={itemsWithDismiss} />;
}

afterEach(() => {
  disableMotion(false);
});

test.each([{ stackItems: false }, { stackItems: true }])(
  'items can be dismissed, stackItems=$stackItems',
  ({ stackItems }) => {
    // Disabling motion is required so that removing the last item when stackItems=true happens instantaneously.
    if (stackItems) {
      disableMotion(true);
    }

    render(<StatefulFlashbar stackItems={stackItems} />);
    const getFlashbarItems = () => {
      const flashbar = createWrapper().findFlashbar();
      return flashbar ? flashbar.findItems() : [];
    };

    expect(getFlashbarItems()).toHaveLength(stackItems ? 1 : 3);
    expect(getFlashbarItems()[0].getElement()).toHaveTextContent('Success');

    getFlashbarItems()[0].findDismissButton()!.click();
    expect(getFlashbarItems()).toHaveLength(stackItems ? 1 : 2);
    expect(getFlashbarItems()[0].getElement()).toHaveTextContent('Error');

    getFlashbarItems()[0].findDismissButton()!.click();
    expect(getFlashbarItems()).toHaveLength(1);
    expect(getFlashbarItems()[0].getElement()).toHaveTextContent('Info');

    getFlashbarItems()[0].findDismissButton()!.click();
    expect(getFlashbarItems()).toHaveLength(0);
  }
);
