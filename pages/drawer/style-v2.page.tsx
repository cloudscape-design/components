// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Button, Checkbox, Drawer, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function DrawerStyleV2Page() {
  const [showStyled, setShowStyled] = useState(true);
  return (
    <SimplePage
      title="Drawer with Style API v2"
      screenshotArea={{}}
      settings={
        <Checkbox checked={showStyled} onChange={({ detail }) => setShowStyled(detail.checked)}>
          Custom styling
        </Checkbox>
      }
    >
      <div style={{ position: 'relative', height: 400 }}>
        <Drawer
          header="Resources"
          position="absolute"
          backdrop={true}
          closeAction={{
            ariaLabel: 'Close drawer',
          }}
          onClose={() => {}}
          footer={
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="primary">Save</Button>
              <Button>Cancel</Button>
            </SpaceBetween>
          }
          classNames={
            showStyled ? { root: styles['styled-drawer'], closeButton: styles['styled-close-action'] } : undefined
          }
        >
          <SpaceBetween size="s">
            <Box variant="p">
              <Box variant="strong">Instance i-0abc123</Box>
              <br />
              Type: t3.medium | Region: us-east-1
            </Box>
            <Box variant="p">
              <Box variant="strong">Instance i-0def456</Box>
              <br />
              Type: m5.large | Region: eu-west-1
            </Box>
            <Box variant="p">
              <Box variant="strong">Instance i-0ghi789</Box>
              <br />
              Type: c5.xlarge | Region: ap-south-1
            </Box>
          </SpaceBetween>
        </Drawer>
      </div>
    </SimplePage>
  );
}
