// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactElement } from 'react';

import Box from '~components/box';
import Container from '~components/container';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';

interface SectionProps {
  header?: string;
  description?: string;
  level?: 'h2' | 'h3';
  container?: boolean;
  children: ReactElement;
}

export const Section = ({ header, description, level = 'h2', container = true, children }: SectionProps) => {
  const content = <SpaceBetween size={'m'}>{children}</SpaceBetween>;
  return (
    <SpaceBetween size={'s'}>
      {header && (
        <Header variant={level} description={description}>
          {header}
        </Header>
      )}
      {container ? <Container>{content}</Container> : content}
    </SpaceBetween>
  );
};

export const SubSection = ({ header, level = 'h3', children }: SectionProps) => {
  return (
    <SpaceBetween size={'s'}>
      {header && <Box variant={level}>{header}</Box>}
      <SpaceBetween size={'s'}>{children}</SpaceBetween>
    </SpaceBetween>
  );
};
