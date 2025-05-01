// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Button, Container, Grid, Icon, Link, Popover, SpaceBetween, TextContent } from '~components';

import ScreenshotArea from '../../utils/screenshot-area';
import BreadcrumbGroup from './breadcrumb-group';
import Breadcrumbs from './index';

export default function BreadcrumbsPermutations() {
  return (
    <ScreenshotArea>
      <TextContent>
        <h1>Breadcrumbs demo</h1>
        <p>
          This example shows how you can achieve various breadcrumb features using composition, as well as building a
          configuration API on top of a composition base, while still ensuring elements are accurately nested
          semantically.
        </p>
        <ol>
          <li>The first two breadcrumbs show a simple example</li>
          <li>The third and fourth use a custom separator</li>
          <li>The fifth example adds icons to each item to create a file explorer</li>
          <li>The last example uses a home icon and a popover to demonstrate a responsive/collapsed version</li>
        </ol>
        <br />
      </TextContent>

      <SpaceBetween size="m">
        {/* 1st example */}
        <Container>
          <Breadcrumbs.Group>
            <Breadcrumbs.List>
              <Breadcrumbs.ListItem>
                <Link href="#">First</Link>
                <Icon name="angle-right" variant="subtle" />
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Link href="#">Second</Link>
                <Icon name="angle-right" variant="subtle" />
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Box color="text-status-inactive" fontWeight="bold">
                  Third
                </Box>
              </Breadcrumbs.ListItem>
            </Breadcrumbs.List>
          </Breadcrumbs.Group>
        </Container>

        {/* 2nd example */}
        <Container>
          <BreadcrumbGroup
            items={[
              { text: 'First', href: `#` },
              { text: 'Second', href: `#` },
              { text: 'Third', href: `#` },
            ]}
          />
        </Container>

        {/* 3rd example */}
        <Container>
          <Breadcrumbs.Group>
            <Breadcrumbs.List>
              <Breadcrumbs.ListItem>
                <Link href="#">Products</Link>
                <Box color="text-status-inactive" fontSize="heading-m">
                  /
                </Box>
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Link href="#">Analytics</Link>
                <Box color="text-status-inactive" fontSize="heading-m">
                  /
                </Box>
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Link href="#">Amazon Athena</Link>
                <Box color="text-status-inactive" fontSize="heading-m">
                  /
                </Box>
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Box color="text-status-inactive" fontWeight="bold">
                  Amazon Athena Features
                </Box>
              </Breadcrumbs.ListItem>
            </Breadcrumbs.List>
          </Breadcrumbs.Group>
        </Container>

        {/* 4th example */}
        <Container>
          <BreadcrumbGroup
            separator={
              <Box color="text-status-inactive" fontSize="heading-m">
                /
              </Box>
            }
            items={[
              { text: 'Products', href: `#` },
              { text: 'Analytics', href: `#` },
              { text: 'Amazon Athena', href: `#` },
              { text: 'Amazon Athena Features', href: `#` },
            ]}
          />
        </Container>

        {/* 5th example */}
        <Container>
          <Breadcrumbs.Group>
            <Breadcrumbs.List>
              <Breadcrumbs.ListItem>
                <Icon name="folder" variant="subtle" />
                <Link href="#">components</Link>
                <Box color="text-status-inactive" fontSize="heading-m">
                  /
                </Box>
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Icon name="folder" variant="subtle" />
                <Link href="#">src</Link>
                <Box color="text-status-inactive" fontSize="heading-m">
                  /
                </Box>
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Icon name="folder" variant="subtle" />
                <Link href="#">app-layout</Link>
                <Box color="text-status-inactive" fontSize="heading-m">
                  /
                </Box>
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Icon name="folder" variant="subtle" />
                <Link href="#">visual-refresh</Link>
                <Box color="text-status-inactive" fontSize="heading-m">
                  /
                </Box>
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Icon name="file" variant="subtle" />
                <Box color="text-status-inactive" fontWeight="bold">
                  index.tsx
                </Box>
              </Breadcrumbs.ListItem>
            </Breadcrumbs.List>
          </Breadcrumbs.Group>
        </Container>

        {/* 6th example */}
        <Container>
          <Breadcrumbs.Group>
            <Breadcrumbs.List>
              <Breadcrumbs.ListItem>
                <Link href="#">
                  <Icon svg={homeSVG} variant="link" />
                </Link>
                <Box color="text-status-inactive" fontSize="heading-m">
                  /
                </Box>
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Box color="text-body-secondary" fontWeight="bold">
                  <Popover
                    fixedWidth={true}
                    header="Code definitions"
                    position="bottom"
                    size="medium"
                    triggerType="custom"
                    content={popoverContent}
                  >
                    <Button variant="inline-link">
                      <Box color="inherit" fontSize="heading-m" fontWeight="normal">
                        ...
                      </Box>
                    </Button>
                  </Popover>
                </Box>
                <Box color="text-status-inactive" fontSize="heading-m">
                  /
                </Box>
              </Breadcrumbs.ListItem>

              <Breadcrumbs.ListItem>
                <Box color="text-status-inactive" fontWeight="bold">
                  Amazon Athena Features
                </Box>
              </Breadcrumbs.ListItem>
            </Breadcrumbs.List>
          </Breadcrumbs.Group>
        </Container>
      </SpaceBetween>
    </ScreenshotArea>
  );
}

const homeSVG = (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
    <path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 14 L 14 14 L 14 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z"></path>
  </svg>
);

const popoverContent = (
  <Grid
    disableGutters={true}
    gridDefinition={[
      { colspan: 9 },
      { colspan: 3 },
      { colspan: 9 },
      { colspan: 3 },
      { colspan: 9 },
      { colspan: 3 },
      { colspan: 9 },
      { colspan: 3 },
      { colspan: 9 },
      { colspan: 3 },
      { colspan: 9 },
      { colspan: 3 },
    ]}
  >
    <Link href="#">handleNavigationChange</Link>
    <Box variant="awsui-key-label">Function</Box>
    <Link href="#">handleToolsChange</Link>
    <Box variant="awsui-key-label">Function</Box>
    <Link href="#">handleBodyScroll</Link>
    <Box variant="awsui-key-label">Function</Box>
    <Link href="#">openTools</Link>
    <Box variant="awsui-key-label">Function</Box>
    <Link href="#">handleSplitPanelChange</Link>
    <Box variant="awsui-key-label">Function</Box>
    <Link href="#">handleMainOffsetLeft</Link>
    <Box variant="awsui-key-label">Function</Box>
  </Grid>
);
