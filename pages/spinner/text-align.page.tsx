// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Spinner from '~components/spinner';

import ScreenshotArea from '../utils/screenshot-area';

export default function SpinnerScenario() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <h2>Spinner component with text</h2>
      <h1>
        <Spinner size="big" /> Heading 1
      </h1>
      <h2>
        <Spinner /> Heading 2
      </h2>
      <h3>
        <Spinner /> Heading 3
      </h3>
      <h4>
        <Spinner /> Heading 4
      </h4>
      <h5>
        <Spinner /> Heading 5
      </h5>
      <p>
        <Spinner /> Paragraph
      </p>
      <small>
        <Spinner /> Small
      </small>
    </ScreenshotArea>
  );
}
