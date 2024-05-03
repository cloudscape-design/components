// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';
import Flashbar, { FlashbarProps } from '../../../lib/components/flashbar';
import createWrapper from '../../../lib/components/test-utils/dom';
import { render } from '@testing-library/react';

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

test.each([{ stackItems: false }, { stackItems: true }])(
  'items can be dismissed, stackItems=$stackItems',
  ({ stackItems }) => {
    render(<StatefulFlashbar stackItems={stackItems} />);
    const flashbar = createWrapper().findFlashbar()!;

    expect(flashbar.findItems()).toHaveLength(stackItems ? 1 : 3);
    expect(flashbar.findItems()[0].getElement()).toHaveTextContent('Success');

    flashbar.findItems()[0].findDismissButton()!.click();
    expect(flashbar.findItems()).toHaveLength(stackItems ? 1 : 2);
    expect(flashbar.findItems()[0].getElement()).toHaveTextContent('Error');

    flashbar.findItems()[0].findDismissButton()!.click();
    expect(flashbar.findItems()).toHaveLength(1);
    expect(flashbar.findItems()[0].getElement()).toHaveTextContent('Info');

    flashbar.findItems()[0].findDismissButton()!.click();
    expect(flashbar.findItems()).toHaveLength(0);
  }
);
