// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

import imageExampleA from '../../common/image-example-1.png';
import imageExampleB from '../../common/image-example-2.png';
import imageExampleC from '../../common/image-example-3.png';

export default function Images() {
  return (
    <SpaceBetween size="xl">
      <Header variant="h2">Container with media</Header>
      <ColumnLayout columns={3}>
        <Container
          media={{
            content: <img src={imageExampleA} alt="placeholder" />,
            position: 'side',
            width: '40%',
          }}
        >
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="vertical" size="xxs">
              <Box variant="h2">
                <Link fontSize="heading-m" href="#" variant="primary">
                  Product title
                </Link>
              </Box>
              <Box variant="small">Company name</Box>
            </SpaceBetween>
            <Box variant="p">
              This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus tempor dolor ac
              accumsan.
            </Box>
            <SpaceBetween direction="vertical" size="xxs">
              <Box fontWeight="bold">$0.1/hour</Box>
            </SpaceBetween>
            <Button>Shop now</Button>
          </SpaceBetween>
        </Container>

        <Container
          media={{
            content: <img src={imageExampleB} alt="placeholder" />,
            position: 'side',
            width: '40%',
          }}
        >
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="vertical" size="xxs">
              <Box variant="h2">
                <Link fontSize="heading-m" href="#" variant="primary">
                  Product title
                </Link>
              </Box>
              <Box variant="small">Company name</Box>
            </SpaceBetween>
            <Box variant="p">
              This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus tempor dolor ac
              accumsan.
            </Box>
            <SpaceBetween direction="vertical" size="xxs">
              <Box fontWeight="bold">$0.1/hour</Box>
            </SpaceBetween>
            <Button>Shop now</Button>
          </SpaceBetween>
        </Container>

        <Container
          media={{
            content: <img src={imageExampleC} alt="placeholder" />,
            position: 'side',
            width: '40%',
          }}
        >
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="vertical" size="xxs">
              <Box variant="h2">
                <Link fontSize="heading-m" href="#" variant="primary">
                  Product title
                </Link>
              </Box>
              <Box variant="small">Company name</Box>
            </SpaceBetween>
            <Box variant="p">
              This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus tempor dolor ac
              accumsan.
            </Box>
            <SpaceBetween direction="vertical" size="xxs">
              <Box fontWeight="bold">$0.1/hour</Box>
            </SpaceBetween>
            <Button>Shop now</Button>
          </SpaceBetween>
        </Container>
      </ColumnLayout>
      <ColumnLayout columns={3}>
        <Container
          media={{
            content: (
              <img
                src={imageExampleA}
                alt="Video thumbnail"
                style={{ height: 200, objectFit: 'cover', width: '100%' }}
              />
            ),
            height: 200,
          }}
        >
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="vertical" size="xxs">
              <Box variant="small">43 min</Box>
              <Box variant="h3">Video Title</Box>
            </SpaceBetween>
            This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus tempor dolor ac
            accumsan. This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus tempor
            dolor ac accumsan.
            <Box padding={{ top: 'xs' }}>
              <Link fontSize="inherit" variant="secondary" className="secondary-link" href="#">
                See video
              </Link>
            </Box>
          </SpaceBetween>
        </Container>

        <Container
          media={{
            content: (
              <img
                src={imageExampleB}
                alt="Video thumbnail"
                style={{ height: 200, objectFit: 'cover', width: '100%' }}
              />
            ),
            height: 200,
          }}
        >
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="vertical" size="xxs">
              <Box variant="small">43 min</Box>
              <Box variant="h3">Video Title</Box>
            </SpaceBetween>
            This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus tempor dolor ac
            accumsan. This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus tempor
            dolor ac accumsan.
            <Box padding={{ top: 'xs' }}>
              <Link fontSize="inherit" variant="secondary" className="secondary-link" href="#">
                See video
              </Link>
            </Box>
          </SpaceBetween>
        </Container>

        <Container
          media={{
            content: (
              <img
                src={imageExampleC}
                alt="Video thumbnail"
                style={{ height: 200, objectFit: 'cover', width: '100%' }}
              />
            ),
            height: 200,
          }}
        >
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="vertical" size="xxs">
              <Box variant="small">43 min</Box>
              <Box variant="h3">Video Title</Box>
            </SpaceBetween>
            This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus tempor dolor ac
            accumsan. This is a paragraph. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut luctus tempor
            dolor ac accumsan.
            <Box padding={{ top: 'xs' }}>
              <Link fontSize="inherit" variant="secondary" className="secondary-link" href="#">
                See video
              </Link>
            </Box>
          </SpaceBetween>
        </Container>
      </ColumnLayout>
    </SpaceBetween>
  );
}
