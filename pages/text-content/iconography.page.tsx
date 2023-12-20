// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import TextContent from '~components/text-content';
import Icon from '~components/icon';
import ScreenshotArea from '../utils/screenshot-area';

export default function TextContentPermutations() {
  return (
    <ScreenshotArea>
      <TextContent>
        <h1>
          <Icon name="status-positive" size="big" /> Heading 1 <Icon name="external" size="inherit" />
        </h1>
        <h2>
          <Icon name="status-positive" size="medium" /> Heading 2 <Icon name="external" size="inherit" />
        </h2>
        <h3>
          <Icon name="status-positive" size="medium" /> Heading 3 <Icon name="external" size="inherit" />
        </h3>
        <h4>
          <Icon name="status-positive" size="normal" /> Heading 4 <Icon name="external" size="inherit" />
        </h4>
        <h5>
          <Icon name="status-positive" size="normal" /> Heading 5 <Icon name="external" size="inherit" />
        </h5>
        <p>
          <Icon name="status-positive" size="normal" /> paragraph <Icon name="external" size="inherit" />
        </p>
        <small>
          <Icon name="status-positive" size="small" /> small <Icon name="external" size="inherit" />
        </small>
      </TextContent>
    </ScreenshotArea>
  );
}
