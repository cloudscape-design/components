// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { FormField, Input, Select, SpaceBetween, Toggle } from '~components';
import { SelectProps } from '~components/select';

import { SimplePage } from '../app/templates';

const SUBNETS = [
  { label: 'subnet-a', value: 'subnet-a' },
  { label: 'subnet-b', value: 'subnet-b' },
];

export default function FieldRegistryFrameForm() {
  const [subnet, setSubnet] = useState<SelectProps.Option | null>(null);
  const [securityGroup, setSecurityGroup] = useState('');
  const [flowLogs, setFlowLogs] = useState(false);

  return (
    <SimplePage title="Network settings">
      <SpaceBetween size="l">
        <FormField label="Subnet" data-testid="subnet">
          <Select
            selectedOption={subnet}
            options={SUBNETS}
            onChange={({ detail }) => setSubnet(detail.selectedOption)}
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
