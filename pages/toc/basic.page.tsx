// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Toc from '~components/toc';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';

export default function SimpleContainers() {
  return (
    <article>
      <h1>Simple table of contents</h1>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <Toc />
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
