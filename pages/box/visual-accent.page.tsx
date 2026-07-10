// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box, { BoxProps } from '~components/box';
import Container from '~components/container';
import Header from '~components/header';
import Icon from '~components/icon';
import KeyValuePairs from '~components/key-value-pairs';
import List from '~components/list';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

// ─── Data ──────────────────────────────────────────────────────────────────────

const ALL_VARIANTS: BoxProps.VisualAccent.Color[] = [
  'red',
  'yellow',
  'indigo',
  'green',
  'orange',
  'purple',
  'mint',
  'lime',
  'grey',
  'teal',
  'cyan',
  'blue',
  'violet',
  'fuchsia',
  'magenta',
  'pink',
  'rose',
  'amber',
];

const BOX_VARIANTS: { variant: BoxProps['variant']; label: string; content: string }[] = [
  { variant: 'h3', label: 'h3', content: 'Heading 3' },
  { variant: 'p', label: 'p', content: 'Body paragraph text' },
];

const LIST_ITEMS: { id: string; content: string; icon: string; color: BoxProps.VisualAccent.Color }[] = [
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
    <ScreenshotArea disableAnimations={true} style={{ display: 'flex', justifyContent: 'center' }}>
      <article style={{ inlineSize: '90%' }}>
        <Box variant="h1" padding={{ bottom: 'l' }}>
          Box visualAccent
        </Box>

        <Box variant="p" color="text-body-secondary" padding={{ bottom: 'xl' }}>
          Uses the existing Box component with a new <code>visualAccent</code> prop. No wrapper component or utility
          classes needed.
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
                  variant={variant}
                  visualAccent={{ color, borderRadius: 'xxxs' }}
                  padding={{ horizontal: 'xxxs', vertical: 'n' }}
                >
                  {content}
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
            <Box key={color} visualAccent={{ color, aspectRatio: 'equal', borderRadius: 'full' }}>
              <Icon name="check" size="medium" />
            </Box>
          ))}
        </SpaceBetween>

        {/* ── Application in components ──────────────────────────────────── */}
        <Box variant="h2" padding={{ top: 'xxxl', bottom: 'm' }}>
          Application in components
        </Box>

        <Container header={<Header variant="h3">KeyValuePairs</Header>}>
          <KeyValuePairs
            columns={3}
            items={[
              {
                label: 'Components',
                value: (
                  <Box
                    visualAccent={{ color: 'mint' }}
                    padding={{ horizontal: 'xxxs', vertical: 'xxxs' }}
                    margin={{ top: 'xxs' }}
                  >
                    <span style={{ fontSize: '20px' }}>114</span>
                  </Box>
                ),
              },
              {
                label: 'Patterns',
                value: (
                  <Box
                    visualAccent={{ color: 'mint' }}
                    padding={{ horizontal: 'xxxs', vertical: 'xxxs' }}
                    margin={{ top: 'xxs' }}
                  >
                    <span style={{ fontSize: '20px' }}>81</span>
                  </Box>
                ),
              },
              {
                label: 'Demos',
                value: (
                  <Box
                    visualAccent={{ color: 'mint' }}
                    padding={{ horizontal: 'xxxs', vertical: 'xxxs' }}
                    margin={{ top: 'xxs' }}
                  >
                    <span style={{ fontSize: '20px' }}>35</span>
                  </Box>
                ),
              },
            ]}
          />
        </Container>

        <Box padding={{ top: 'xl' }} />
        <Container header={<Header variant="h3">List</Header>}>
          <List
            ariaLabel="List with accent icon badges"
            items={LIST_ITEMS}
            renderItem={item => ({
              id: item.id,
              content: item.content,
              icon: (
                <Box padding={'s'} visualAccent={{ color: item.color, borderRadius: 'xs', aspectRatio: 'equal' }}>
                  <Icon name={item.icon as any} size="medium" />
                </Box>
              ),
            })}
          />
        </Container>
      </article>
    </ScreenshotArea>
  );
}
