// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box, { BoxProps } from '~components/box';
import ButtonDropdown from '~components/button-dropdown';
import CopyToClipboard from '~components/copy-to-clipboard';
import Icon from '~components/icon';
import {
  ColorContextProvider,
  ColorContextVariant,
  useColorContext,
} from '~components/internal/components/color-context';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import List from '~components/list';
import ProgressBar from '~components/progress-bar';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

// ─── Demo: consuming the context programmatically ──────────────────────────────

function ActiveVariantBadge() {
  const ctx = useColorContext();
  if (!ctx) {
    return null;
  }
  return (
    <Box variant="p" color="inherit">
      Active variant: <strong>{ctx.variant}</strong> ({ctx.colorScheme})
    </Box>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const VARIANTS: ColorContextVariant[] = [
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
  { variant: 'h3', label: 'h3', content: 'Heading 3' },
  { variant: 'h4', label: 'h4', content: 'Heading 4' },
  { variant: 'p', label: 'p', content: 'Body paragraph text' },
];

const LIST_ITEMS: { id: string; content: string; icon: string; variant: ColorContextVariant }[] = [
  { id: 'health', content: 'Health overview', icon: 'face-happy', variant: 'green' },
  { id: 'functions', content: 'Functions', icon: 'script', variant: 'indigo' },
  { id: 'network', content: 'Network configuration', icon: 'globe', variant: 'grey' },
  { id: 'multi-session', content: 'Multi-session data', icon: 'multiscreen', variant: 'purple' },
  { id: 'alert', content: 'Alert center', icon: 'security', variant: 'red' },
  { id: 'communication', content: 'Communication', icon: 'contact', variant: 'mint' },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ColorContextPage() {
  return (
    <article>
      <Box variant="h1" padding={{ bottom: 'l' }}>
        ColorContextProvider — React Context + CSS custom property injection
      </Box>

      <Box variant="p" color="text-body-secondary" padding={{ bottom: 'xl' }}>
        The provider injects CSS custom properties as inline styles. No class names are applied. Descendant components
        re-style automatically because they already read those tokens. The active variant is also readable via{' '}
        <code>useColorContext()</code>.
      </Box>

      {/* ── Box variants × color variants ─────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'l', bottom: 'm' }}>
        Box variants
      </Box>

      {BOX_VARIANTS.map(({ variant, label, content }) => (
        <section key={label}>
          <Box variant="h3" padding={{ top: 'l', bottom: 's' }}>
            Box variant=&quot;{label}&quot;
          </Box>
          <SpaceBetween size="m" direction="horizontal">
            {VARIANTS.map(v => (
              <ColorContextProvider key={v} variant={v} style={{ borderRadius: 2 }}>
                <Box variant={variant}>{content}</Box>
              </ColorContextProvider>
            ))}
          </SpaceBetween>
        </section>
      ))}

      {/* ── useColorContext() demo ─────────────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'xxxl', bottom: 'm' }}>
        useColorContext() — programmatic access
      </Box>
      <ColorContextProvider variant="indigo" style={{ borderRadius: 8 }}>
        <SpaceBetween size="xs">
          <ActiveVariantBadge />
          <Box variant="p">
            Any descendant can call <code>useColorContext()</code> to read the active variant and color scheme without
            touching the DOM or CSS.
          </Box>
        </SpaceBetween>
      </ColorContextProvider>

      {/* ── Application in components ──────────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'xxxl', bottom: 'm' }}>
        Application in components
      </Box>

      {/* KeyValuePairs — context wraps only the value */}
      <Box variant="h3" padding={{ bottom: 's' }}>
        KeyValuePairs
      </Box>
      <KeyValuePairs
        columns={3}
        items={[
          {
            label: 'Distribution ID',
            value: (
              <ColorContextProvider variant="indigo" style={{ borderRadius: 2 }}>
                <Box variant="p">E1WG1ZNPRXT0D4</Box>
              </ColorContextProvider>
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
                textToCopy="arn:service23G24::111122223333:distribution/23E1WG1ZNPR"
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
              <ColorContextProvider variant="green" style={{ borderRadius: 2 }}>
                <Box variant="p">Use only US, Canada, Europe</Box>
              </ColorContextProvider>
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

      {/* List — context circle wraps only the icon */}
      <Box variant="h3" padding={{ top: 'xl', bottom: 's' }}>
        List
      </Box>
      <List
        ariaLabel="List with circle icon badges"
        items={LIST_ITEMS}
        renderItem={item => ({
          id: item.id,
          content: item.content,
          icon: (
            <ColorContextProvider
              variant={item.variant}
              as="span"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                width: 32,
                height: 32,
                flexShrink: 0,
                paddingInline: 0,
                paddingBlock: 0,
              }}
            >
              <Icon name={item.icon as any} size="normal" variant="subtle" />
            </ColorContextProvider>
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
