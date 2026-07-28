// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';
import { CustomPanel } from './custom-panel';
import { CustomPill } from './custom-pill';

import overrides from './style-overrides.scss';

export default function StyleApiToolsPage() {
  return (
    <SimplePage
      title="Style API v2: tools"
      subtitle={
        <Box variant="span">
          Applies style-api tools to a set of custom components, which are then themed via{' '}
          <Box variant="awsui-inline-code">--awsui-style-*</Box> tokens.
        </Box>
      }
      screenshotArea={{}}
    >
      <div>
        <h2>Examples</h2>

        <h3>Without carrier tokens — no token inheritance needed</h3>
        <SpaceBetween size="s" direction="horizontal">
          <CustomPill>Default</CustomPill>
          <CustomPill className={overrides.pill}>Themed</CustomPill>
        </SpaceBetween>

        <h3>With carrier tokens — style tokens read by descendant elements</h3>
        <SpaceBetween size="s" direction="horizontal">
          <CustomPanel title="Default">Default style (no overrides).</CustomPanel>
          <CustomPanel className={overrides.panel} title="Themed">
            <SpaceBetween size="s">
              <span>Themed via --awsui-style-* on the root; the title and body colors resolve through carriers.</span>
              <CustomPanel title="Default">Default style (no overrides).</CustomPanel>
            </SpaceBetween>
          </CustomPanel>
        </SpaceBetween>
      </div>
    </SimplePage>
  );
}
