// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ActionCard, Icon, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

export default function ActionCardStyleCustomPage() {
  return (
    <SimplePage title="Custom Action Card styles" screenshotArea={{}}>
      <SpaceBetween size="m" direction="horizontal">
        <ActionCard
          header="Custom border and shadow"
          description="Green border, red shadow"
          style={{
            root: {
              background: {
                default: 'light-dark(#fcfcfc, #1a1a1a)',
                hover: 'light-dark(#f0fff0, #1a2e1a)',
                active: 'light-dark(#e0ffe0, #0f1f0f)',
                disabled: 'light-dark(#fafafa, #2a2a2a)',
              },
              borderColor: { default: 'green', hover: 'darkgreen', active: 'green', disabled: '#ccc' },
              borderRadius: { default: '8px', hover: '8px', active: '8px', disabled: '8px' },
              borderWidth: { default: '2px', hover: '3px', active: '3px', disabled: '1px' },
              boxShadow: {
                default: '0px 4px 8px red',
                hover: '0px 6px 12px red',
                active: '0px 2px 4px red',
                disabled: 'none',
              },
            },
          }}
        >
          Content area
        </ActionCard>

        <ActionCard
          header="Custom focus ring"
          description="Orange focus ring with large radius"
          style={{
            root: {
              borderColor: { default: 'magenta' },
              borderWidth: { default: '1px' },
              focusRing: { borderColor: 'orange', borderRadius: '16px', borderWidth: '4px' },
            },
          }}
        >
          Content area
        </ActionCard>

        <ActionCard
          header="Custom padding"
          description="Large header and content padding"
          style={{
            root: { borderColor: { default: '#000' }, borderWidth: { default: '1px' } },
            header: { paddingBlock: '24px', paddingInline: '40px' },
            content: { paddingBlock: '24px', paddingInline: '40px' },
          }}
        >
          Content area
        </ActionCard>

        <ActionCard
          header="Zero padding"
          description="No padding on header or content"
          style={{
            root: { borderColor: { default: 'blue' }, borderWidth: { default: '2px' } },
            header: { paddingBlock: '0px', paddingInline: '0px' },
            content: { paddingBlock: '0px', paddingInline: '0px' },
          }}
        >
          Content area
        </ActionCard>

        <ActionCard
          variant="embedded"
          header="Embedded variant"
          description="Custom border radius"
          style={{
            root: {
              borderColor: { default: 'purple', hover: 'rebeccapurple' },
              borderRadius: { default: '0px' },
              borderWidth: { default: '2px' },
            },
          }}
        >
          Content area
        </ActionCard>

        <ActionCard
          header="Disabled state"
          description="Custom disabled colors"
          disabled={true}
          style={{
            root: {
              background: { default: 'light-dark(#fff, #1a1a1a)', disabled: 'light-dark(#fff5f5, #2a1a1a)' },
              borderColor: { default: 'green', disabled: '#fbb' },
              borderWidth: { default: '2px', disabled: '2px' },
              boxShadow: { disabled: 'light-dark(0px 2px 4px #ffd0d0, 0px 2px 4px #3a0000)' },
            },
          }}
        >
          Content area
        </ActionCard>

        <ActionCard
          header="With icon"
          icon={<Icon name="arrow-right" />}
          iconVerticalAlignment="top"
          style={{
            root: {
              background: { default: 'light-dark(#f0f4ff, #1a1f3a)', hover: 'light-dark(#e0eaff, #252b4a)' },
              borderColor: { default: '#4a6cf7', hover: '#3a5ce7' },
              borderWidth: { default: '1px', hover: '2px' },
              borderRadius: { default: '12px' },
            },
            header: { paddingBlock: '16px', paddingInline: '16px' },
            content: { paddingBlock: '8px', paddingInline: '16px' },
          }}
        >
          Content area
        </ActionCard>
      </SpaceBetween>
    </SimplePage>
  );
}
