// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import SplitButton, { SplitButtonProps } from '~components/split-button';
import ScreenshotArea from '../utils/screenshot-area';
import { SpaceBetween } from '~components';

const items: SplitButtonProps['items'] = [
  {
    id: 'id1',
    text: 'Option 1',
  },
  {
    id: 'id2',
    text: 'Link option with some longer text inside it',
    disabled: true,
    href: '#',
  },
  {
    id: 'id3',
    text: 'Option 3',
    href: '#',
    external: true,
    externalIconAriaLabel: '(opens in new tab)',
  },
  {
    id: 'id4',
    text: 'Option 4',
    disabled: true,
  },
  {
    id: 'id5',
    text: 'Option 5',
  },
  {
    id: 'id6',
    text: 'Option 6',
    disabled: true,
  },
];

export default function SplitButtonPage() {
  return (
    <ScreenshotArea
      disableAnimations={true}
      style={{
        // extra space to include dropdown in the screenshot area
        paddingBottom: 100,
      }}
    >
      <article>
        <h1>Simple SplitButton</h1>
        <SpaceBetween size="s" direction="horizontal">
          <SplitButton id="SplitButton1" variant="normal" items={items} ariaLabel="open dropdown">
            Option 0
          </SplitButton>
          <SplitButton id="SplitButton2" variant="primary" items={items} ariaLabel="open dropdown">
            Option 0
          </SplitButton>
        </SpaceBetween>
      </article>
    </ScreenshotArea>
  );
}
