// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import TextContent from '~components/text-content';

import ScreenshotArea from '../utils/screenshot-area';

export default function ContainerHeadersDemo() {
  return (
    <ScreenshotArea>
      <SpaceBetween size="l">
        <Header variant="h2" headingTagOverride="h1" actions={<Button>Button</Button>}>
          Standalone header
        </Header>
        <Container
          header={
            <Header variant="h2" actions={<Button>Button</Button>}>
              Container
            </Header>
          }
        >
          Lorem ipsum dolor sit amet.
        </Container>
        <Container
          header={
            <Header variant="h2" info={<Link variant="info">Info</Link>}>
              With info-link
            </Header>
          }
        >
          Header in this container should have consistent spacing above and below
        </Container>
        <h3>H3 element to make axe happy with the h4 below</h3>
        <Container
          header={
            <TextContent>
              <h4>This is an h4 wrapped in TextContent</h4>
            </TextContent>
          }
        >
          Header in this container should have consistent spacing above and below
        </Container>
        <Container
          header={
            <Header
              variant="h2"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button>Button</Button>
                  <Button>And Button</Button>
                  <Button>And a third Button with very long text</Button>
                </SpaceBetween>
              }
            >
              Container #3 has a very long title that will interfere with the button group on the right
            </Header>
          }
        >
          This container uses a semantically correct h2 in the header.
        </Container>
        <Container
          header={
            <Header
              variant="h2"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button>Button</Button>
                  <Button>And Button</Button>
                  <Button>And a third Button with very long text</Button>
                </SpaceBetween>
              }
              description={
                <>
                  Some additional text{' '}
                  <Link fontSize="inherit" variant="primary" external={true} externalIconAriaLabel="(External)">
                    with a link
                  </Link>
                  .
                </>
              }
            >
              Container
            </Header>
          }
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </Container>
        <Container
          header={
            <Header
              variant="h2"
              actions={<Button>Button</Button>}
              counter="10"
              info={<Link variant="info">Info</Link>}
              description="This container uses a semantically correct h2 in the header. Here is some more text for a very long example because sometimes descriptions have a lot of text and you just need to know what it will look like so here is more text."
            >
              Container with a counter and a longer title so you can see how the info link wraps to the next line
            </Header>
          }
        >
          <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</div>
        </Container>
        <Container
          header={
            <Header variant="h2" actions={<Button>Button</Button>}>
              Container#6LongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableTextLongUnbreakableText
            </Header>
          }
        >
          Lorem ipsum dolor sit amet.
        </Container>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
