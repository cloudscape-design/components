// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Box, Container, Header } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2ContainerPage() {
  return (
    <SimplePage title="Container with Style API v2" screenshotArea={{}}>
      <Container
        className={styles['container-outer']}
        header={<Header variant="h2">Outer container</Header>}
        footer="Outer container footer"
      >
        <Box margin={{ bottom: 's' }}>
          Content in the outer container with 16px rounded corners and blue header background.
        </Box>
        <Container className={styles['container-inner']} header={<Header variant="h3">Inner container</Header>}>
          Content in the inner container with 12px rounded corners and green header background.
        </Container>
      </Container>
    </SimplePage>
  );
}
