// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box, { BoxProps } from '~components/box';
import ButtonDropdown from '~components/button-dropdown';
import CopyToClipboard from '~components/copy-to-clipboard';
import Icon from '~components/icon';
import { StyleBox, StyleBoxVariant } from '~components/internal/components/style-box';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import List from '~components/list';
import ProgressBar from '~components/progress-bar';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

const STYLE_VARIANTS: StyleBoxVariant[] = [
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

// Representative icon per StyleBox variant — used in the shape="circle" showcase
const VARIANT_ICON: Record<StyleBoxVariant, string> = {
  red: 'status-negative',
  yellow: 'status-warning',
  indigo: 'status-info',
  green: 'status-positive',
  orange: 'notification',
  purple: 'gen-ai',
  mint: 'check',
  lime: 'thumbs-up',
  grey: 'settings',
};

// Box variants to showcase — each gets its own section
const BOX_VARIANTS: { variant: BoxProps['variant']; label: string; content: string }[] = [
  { variant: 'h3', label: 'h3', content: 'Heading 3' },
  { variant: 'h4', label: 'h4', content: 'Heading 4' },
  { variant: 'p', label: 'p', content: 'Body paragraph text' },
];

const LIST_ITEMS: { id: string; content: string; icon: string; variant: StyleBoxVariant }[] = [
  { id: 'health', content: 'Health overview', icon: 'face-happy', variant: 'green' },
  { id: 'functions', content: 'Functions', icon: 'script', variant: 'indigo' },
  { id: 'network', content: 'Network configuration', icon: 'globe', variant: 'grey' },
  { id: 'multi-session', content: 'Multi-session data', icon: 'multiscreen', variant: 'purple' },
  { id: 'alert', content: 'Alert center', icon: 'security', variant: 'red' },
  { id: 'communication', content: 'Communication', icon: 'contact', variant: 'mint' },
];

export default function StyleBoxPage() {
  return (
    <article>
      <Box variant="h1" padding={{ bottom: 'l' }}>
        StyleBox — color variants × Box variants
      </Box>

      {/* shape="sharp" — one section per Box variant */}
      <Box variant="h2" padding={{ top: 'xl', bottom: 'm' }}>
        shape=&quot;sharp&quot;
      </Box>

      {BOX_VARIANTS.map(({ variant, label, content }) => (
        <section key={label}>
          <Box variant="h3" padding={{ top: 'l', bottom: 's' }}>
            Box variant=&quot;{label}&quot;
          </Box>
          <SpaceBetween size="m" direction="horizontal">
            {STYLE_VARIANTS.map(styleVariant => (
              <StyleBox key={styleVariant} variant={styleVariant} shape="sharp">
                <Box variant={variant}>{content}</Box>
              </StyleBox>
            ))}
          </SpaceBetween>
        </section>
      ))}

      {/* shape="circle" — all style variants with icons */}
      <Box variant="h2" padding={{ top: 'xxxl', bottom: 'm' }}>
        shape=&quot;circle&quot;
      </Box>
      <SpaceBetween size="m" direction="horizontal">
        {STYLE_VARIANTS.map(styleVariant => (
          <StyleBox key={styleVariant} variant={styleVariant} shape="circle">
            <Icon name={VARIANT_ICON[styleVariant] as any} size="medium" variant="subtle" />
          </StyleBox>
        ))}
      </SpaceBetween>

      {/* ── Application in components ─────────────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'xxxl', bottom: 'm' }}>
        Application in components
      </Box>

      {/* KeyValuePairs — StyleBox on Distribution ID and Price class values */}
      <Box variant="h3" padding={{ bottom: 's' }}>
        KeyValuePairs
      </Box>
      <KeyValuePairs
        columns={3}
        items={[
          {
            label: 'Distribution ID',
            value: (
              <StyleBox variant="indigo" shape="sharp">
                <Box variant="p">E1WG1ZNPRXT0D4</Box>
              </StyleBox>
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
              <StyleBox variant="green" shape="sharp">
                <Box variant="p">Use only US, Canada, Europe</Box>
              </StyleBox>
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

      {/* List — StyleBox circle shape applied only to the icon slot */}
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
            <StyleBox variant={item.variant} shape="circle">
              <Icon name={item.icon as any} size="medium" variant="subtle" />
            </StyleBox>
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
