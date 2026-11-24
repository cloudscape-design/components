// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

import { Breadcrumbs, Containers, Tools } from './content-blocks';
import labels from './labels';
import * as toolsContent from './tools-content';

// The secondary AppLayout of runtime-drawers-mixed-react.page.tsx. It is bundled with React 19 into the child frame.
export default function MixedReactSecondaryLayout() {
  return (
    <AppLayout
      data-testid="secondary-layout"
      ariaLabels={{
        ...labels,
        drawers: 'Drawers',
        drawersOverflow: 'Drawers overflow',
        drawersOverflowWithBadge: 'Drawers overflow with badge',
      }}
      breadcrumbs={<Breadcrumbs />}
      navigationHide={true}
      content={
        <SpaceBetween size="s">
          <Header variant="h1" description={`This AppLayout runs on React ${React.version}`}>
            Secondary layout
          </Header>
          <Containers />
        </SpaceBetween>
      }
      tools={<Tools>{toolsContent.long}</Tools>}
    />
  );
}
