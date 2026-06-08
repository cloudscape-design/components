// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';
import { ReactElement } from 'react';

import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';

interface SectionProps {
  header?: string;
  level?: 'h2' | 'h3';
  container?: boolean;
  children: ReactElement;
}

export const Section = ({ header, level = 'h2', container = true, children }: SectionProps) => {
  const content = <SpaceBetween size={'m'}>{children}</SpaceBetween>;
  return (
    <SpaceBetween size={'s'}>
      {header && <Header variant={level}>{header}</Header>}
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
