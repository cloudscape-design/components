// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import ButtonDropdown from '~components/button-dropdown';
import CopyToClipboard from '~components/copy-to-clipboard';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import List from '~components/list';
import ProgressBar from '~components/progress-bar';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import VisualAccent, { VisualAccentProps } from '~components/visual-accent';

// ─── Data ──────────────────────────────────────────────────────────────────────

const ALL_COLORS: VisualAccentProps.Color[] = [
  'red',
  'yellow',
  'indigo',
  'green',
  'orange',
  'purple',
  'mint',
  'lime',
  'grey',
];

const LIST_ITEMS: { id: string; content: string; icon: string; color: VisualAccentProps.Color }[] = [
  { id: 'health', content: 'Health overview', icon: 'face-happy', color: 'green' },
  { id: 'functions', content: 'Functions', icon: 'script', color: 'indigo' },
  { id: 'network', content: 'Network configuration', icon: 'globe', color: 'grey' },
  { id: 'multi-session', content: 'Multi-session data', icon: 'multiscreen', color: 'purple' },
  { id: 'alert', content: 'Alert center', icon: 'security', color: 'red' },
  { id: 'communication', content: 'Communication', icon: 'contact', color: 'mint' },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function VisualAccentPage() {
  return (
    <article>
      <Box variant="h1" padding={{ bottom: 'l' }}>
        VisualAccent component — Direction 5
      </Box>

      <Box variant="p" color="text-body-secondary" padding={{ bottom: 'xl' }}>
        A standalone component with <code>content</code>, <code>iconName</code>, <code>color</code>, and{' '}
        <code>shape</code> props. No visual context, no wrapper pattern.
      </Box>

      {/* ── Text with sharp shape ─────────────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'l', bottom: 'm' }}>
        Text content (shape=&quot;sharp&quot;)
      </Box>

      <Box variant="h3" padding={{ bottom: 's' }}>
        fontSize=&quot;heading-m&quot;
      </Box>
      <SpaceBetween size="m" direction="horizontal">
        {ALL_COLORS.map(color => (
          <VisualAccent key={color} color={color} content="Heading 3" fontSize="heading-m" fontWeight="bold" />
        ))}
      </SpaceBetween>

      <Box variant="h3" padding={{ top: 'l', bottom: 's' }}>
        fontSize=&quot;heading-s&quot;
      </Box>
      <SpaceBetween size="m" direction="horizontal">
        {ALL_COLORS.map(color => (
          <VisualAccent key={color} color={color} content="Heading 4" fontSize="heading-s" fontWeight="bold" />
        ))}
      </SpaceBetween>

      <Box variant="h3" padding={{ top: 'l', bottom: 's' }}>
        fontSize=&quot;body-m&quot;
      </Box>
      <SpaceBetween size="m" direction="horizontal">
        {ALL_COLORS.map(color => (
          <VisualAccent key={color} color={color} content="Body paragraph text" />
        ))}
      </SpaceBetween>

      {/* ── Icons with circle shape ───────────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'xxxl', bottom: 'm' }}>
        Icons (shape=&quot;circle&quot;)
      </Box>
      <SpaceBetween size="m" direction="horizontal">
        {ALL_COLORS.map(color => (
          <VisualAccent key={color} color={color} iconName="check" iconSize="medium" shape="circle" />
        ))}
      </SpaceBetween>

      {/* ── Application in components ──────────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'xxxl', bottom: 'm' }}>
        Application in components
      </Box>

      <Box variant="h3" padding={{ bottom: 's' }}>
        KeyValuePairs
      </Box>
      <KeyValuePairs
        columns={3}
        items={[
          {
            label: 'Distribution ID',
            value: <VisualAccent color="indigo" content="E1WG1ZNPRXT0D4" />,
            info: (
              <Link variant="info" href="#">
                Info
              </Link>
            ),
          },
          {
            label: 'ARN',
            value: (
              <CopyToClipboard
                copyButtonAriaLabel="Copy ARN"
                copyErrorText="ARN failed to copy"
                copySuccessText="ARN copied"
                textToCopy="arn:service23G24::111122223333:distribution/23E1WG1ZNPRXT0D4"
                variant="inline"
              />
            ),
          },
          {
            label: 'Status',
            value: <StatusIndicator>Available</StatusIndicator>,
          },
          {
            label: 'SSL Certificate',
            id: 'ssl-certificate-id',
            value: (
              <ProgressBar
                value={30}
                additionalInfo="Additional information"
                description="Progress bar description"
                ariaLabelledby="ssl-certificate-id"
              />
            ),
          },
          {
            label: 'Price class',
            value: <VisualAccent color="green" content="Use only US, Canada, Europe" />,
          },
          {
            label: 'CNAMEs',
            value: (
              <Link external={true} href="#">
                abc.service23G24.xyz
              </Link>
            ),
          },
        ]}
      />

      <Box variant="h3" padding={{ top: 'xl', bottom: 's' }}>
        List
      </Box>
      <List
        ariaLabel="List with visual accent icon badges"
        items={LIST_ITEMS}
        renderItem={item => ({
          id: item.id,
          content: item.content,
          icon: <VisualAccent color={item.color} iconName={item.icon as any} iconSize="medium" shape="circle" />,
          actions: (
            <ButtonDropdown
              items={[
                { id: '1', text: 'Action one' },
                { id: '2', text: 'Action two' },
                { id: '3', text: 'Action three' },
              ]}
              variant="icon"
              ariaLabel={`Actions for ${item.content}`}
            />
          ),
        })}
      />
    </article>
  );
}
