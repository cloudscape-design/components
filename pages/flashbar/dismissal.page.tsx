// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import Flashbar from '~components/flashbar';
import { useState } from 'react';
import range from 'lodash/range';
import FocusTarget from '../common/focus-target';

function generateArray<T>(count: number, func: (index: number) => T): Array<T> {
  return range(count).map((_, index) => func(index));
}

export default function FlashbarPermutations() {
  const [items, setItems] = useState(
    generateArray(5, index => ({
      content: 'This is entry number ' + index,
      index,
      dismissible: true,
      dismissLabel: 'Dismiss',
      statusIconAriaLabel: 'Info',
      onDismiss: () => dismiss(index),
    }))
  );

  const dismiss = (index: number) => {
    setItems(items => items.filter(item => item.index !== index));
  };

  return (
    <>
      <h1>Flashbar dismissal test</h1>
      <FocusTarget />
      <ScreenshotArea>
        <Flashbar items={items} />
      </ScreenshotArea>
    </>
  );
}
