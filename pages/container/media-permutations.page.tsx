// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Container from '~components/container';
import Header from '~components/header';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import ScreenshotArea from '../utils/screenshot-area';
// import { ContainerProps } from '~components/container';
// import image169 from './images/16-9.png';
// import image43 from './images/4-3.png';
// import image916 from './images/9-16.png';

function ContainerHeader({ title, description }: { title?: string; description?: React.ReactNode }) {
  return (
    <Header variant="h2" headingTagOverride="h1" description={description}>
      <Link fontSize="heading-m" href="" variant="primary">
        {title}
      </Link>
    </Header>
  );
}

export default function MediaContainers() {
  return (
    <article>
      <h1>Media containers</h1>
      <ScreenshotArea>
        <SpaceBetween size="l">
          <Container
            header={<ContainerHeader title="This is a container title. Lorem ipsum dolor sit amet, consectetur." />}
          ></Container>
        </SpaceBetween>
      </ScreenshotArea>
    </article>
  );
}
