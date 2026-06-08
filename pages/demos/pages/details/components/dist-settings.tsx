// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';

import { InfoLink } from '../../commons';
import { SettingsDetails } from './settings-details';

export const DistSettings = ({
  loadHelpPanelContent,
  isInProgress,
}: {
  isInProgress: boolean;
  loadHelpPanelContent: (value: number) => void;
}) => (
  <Container
    header={
      <Header variant="h2" info={<InfoLink onFollow={() => loadHelpPanelContent(0)} />}>
        Distribution settings
      </Header>
    }
  >
    <SettingsDetails isInProgress={isInProgress} />
  </Container>
);
