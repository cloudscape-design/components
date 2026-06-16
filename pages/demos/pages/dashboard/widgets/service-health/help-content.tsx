// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import HelpPanel from '@cloudscape-design/components/help-panel';

import { ExternalLinkGroup } from '../../../commons';

export function ServiceHealthInfo() {
  return (
    <HelpPanel
      header={<h2>Service health</h2>}
      footer={
        <ExternalLinkGroup
          items={[
            { href: '#', text: 'Service health dashboard' },
            { href: '#', text: 'Personal health dashboard' },
          ]}
        />
      }
    >
      <p>Amazon Web Services publishes our most up-to-the-minute information on service availability</p>
    </HelpPanel>
  );
}
