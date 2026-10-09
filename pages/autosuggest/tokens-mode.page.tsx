// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Autosuggest, AutosuggestProps, Box, Button, FormField, Icon, IconProvider, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

const ALL_OPTIONS: AutosuggestProps.Options = [
  { value: 'us-east-1' },
  { value: 'us-west-2' },
  { value: 'eu-west-1' },
  { value: 'ap-southeast-1' },
  { value: 'ca-central-1' },
  { value: 'sa-east-1' },
  { value: 'eu-central-1' },
  { value: 'ap-northeast-1' },
  { value: 'us-west-1' },
  { value: 'eu-north-1' },
  { value: 'ap-east-1' },
  { value: 'me-south-1' },
];

const EMAIL_OPTIONS: AutosuggestProps.Options = [
  { value: 'alice@example.com' },
  { value: 'bob.smith@company.org' },
  { value: 'carol.jones@enterprise.io' },
  { value: 'dave@test.net' },
  { value: 'eve.long-surname@subdomain.example.com' },
  { value: 'frank@mail.co' },
  { value: 'grace@example.com' },
  { value: 'henry.wilson@corp.net' },
];

function makeToken(label: string): AutosuggestProps.Token {
  return { value: label };
}

const CUSTOM_SVG_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="8" cy="8" r="2" fill="currentColor" />
  </svg>
);

const REGION_ICON_MAP: Record<string, React.ReactNode> = {
  'us-east-1': <Icon name="settings" size="small" />,
  'us-west-2': <Icon name="globe" size="small" />,
  'eu-west-1': <Icon name="calendar" size="small" />,
  'ap-southeast-1': <Icon name="contact" size="small" />,
  'ca-central-1': <Icon name="flag" size="small" />,
  'sa-east-1': <Icon name="star" size="small" />,
  'custom-region': <Icon svg={CUSTOM_SVG_ICON} size="small" />,
};

const ICON_OPTIONS: AutosuggestProps.Options = [
  { value: 'us-east-1', iconName: 'settings' },
  { value: 'us-west-2', iconName: 'globe' },
  { value: 'eu-west-1', iconName: 'calendar' },
  { value: 'ap-southeast-1', iconName: 'contact' },
  { value: 'ca-central-1', iconName: 'flag' },
  { value: 'sa-east-1', iconName: 'star' },
  { value: 'custom-region', label: 'custom-region (custom SVG icon)', iconSvg: CUSTOM_SVG_ICON },
];

function makeIconToken(value: string): AutosuggestProps.Token {
  const icon = REGION_ICON_MAP[value];
  return { value, ...(icon ? { icon } : {}) };
}

function IconScenario() {
  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState<AutosuggestProps.Token[]>([
    makeIconToken('us-east-1'),
    makeIconToken('eu-west-1'),
    makeIconToken('ap-southeast-1'),
  ]);
  const selected = new Set(tokens.map(t => t.value));
  return (
    <FormField label="Tokens with icons (icon on option transfers to token)">
      <Autosuggest
        value={value}
        tokens={tokens}
        onChange={({ detail }) => {
          setValue(detail.value);
          if (detail.tokens !== undefined) {
            setTokens(
              detail.tokens.map(t => {
                const existing = tokens.find(et => et.value === t.value);
                if (existing?.icon) {
                  return existing;
                }
                const option = ICON_OPTIONS.find(o => o.value === t.value);
                return option ? makeIconToken(t.value) : t;
              })
            );
          }
        }}
        options={ICON_OPTIONS.filter(o => !selected.has(o.value!) && (!value || o.value!.includes(value)))}
        placeholder="Search or add a region"
        empty="No options"
        i18nStrings={{ tokenDismissLabel: v => `Remove ${v}` }}
      />
    </FormField>
  );
}

