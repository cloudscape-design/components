// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box, { BoxProps } from '~components/box';
import ButtonDropdown from '~components/button-dropdown';
import CopyToClipboard from '~components/copy-to-clipboard';
import Icon from '~components/icon';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import List from '~components/list';
import ProgressBar from '~components/progress-bar';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

// ─── Data ──────────────────────────────────────────────────────────────────────

const ALL_VARIANTS: BoxProps.AccentColor[] = [
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

const BOX_VARIANTS: { variant: BoxProps['variant']; label: string; content: string }[] = [
  { variant: 'h4', label: 'h4', content: 'Heading 4' },
  { variant: 'p', label: 'p', content: 'Body paragraph text' },
];

const LIST_ITEMS: { id: string; content: string; icon: string; color: BoxProps.AccentColor }[] = [
  { id: 'health', content: 'Health overview', icon: 'face-happy', color: 'green' },
  { id: 'functions', content: 'Functions', icon: 'script', color: 'indigo' },
  { id: 'network', content: 'Network configuration', icon: 'globe', color: 'grey' },
  { id: 'multi-session', content: 'Multi-session data', icon: 'multiscreen', color: 'purple' },
  { id: 'alert', content: 'Alert center', icon: 'security', color: 'red' },
  { id: 'communication', content: 'Communication', icon: 'contact', color: 'mint' },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function StyleBoxPage() {
  return (
    <article>
      <Box variant="h1" padding={{ bottom: 'l' }}>
        Box variant=&quot;awsui-accent&quot; — Direction 4
      </Box>

      <Box variant="p" color="text-body-secondary" padding={{ bottom: 'xl' }}>
        Uses the existing Box component with a new <code>awsui-accent</code> variant and <code>accentColor</code> prop.
        No wrapper component or utility classes needed.
      </Box>

      {/* ── Box text variants × accent colors ─────────────────────────── */}
      <Box variant="h2" padding={{ top: 'l', bottom: 'm' }}>
        Text inside accent boxes
      </Box>

      {BOX_VARIANTS.map(({ variant, label, content }) => (
        <section key={label}>
          <Box variant="h3" padding={{ top: 'l', bottom: 's' }}>
            Wrapping Box variant=&quot;{label}&quot;
          </Box>
          <SpaceBetween size="m" direction="horizontal">
            {ALL_VARIANTS.map(color => (
              <Box
                key={color}
                variant="awsui-accent"
                accentColor={color}
                padding={{ horizontal: 'xxxs', vertical: 'n' }}
              >
                <Box variant={variant} color="inherit">
                  {content}
                </Box>
              </Box>
            ))}
          </SpaceBetween>
        </section>
      ))}

      {/* ── Icons in accent boxes ─────────────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'xxxl', bottom: 'm' }}>
        Icons in accent boxes
      </Box>
      <SpaceBetween size="m" direction="horizontal">
        {ALL_VARIANTS.map(color => (
          <Box key={color} variant="awsui-accent" accentColor={color} accentShape="circle">
            <Icon name="check" size="medium" />
          </Box>
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
            value: (
              <Box variant="awsui-accent" accentColor="indigo">
                <Box variant="p" color="inherit">
                  E1WG1ZNPRXT0D4
                </Box>
              </Box>
            ),
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
            value: (
              <Box variant="awsui-accent" accentColor="green">
                <Box variant="p" color="inherit">
                  Use only US, Canada, Europe
                </Box>
              </Box>
            ),
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
        ariaLabel="List with accent icon badges"
        items={LIST_ITEMS}
        renderItem={item => ({
          id: item.id,
          content: item.content,
          icon: (
            <Box variant="awsui-accent" accentColor={item.color}>
              <Icon name={item.icon as any} size="medium" />
            </Box>
          ),
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
