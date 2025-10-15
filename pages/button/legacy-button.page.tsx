// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';

import ScreenshotArea from '../utils/screenshot-area';

export default function ButtonsScenario() {
  return (
    <article>
      <ScreenshotArea>
        <button className="awsui_button_vjswe_t8nlg_157">Legacy button</button>
        <button className="awsui_button_vjswe_1qz6m_157">Older legacy button</button>
        <Button>Button</Button>
      </ScreenshotArea>
    </article>
  );
}