function InteractiveDemo() {
  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState<AutosuggestProps.Token[]>([]);

  const selected = new Set(tokens.map(t => t.value));
  const filteredOptions = ALL_OPTIONS.filter(o => !selected.has(o.value!) && (!value || o.value!.includes(value)));

  return (
    <SpaceBetween size="s">
      <Box variant="h2">Interactive demo</Box>
      <FormField
        label="Filter logs"
        description="Type to search, press Enter or select from dropdown to add a token. Backspace on empty input focuses last token."
      >
        <div data-testid="interactive-demo">
          <Autosuggest
            value={value}
            onChange={({ detail }) => {
              setValue(detail.value);
              if (detail.tokens !== undefined) {
                setTokens([...detail.tokens]);
              }
            }}
            tokens={tokens}
            i18nStrings={{
              tokenOverflowAriaLabel: count => `${count} more regions`,
              tokenDismissLabel: v => `Remove ${v}`,
            }}
            options={filteredOptions}
            placeholder="Search or add a region"
            empty="No options"
          />
        </div>
      </FormField>
      <SpaceBetween direction="horizontal" size="xs">
        <Button onClick={() => setTokens([])}>Clear all tokens</Button>
        <Button
          onClick={() => {
            const next = ALL_OPTIONS.find(o => !selected.has(o.value!));
            if (next) {
              setTokens(prev => [...prev, makeToken(next.value!)]);
            }
          }}
        >
          Add token
        </Button>
      </SpaceBetween>
    </SpaceBetween>
  );
}

function Scenario({
  label,
  initTokens,
  options = ALL_OPTIONS,
  disabled,
  readOnly,
  invalid,
  tokenOverflowAriaLabel,
}: {
  label: string;
  initTokens: AutosuggestProps.Token[];
  options?: AutosuggestProps.Options;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  tokenOverflowAriaLabel?: (hiddenCount: number) => string;
}) {
  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState(initTokens);
  return (
    <FormField label={label} errorText={invalid ? 'At least one region required.' : undefined}>
      <Autosuggest
        value={value}
        tokens={tokens}
        onChange={({ detail }) => {
          setValue(detail.value);
          if (detail.tokens !== undefined) {
            setTokens([...detail.tokens]);
          }
        }}
        i18nStrings={{
          tokenDismissLabel: v => `Remove ${v}`,
          ...(tokenOverflowAriaLabel ? { tokenOverflowAriaLabel } : {}),
        }}
        options={options.filter(o => !value || o.value!.includes(value))}
        placeholder="Search or add a region"
        empty="No options"
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
      />
    </FormField>
  );
}

export default function AutosuggestTokensModePage() {
  return (
    <Box margin="m">
      <SpaceBetween size="xxl">
        <Box variant="h1">Autosuggest — mode=&quot;tokens&quot;</Box>
        <InteractiveDemo />
        <SpaceBetween size="l">
          <Box variant="h2">Scenarios</Box>
          <ScreenshotArea disableAnimations={true}>
            <SpaceBetween size="l">
              <Scenario label="No tokens" initTokens={[]} />
              <Scenario label="No options (empty dropdown)" initTokens={[]} options={[]} />
              <Scenario
                label="Email recipients (long token labels)"
                options={EMAIL_OPTIONS}
                initTokens={[makeToken('alice@example.com')]}
              />
              <Scenario label="Few tokens (2)" initTokens={[makeToken('us-east-1'), makeToken('eu-west-1')]} />
              <IconScenario />
              <IconProvider
                icons={{
                  search: <Icon name="settings" variant="subtle" size="inherit" />,
                }}
              >
                <Scenario
                  label="Custom search icon via IconProvider (settings icon replaces magnifying glass)"
                  initTokens={[makeToken('us-east-1'), makeToken('eu-west-1')]}
                />
              </IconProvider>
              <Scenario
                label="Many tokens — overflow pill with custom aria-label"
                initTokens={ALL_OPTIONS.slice(0, 6).map(o => makeToken(o.value!))}
                tokenOverflowAriaLabel={count => `${count} more regions`}
              />
              <Scenario label="Disabled" initTokens={[makeToken('us-east-1')]} disabled={true} />
              <Scenario label="Read-only" initTokens={[makeToken('us-east-1')]} readOnly={true} />
              <Scenario label="Invalid (error state)" initTokens={[makeToken('us-east-1')]} invalid={true} />
            </SpaceBetween>
          </ScreenshotArea>
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
