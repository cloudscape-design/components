// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Divider, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function DividerStyleApi() {
  return (
    <ScreenshotArea>
      <h1>Divider Style API</h1>
      <SpaceBetween size="l">
        <div>
          <h2>Default</h2>
          <Divider />
        </div>
        <div>
          <h2>Custom color</h2>
          <Divider style={{ root: { borderColor: 'rebeccapurple' } }} />
        </div>
        <div>
          <h2>Custom width</h2>
          <Divider style={{ root: { borderWidth: '4px' } }} />
        </div>
        <div>
          <h2>Custom color + width</h2>
          <Divider style={{ root: { borderColor: 'tomato', borderWidth: '2px' } }} />
        </div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
