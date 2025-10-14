// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Container, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';
import image43 from './images/4-3.png';

export default function CustomContainer() {
  const background = 'light-dark(#fcfcfc, #000)';

  return (
    <ScreenshotArea>
      <h1>Custom Container</h1>

      <SpaceBetween size="m" direction="horizontal">
        <Container
          style={{
            root: {
              background,
              borderColor: 'green',
              borderRadius: '8px',
              borderWidth: '4px',
              boxShadow: '0px 5px 5px red',
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
              background,
              borderColor: 'magenta',
              borderRadius: '0px',
              borderWidth: '1px',
              boxShadow: '0px 5px 5px green',
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
              background,
              borderColor: '#000',
              borderRadius: '20px',
              borderWidth: '3px',
              boxShadow: '0px 5px 5px blue',
            },
            content: {
              paddingBlock: '40px',
              paddingInline: '40px',
            },
            footer: {
              root: {
                paddingBlock: '40px',
                paddingInline: '40px',
              },
              divider: {
                borderColor: '#000',
                borderWidth: '3px',
              },
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
              background,
              borderColor: 'blue',
              borderRadius: '40px',
              borderWidth: '4px',
              boxShadow: '5px 5px 5px pink',
            },
            header: {
              paddingBlock: '60px',
              paddingInline: '10px',
            },
            footer: {
              root: {
                paddingBlock: '60px',
                paddingInline: '10px',
              },
              divider: {
                borderWidth: '0px',
              },
            },
          }}
        />

        <Container
          header="Container header"
          footer="Container footer"
          style={{
            root: {
              background,
              borderColor: 'purple',
              borderRadius: '240px',
              borderWidth: '6px',
              boxShadow: '0px 5px 5px orange',
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
              root: {
                paddingBlock: '40px',
                paddingInline: '140px',
              },
              divider: {
                borderColor: 'purple',
                borderWidth: '6px',
              },
            },
          }}
        >
          Container content
        </Container>
        <Box>
          <Container
            header="Header content"
            variant="stacked"
            style={{
              root: {
                borderColor: 'green',
                borderWidth: '2px',
              },
            }}
          >
            Container content
          </Container>

          <Container
            header="Header content"
            variant="stacked"
            style={{
              root: {
                borderColor: 'purple',
                borderWidth: '10px',
              },
            }}
          >
            Container content
          </Container>
        </Box>

        <Container
          header="Header content"
          media={{
            content: <img src={image43} alt="placeholder" />,
            height: 200,
            position: 'top',
          }}
          style={{
            root: {
              borderColor: 'green',
              borderWidth: '1px',
              borderRadius: '40px',
            },
          }}
        >
          Container content
        </Container>

        <Container
          header="Header content"
          media={{
            content: <img src={image43} alt="placeholder" />,
            width: 200,
            position: 'side',
          }}
          style={{
            root: {
              borderColor: 'green',
              borderWidth: '1px',
              borderRadius: '40px',
            },
          }}
        >
          Container content
        </Container>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
