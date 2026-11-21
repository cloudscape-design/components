// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/*
 * NOTE: This page imports accent-classes.scss globally via a style import.
 * In a real integration the stylesheet would be included once in the app bundle.
 * Here we import it at the page level for demonstration.
 */
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

import './accent-classes.scss';

// ─── Data ──────────────────────────────────────────────────────────────────────

const ALL_VARIANTS = ['red', 'yellow', 'indigo', 'green', 'orange', 'purple', 'mint', 'lime', 'grey'] as const;
type Variant = (typeof ALL_VARIANTS)[number];

const BOX_VARIANTS: { variant: BoxProps['variant']; label: string; content: string }[] = [
  { variant: 'h3', label: 'h3', content: 'Heading 3' },
  { variant: 'h4', label: 'h4', content: 'Heading 4' },
  { variant: 'p', label: 'p', content: 'Body paragraph text' },
];

const LIST_ITEMS: { id: string; content: string; icon: string; variant: Variant }[] = [
  { id: 'health', content: 'Health overview', icon: 'face-happy', variant: 'green' },
  { id: 'functions', content: 'Functions', icon: 'script', variant: 'indigo' },
  { id: 'network', content: 'Network configuration', icon: 'globe', variant: 'grey' },
  { id: 'multi-session', content: 'Multi-session data', icon: 'multiscreen', variant: 'purple' },
  { id: 'alert', content: 'Alert center', icon: 'security', variant: 'red' },
  { id: 'communication', content: 'Communication', icon: 'contact', variant: 'mint' },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AccentClassesPage() {
  return (
    <article>
      <Box variant="h1" padding={{ bottom: 'l' }}>
        Accent utility classes — plain className usage
      </Box>

      <Box variant="p" color="text-body-secondary" padding={{ bottom: 'xl' }}>
        No Cloudscape wrapper component. Builders apply <code>awsui-accent-&#123;variant&#125;</code> and{' '}
        <code>awsui-accent-sharp</code> or <code>awsui-accent-circle</code> directly to any HTML element.
      </Box>

      {/* ── Box variants × color variants ─────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'l', bottom: 'm' }}>
        awsui-accent-sharp
      </Box>

      {BOX_VARIANTS.map(({ variant, label, content }) => (
        <section key={label}>
          <Box variant="h3" padding={{ top: 'l', bottom: 's' }}>
            Box variant=&quot;{label}&quot;
          </Box>
          <SpaceBetween size="m" direction="horizontal">
            {ALL_VARIANTS.map(v => (
              <span key={v} className={`awsui-accent-${v} awsui-accent-sharp`}>
                <Box variant={variant}>{content}</Box>
              </span>
            ))}
          </SpaceBetween>
        </section>
      ))}

      {/* ── Circle ────────────────────────────────────────────────────── */}
      <Box variant="h2" padding={{ top: 'xxxl', bottom: 'm' }}>
        awsui-accent-circle
      </Box>
      <SpaceBetween size="m" direction="horizontal">
        {ALL_VARIANTS.map(v => (
          <span key={v} className={`awsui-accent-${v} awsui-accent-circle`}>
            <Icon name="check" size="medium" variant="subtle" />
          </span>
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
              <span className="awsui-accent-indigo awsui-accent-sharp">
                <Box variant="p">E1WG1ZNPRXT0D4</Box>
              </span>
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
              <span className="awsui-accent-green awsui-accent-sharp">
                <Box variant="p">Use only US, Canada, Europe</Box>
              </span>
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
        ariaLabel="List with circle icon badges"
        items={LIST_ITEMS}
        renderItem={item => ({
          id: item.id,
          content: item.content,
          icon: (
            <span className={`awsui-accent-${item.variant} awsui-accent-circle`}>
              <Icon name={item.icon as any} size="medium" variant="subtle" />
            </span>
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
