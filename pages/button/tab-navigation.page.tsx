// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Button from '~components/button';
import ScreenshotArea from '../utils/screenshot-area';

export default function TabNavigationPage() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <h1>Buttons for focus testing</h1>
      <Button id="focusButton">Start button</Button> <Button href="#">Active with href</Button>{' '}
      <Button href="#" disabled={true}>
        Disabled with href
      </Button>{' '}
      <Button loading={true}>Loading</Button>{' '}
      <Button href="#" loading={true}>
        Loading with href
      </Button>{' '}
      <Button href="#" variant="link">
        Last button
      </Button>
    </ScreenshotArea>
  );
}
