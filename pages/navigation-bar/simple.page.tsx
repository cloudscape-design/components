// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box } from '~components';
import BreadcrumbGroup from '~components/breadcrumb-group';
import Link from '~components/link';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

export default function NavigationBarSimplePage() {
  return (
    <article>
      <h1>Simple Navigation Bar</h1>
      <ScreenshotArea gutters={false}>
        <SpaceBetween size="l">
          <Box>
            <h2>Primary with search and utilities</h2>
            <NavigationBar
              ariaLabel="Main navigation"
              content={
                <Link href="#" fontSize="heading-m" color="inverted">
                  Service Name
                </Link>
              }
            />
          </Box>

          <Box>
            <h2>Secondary toolbar with breadcrumbs</h2>
            <NavigationBar
              variant="secondary"
              ariaLabel="Page toolbar"
              content={
                <BreadcrumbGroup
                  items={[
                    { text: 'Home', href: '#' },
                    { text: 'Projects', href: '#' },
                    { text: 'Project Alpha', href: '#' },
                  ]}
                />
              }
            />
          </Box>

          <Box>
            <h2>Primary — start and end only</h2>
            <NavigationBar
              ariaLabel="Minimal navigation"
              content={
                <Link href="#" fontSize="heading-m" color="inverted">
                  Dashboard
                </Link>
              }
            />
          </Box>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
