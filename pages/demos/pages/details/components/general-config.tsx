// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import StatusIndicator from '@cloudscape-design/components/status-indicator';

export const GeneralConfig = () => (
  <Container header={<Header variant="h2">General configuration</Header>}>
    <KeyValuePairs
      columns={4}
      items={[
        {
          label: 'Engine',
          value: 'Oracle Enterprise Edition 12.1.0.2.v7',
        },
        {
          label: 'DB instance class',
          value: 'db.t2.large',
        },
        {
          label: 'DB instance status',
          value: <StatusIndicator type="success">Available</StatusIndicator>,
        },
        {
          label: 'Pending maintenance',
          value: 'None',
        },
      ]}
    />
  </Container>
);
