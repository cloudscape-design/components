// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { ReactElement } from 'react';

import { AppLayout, Container, ContentLayout, Header, SpaceBetween, TextContent } from '~components';

export interface PageLayoutProps<T> {
  title: string;
  render: (props: T) => ReactElement;
  permutations: T[];
}

export default function PageLayout<T>({ title, render, permutations }: PageLayoutProps<T>) {
  return (
    <AppLayout
      content={
        <ContentLayout header={<Header variant="h1">{title}</Header>}>
          <SpaceBetween size="l">
            {permutations.map((perm, idx) => (
              <Container
                key={idx}
                header={<Header variant="h2">Lorem ipsum</Header>}
                footer={<TextContent>{JSON.stringify(perm)}</TextContent>}
              >
                {render(perm)}
              </Container>
            ))}
          </SpaceBetween>
        </ContentLayout>
      }
    />
  );
}
