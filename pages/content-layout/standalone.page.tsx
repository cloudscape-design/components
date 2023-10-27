// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Button } from '~components';
import Alert from '~components/alert';
import ContentLayout from '~components/content-layout';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import { Containers } from '../app-layout/utils/content-blocks';
import ScreenshotArea from '../utils/screenshot-area';

import backgroundHeaderDark from '../header/header-dark.png';
import backgroundHeaderLight from '../header/header-light.png';

export default function () {
  const [alertVisible, setVisible] = useState(true);

  return (
    <main>
      <ScreenshotArea gutters={false}>
        <ContentLayout
          headerBackgroundImage={backgroundHeaderDark}
          header={
            <Header
              variant="awsui-h1-page"
              info={<Link>Info</Link>}
              description="When you create a new distribution."
              actions={<Button variant="primary">Create distribution</Button>}
            >
              Create distribution
            </Header>
          }
        >
          <div style={{ padding: '0 40px 20px' }}>
            <Containers />
            <img src={backgroundHeaderDark} />
            <img src={backgroundHeaderLight} />
          </div>
        </ContentLayout>
      </ScreenshotArea>
    </main>
  );
}
