// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import Example from './example';
import { createLinearPartialLatencyProps } from './series';

const partialLatencyProps = createLinearPartialLatencyProps();
const yDomain = [0, 300];

export default function () {
  return (
    <>
      <h1>Area charts with partial data</h1>
      <ScreenshotArea>
        <SpaceBetween direction="vertical" size="xl">
          <Example name="Linear latency chart" {...partialLatencyProps} yDomain={yDomain} />
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
