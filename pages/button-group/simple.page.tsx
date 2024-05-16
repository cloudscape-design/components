// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonGroup, { ButtonGroupProps } from '~components/button-group';
import ScreenshotArea from '../utils/screenshot-area';

const items: ButtonGroupProps['items'] = [
  {
    type: 'divider',
  },
];

export default function ButtonGroupPage() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <article>
        <h1>Simple ButtonGroup</h1>
        <ButtonGroup id="ButtonGroup1" items={items} />
      </article>
    </ScreenshotArea>
  );
}
