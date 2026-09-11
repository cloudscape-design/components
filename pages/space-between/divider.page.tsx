// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

const Item = ({ label }: { label: string }) => (
  <Box padding="s" color="inherit">
    <Box variant="awsui-key-label">{label}</Box>
    <div>Some content here</div>
  </Box>
);

export default function SpaceBetweenDividerPage() {
  return (
    <ScreenshotArea disableAnimations={true}>
      <h1>SpaceBetween — divider</h1>

      <SpaceBetween size="l">
        <Container header={<Header variant="h2">Vertical + divider (size s)</Header>}>
          <SpaceBetween size="s" divider={true}>
            <Item label="Item one" />
            <Item label="Item two" />
            <Item label="Item three" />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Vertical + divider (size m)</Header>}>
          <SpaceBetween size="m" divider={true}>
            <Item label="Item one" />
            <Item label="Item two" />
            <Item label="Item three" />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Vertical + divider (size l)</Header>}>
          <SpaceBetween size="l" divider={true}>
            <Item label="Item one" />
            <Item label="Item two" />
            <Item label="Item three" />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Horizontal + divider (size s)</Header>}>
          <SpaceBetween size="s" direction="horizontal" divider={true}>
            <Item label="Item one" />
            <Item label="Item two" />
            <Item label="Item three" />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Horizontal + divider (size m)</Header>}>
          <SpaceBetween size="m" direction="horizontal" divider={true}>
            <Item label="Item one" />
            <Item label="Item two" />
            <Item label="Item three" />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Vertical + divider — single child (no divider rendered)</Header>}>
          <SpaceBetween size="m" divider={true}>
            <Item label="Only child" />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Vertical without divider (baseline)</Header>}>
          <SpaceBetween size="m">
            <Item label="Item one" />
            <Item label="Item two" />
            <Item label="Item three" />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Vertical + divider — with null/empty children</Header>}>
          <SpaceBetween size="m" divider={true}>
            <Item label="Item one" />
            {null}
            <Item label="Item two" />
            {undefined}
            <Item label="Item three" />
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Horizontal + divider — alignItems center</Header>}>
          <SpaceBetween size="m" direction="horizontal" divider={true} alignItems="center">
            <Box variant="awsui-key-label">Short</Box>
            <div>
              <div>Taller</div>
              <div>content</div>
              <div>here</div>
            </div>
            <Box variant="awsui-key-label">Short</Box>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
