// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Steps, { StepsProps } from '~components/steps';

import { SimplePage } from '../app/templates';

const sampleSteps: ReadonlyArray<StepsProps.Step> = [
  { header: 'Validate configuration', status: 'success', statusIconAriaLabel: 'success' },
  { header: 'Deploy infrastructure', status: 'success', statusIconAriaLabel: 'success' },
  { header: 'Run integration tests', status: 'in-progress', statusIconAriaLabel: 'in-progress' },
  { header: 'Promote to production', status: 'pending', statusIconAriaLabel: 'pending' },
];

export default function StepsStyleApiPage() {
  return (
    <SimplePage title="Steps — Style API (connector color)">
      <h2>Default connector color</h2>
      <Steps steps={sampleSteps} ariaLabel="Default connector" />

      <h2>Custom connector color — red</h2>
      <Steps steps={sampleSteps} ariaLabel="Red connector" style={{ connector: { color: '#d91515' } }} />

      <h2>Custom connector color — green</h2>
      <Steps steps={sampleSteps} ariaLabel="Green connector" style={{ connector: { color: '#1d8102' } }} />

      <h2>Custom connector color — transparent (hidden via style API)</h2>
      <Steps steps={sampleSteps} ariaLabel="Transparent connector" style={{ connector: { color: 'transparent' } }} />

      <h2>Horizontal — custom connector color</h2>
      <Steps
        steps={sampleSteps}
        orientation="horizontal"
        ariaLabel="Horizontal custom connector"
        style={{ connector: { color: '#0073bb' } }}
      />

      <h2>connectorLines=none (existing prop, no style override)</h2>
      <Steps steps={sampleSteps} ariaLabel="Hidden connectors" connectorLines="none" />
    </SimplePage>
  );
}
