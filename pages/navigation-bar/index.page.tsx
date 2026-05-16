// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import { SimplePage } from '../app/templates';

export default function NavigationBarIndexPage() {
  return (
    <SimplePage title="NavigationBar">
      <SpaceBetween size="l">
        <section>
          <Box variant="h2">Variants & Placements</Box>
          <SpaceBetween size="xs">
            <Link href="#/navigation-bar/simple">Simple (all variants)</Link>
            <Link href="#/navigation-bar/primary">Primary (placement selector)</Link>
            <Link href="#/navigation-bar/secondary">Secondary (placement selector)</Link>
            <Link href="#/navigation-bar/mode">Primary-accent (dark/branded)</Link>
            <Link href="#/navigation-bar/roles">Roles (navigation, banner, region)</Link>
          </SpaceBetween>
        </section>

        <section>
          <Box variant="h2">Compositions</Box>
          <SpaceBetween size="xs">
            <Link href="#/navigation-bar/compositions/horizontal">Horizontal: primary top + secondary</Link>
            <Link href="#/navigation-bar/compositions/vertical">Vertical: primary start + secondary</Link>
            <Link href="#/navigation-bar/compositions/horizontal-primary">
              Horizontal primary (complex — add/remove bars)
            </Link>
            <Link href="#/navigation-bar/compositions/vertical-primary">
              Vertical primary (complex — add/remove bars)
            </Link>
            <Link href="#/navigation-bar/compositions/with-drawer">Navigation bar with drawer</Link>
          </SpaceBetween>
        </section>

        <section>
          <Box variant="h2">Use cases</Box>
          <SpaceBetween size="xs">
            <Link href="#/navigation-bar/top-navigation-replica">TopNavigation replica</Link>
            <Link href="#/navigation-bar/vertical-nav-with-labels">Expandable vertical sidebar</Link>
          </SpaceBetween>
        </section>
      </SpaceBetween>
    </SimplePage>
  );
}
