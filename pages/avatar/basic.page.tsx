// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Avatar from '~components/avatar';
import { Toggle, SpaceBetween } from '~components';

export default function AvatarsPage() {
  const [loading, setLoading] = useState(false);
  const [initials, setInitials] = useState(false);

  return (
    <div style={{ padding: '30px' }}>
      <h1>Avatar demo</h1>

      <SpaceBetween size="m">
        <Avatar
          color="default"
          loading={loading}
          initials={initials ? 'TF' : undefined}
          ariaLabel="User avatar Timothee Fontaka"
          tooltipText="Timothee Fontaka"
        />
        <Avatar
          color="gen-ai"
          iconName="gen-ai"
          loading={loading}
          initials={initials ? 'AI' : undefined}
          ariaLabel="Avatar Gen AI assistant"
          tooltipText="Gen AI assistant"
        />

        <Toggle checked={loading} onChange={({ detail }) => setLoading(detail.checked)}>
          Loading
        </Toggle>

        <Toggle checked={initials} onChange={({ detail }) => setInitials(detail.checked)}>
          Initials
        </Toggle>
      </SpaceBetween>
    </div>
  );
}
