// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button, Container, Header, KeyValuePairs, SpaceBetween } from '~components';

function UnifiedSettings() {
  return (
    <SpaceBetween size="xl">
      <Container
        header={
          <Header
            actions={<Button>Edit</Button>}
            description="Choose the language and locale settings in the AWS Console, and control which region is active when you sign in."
          >
            Localization and default region
          </Header>
        }
      >
        <KeyValuePairs
          columns={2}
          items={[
            {
              label: 'Language',
              value: 'English (US)',
            },
            { label: 'Default region', value: 'Last used region' },
          ]}
        />
      </Container>
      <Container
        header={
          <Header actions={<Button>Edit</Button>} description="Customize the appearanec of AWS console elements.">
            Display
          </Header>
        }
      >
        <KeyValuePairs
          columns={3}
          items={[
            {
              label: 'Visual mode',
              value: 'Light',
            },
            { label: 'Favorites bar display', value: 'Service icons only' },
            { label: 'Favorites bar icon size', value: 'Large' },
          ]}
        />
      </Container>
      <Container
        header={
          <Header actions={<Button>Edit</Button>} description="Decide if the AWS Console remembers your activity.">
            Settings management
          </Header>
        }
      >
        <KeyValuePairs
          columns={3}
          items={[
            {
              label: 'Remember recently visited services',
              value: 'Yes',
            },
          ]}
        />
      </Container>
      <Container
        header={
          <Header
            actions={<Button href="#/light/keyboard-shortcut-hackathon/shortcut-page">Edit</Button>}
            description="Configure keyboard shortcuts for common actions."
          >
            Keyboard shortcuts
          </Header>
        }
      >
        <KeyValuePairs
          columns={3}
          items={[
            {
              label: 'Keyboard shortcuts',
              value: 'Enabled',
            },
          ]}
        />
      </Container>
    </SpaceBetween>
  );
}

export default UnifiedSettings;
