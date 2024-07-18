// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Container, Header, Hotspot, SpaceBetween } from '~components';

export function PageFour() {
  return (
    <SpaceBetween size="l">
      <Container header={<Header variant="h2">Information about this object</Header>}>
        <SpaceBetween size="xxl" direction="horizontal">
          <SpaceBetween size="xxxs">
            <Box variant="h3">File type</Box>
            <span>PDF</span>
          </SpaceBetween>
          <div />
          <SpaceBetween size="xxxs">
            <Box variant="h3">Size</Box>
            <span>1.2 MB</span>
          </SpaceBetween>
          <div />
          <SpaceBetween size="xxxs">
            <Box variant="h3">
              Uploaded <Hotspot hotspotId="view-object-information" direction="right" />
            </Box>
            <span>Today</span>
          </SpaceBetween>
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
}
