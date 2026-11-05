// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, ColumnLayout, Container, ContainerProps, Header } from '~components';

import { SimplePage } from '../app/templates';
import image169 from './images/16-9.png';

import styles from './style-api-v2.scss';

function StyledContainer(props: ContainerProps) {
  return (
    <Container
      {...props}
      {...{ styleClassNames: { root: styles.container, header: styles.header, footer: styles.footer } }}
    />
  );
}

function Permutation({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Box variant="awsui-key-label" margin={{ bottom: 'xs' }}>
        {label}
      </Box>
      {children}
    </div>
  );
}

export default function () {
  return (
    <SimplePage title="Container - Style API v2" screenshotArea={{}} i18n={{}}>
      <ColumnLayout columns={2}>
        <Permutation label="Header, content and footer">
          <StyledContainer header={<Header variant="h2">Header</Header>} footer="Footer">
            Content
          </StyledContainer>
        </Permutation>
        <Permutation label="Media on top">
          <StyledContainer
            header={<Header variant="h2">Header</Header>}
            media={{ content: <img src={image169} alt="" />, position: 'top', height: 120 }}
          >
            Content
          </StyledContainer>
        </Permutation>
        <Permutation label="Stacked">
          <StyledContainer variant="stacked" header={<Header variant="h2">First</Header>} footer="First footer">
            Content
          </StyledContainer>
          <StyledContainer variant="stacked" header={<Header variant="h2">Second</Header>} footer="Second footer">
            Content
          </StyledContainer>
        </Permutation>
        <Permutation label="Header only">
          <StyledContainer header={<Header variant="h2">Header</Header>}>Content</StyledContainer>
        </Permutation>
        <Permutation label="Footer only">
          <StyledContainer footer="Footer">Content</StyledContainer>
        </Permutation>
        <Permutation label="Header without paddings">
          <StyledContainer
            disableHeaderPaddings={true}
            header={
              <Box padding={{ vertical: 's', horizontal: 'l' }} fontWeight="bold">
                Header filled by its own element
              </Box>
            }
          >
            Content
          </StyledContainer>
        </Permutation>
      </ColumnLayout>
    </SimplePage>
  );
}
