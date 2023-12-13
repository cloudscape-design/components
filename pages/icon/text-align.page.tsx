// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Icon from '~components/icon';
import TextContent from '~components/text-content';
import Box from '~components/box';
import ScreenshotArea from '../utils/screenshot-area';

export default function IconScenario() {
  return (
    <article>
      <ul>
        <li>Icons must align with text</li>
      </ul>
      <ScreenshotArea>
        <Box fontSize="display-l" fontWeight="light">
          <Icon name="gen-ai" size="large" /> Display large <Icon name="external" size="inherit" />
        </Box>
        <TextContent>
          <h1>
            <Icon name="gen-ai" size="big" /> Heading 1 <Icon name="external" size="inherit" />
          </h1>
          <h2>
            <Icon name="gen-ai" size="medium" /> Heading 2 <Icon name="external" size="inherit" />
          </h2>
          <h3>
            <Icon name="gen-ai" /> Heading 3 <Icon name="external" size="inherit" />
          </h3>
          <h4>
            <Icon name="gen-ai" /> Heading 4 <Icon name="external" size="inherit" />
          </h4>
          <h5>
            <Icon name="gen-ai" /> Heading 5 <Icon name="external" size="inherit" />
          </h5>
          <p>
            <Icon name="gen-ai" /> Paragraph <Icon name="external" size="inherit" />
          </p>
          <small>
            <Icon name="gen-ai" size="small" /> Small <Icon name="external" size="inherit" />
          </small>
        </TextContent>
      </ScreenshotArea>
    </article>
  );
}
