// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { FormField, Input, Multiselect, SpaceBetween, Toggle } from '~components';
import { MultiselectProps } from '~components/multiselect';

import { SimplePage } from '../app/templates';

const SUBNETS = [
  { label: 'subnet-a', value: 'subnet-a', description: 'us-east-1a' },
  { label: 'subnet-b', value: 'subnet-b', description: 'us-east-1b' },
  { label: 'subnet-c', value: 'subnet-c', description: 'us-east-1c' },
];

export default function FieldRegistryFrameForm() {
  const [subnets, setSubnets] = useState<ReadonlyArray<MultiselectProps.Option>>([]);
  const [securityGroup, setSecurityGroup] = useState('');
  const [flowLogs, setFlowLogs] = useState(false);

  return (
    <SimplePage title="Network settings">
      <SpaceBetween size="l">
        <FormField label="Subnets" data-testid="subnets">
          <Multiselect
            selectedOptions={subnets}
            options={SUBNETS}
            placeholder="Choose subnets"
            onChange={({ detail }) => setSubnets(detail.selectedOptions)}
          />
        </FormField>
        <FormField label="Security group" data-testid="security-group">
          <Input value={securityGroup} onChange={({ detail }) => setSecurityGroup(detail.value)} />
        </FormField>
        <Toggle data-testid="flow-logs" checked={flowLogs} onChange={({ detail }) => setFlowLogs(detail.checked)}>
          Enable flow logs
        </Toggle>
      </SpaceBetween>
    </SimplePage>
  );
}
