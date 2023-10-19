// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import createWrapper, { FlashbarWrapper } from '../../../lib/components/test-utils/dom';
import { render } from '@testing-library/react';
import { FlashbarProps } from '../interfaces';
import Button from '../../../lib/components/button';
import Flashbar from '../../../lib/components/flashbar';

export function createFlashbarWrapper(element: React.ReactElement) {
  return createWrapper(render(element).container).findFlashbar()!;
}

export function findList(flashbar: FlashbarWrapper) {
  return flashbar.find('ul');
}

export function testFlashDismissal({ stackItems }: { stackItems: boolean }) {
  const App = () => {
    const [items, setItems] = useState<ReadonlyArray<FlashbarProps.MessageDefinition>>([]);
    const onDismiss = () => setItems([]);
    const onAdd = () => setItems([{ content: 'The content', dismissible: true, onDismiss }]);
    return (
      <>
        <Button onClick={onAdd}>Add an item</Button>
        <Flashbar stackItems={stackItems} items={items} />
      </>
    );
  };
  const appWrapper = createWrapper(render(<App />).container);
  expect(appWrapper.findFlashbar()!.findItems()).toHaveLength(0);
  appWrapper.findButton()!.click();
  const foundItems = appWrapper.findFlashbar()!.findItems();
  expect(foundItems).toHaveLength(1);
  foundItems![0]!.findDismissButton()!.click();
  expect(appWrapper.findFlashbar()!.findItems()).toHaveLength(0);
}
