// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';

import { InfoLink } from '../../commons';
import { SettingsDetails } from '../../details/components/settings-details';

export const Details = ({ loadHelpPanelContent }: { loadHelpPanelContent: (value: number) => void }) => (
  <Container
    header={
      <Header variant="h2" info={<InfoLink onFollow={() => loadHelpPanelContent(1)} />} actions={<Button>Edit</Button>}>
        Details
      </Header>
    }
  >
    <SettingsDetails isInProgress={true} />
  </Container>
);
