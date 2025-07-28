// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Container, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

export default function CustomContainer() {
  return (
    <ScreenshotArea>
      <h1>Custom Container</h1>

      <SpaceBetween size="m" direction="horizontal">
        <Container
          style={{
            root: {
              background: '#ccc',
              borderColor: 'green',
              borderRadius: '8px',
              borderWidth: '4px',
            },
            content: {
              paddingBlock: '0px',
              paddingInline: '0px',
            },
          }}
        >
          Container content
        </Container>

        <Container
          header="Container header"
          style={{
            root: {
              background: '#ccc',
              borderColor: 'magenta',
              borderRadius: '0px',
              borderWidth: '1px',
            },
            content: {
              paddingBlock: '20px',
              paddingInline: '40px',
            },
            header: {
              paddingBlock: '20px',
              paddingInline: '40px',
            },
          }}
        >
          Container content
        </Container>

        <Container
          footer="Container footer"
          style={{
            root: {
              background: '#ccc',
              borderColor: '#000',
              borderRadius: '20px',
              borderWidth: '3px',
            },
            content: {
              paddingBlock: '40px',
              paddingInline: '40px',
            },
            footer: {
              borderColor: '#000',
              borderWidth: '3px',
              paddingBlock: '40px',
              paddingInline: '40px',
            },
          }}
        >
          Container content
        </Container>

        <Container
          header="Container header"
          footer="Container footer"
          style={{
            root: {
              background: '#ccc',
              borderColor: 'blue',
              borderRadius: '40px',
              borderWidth: '4px',
            },
            header: {
              paddingBlock: '60px',
              paddingInline: '10px',
            },
            footer: {
              borderWidth: '0px',
              paddingBlock: '60px',
              paddingInline: '10px',
            },
          }}
        />

        <Container
          header="Container header"
          footer="Container footer"
          style={{
            root: {
              background: '#ccc',
              borderColor: 'purple',
              borderRadius: '240px',
              borderWidth: '6px',
            },
            content: {
              paddingBlock: '20px',
              paddingInline: '140px',
            },
            header: {
              paddingBlock: '20px 0px',
              paddingInline: '140px',
            },
            footer: {
              borderColor: 'purple',
              borderWidth: '6px',
              paddingBlock: '40px',
              paddingInline: '140px',
            },
          }}
        >
          Container content
        </Container>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
