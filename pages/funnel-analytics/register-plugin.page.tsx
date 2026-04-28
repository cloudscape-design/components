// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Button, Container, Form, FormField, Header, Input, SpaceBetween } from '~components';
import { definePlugin } from '~components/internal/plugin-slots';
import awsuiPlugins from '~components/internal/plugins';

// Only define the methods you care about — the rest fall back to no-op stubs.
awsuiPlugins.registerPlugin(
  'analytics-funnel',
  definePlugin('analytics-funnel', {
    funnelStart(props) {
      const id = `funnel-${Date.now()}`;
      console.log(`[plugin] funnelStart: "${props.funnelName}" → ${id}`);
      return id;
    },
    funnelComplete(props) {
      console.log('[plugin] funnelComplete', props.funnelInteractionId);
    },
    funnelCancelled(props) {
      console.log('[plugin] funnelCancelled', props.funnelInteractionId);
    },
  })
);

export default function RegisterPluginDemo() {
  const [name, setName] = useState('');

  return (
    <Form
      header={<Header variant="h1">registerPlugin demo</Header>}
      actions={<Button variant="primary">Submit</Button>}
    >
      <Container header={<Header variant="h2">Details</Header>}>
        <SpaceBetween size="l">
          <FormField label="Name">
            <Input value={name} onChange={e => setName(e.detail.value)} />
          </FormField>
        </SpaceBetween>
      </Container>
    </Form>
  );
}
