// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';
import range from 'lodash/range';

import Flashbar from '~components/flashbar';

import FocusTarget from '../common/focus-target';
import ScreenshotArea from '../utils/screenshot-area';

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
      <ScreenshotArea disableAnimations={true}>
        <Flashbar items={items} />
      </ScreenshotArea>
    </>
  );
}
