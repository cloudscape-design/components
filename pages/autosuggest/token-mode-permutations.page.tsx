// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Autosuggest, AutosuggestProps, FormField, Icon, IconProvider } from '~components';

import { SimplePage } from '../app/templates';

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
  'us-east-1': <Icon name="settings" size="x-small" />,
  'us-west-2': <Icon name="globe" size="x-small" />,
  'eu-west-1': <Icon name="calendar" size="x-small" />,
  'ap-southeast-1': <Icon name="contact" size="x-small" />,
  'ca-central-1': <Icon name="flag" size="x-small" />,
  'sa-east-1': <Icon name="star" size="x-small" />,
  'custom-region': <Icon svg={CUSTOM_SVG_ICON} size="x-small" />,
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
      />
    </FormField>
  );
}

function Scenario({
  label,
  initTokens,
  options = ALL_OPTIONS,
  disabled,
  readOnly,
  invalid,
}: {
  label: string;
  initTokens: AutosuggestProps.Token[];
  options?: AutosuggestProps.Options;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
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

export default function AutosuggestTokenModePermutationsPage() {
  return (
    <SimplePage title="Autosuggest token mode permutations" screenshotArea={{ disableAnimations: true }} i18n={{}}>
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
        label="Many tokens — overflow trigger"
        initTokens={ALL_OPTIONS.slice(0, 6).map(o => makeToken(o.value!))}
      />
      <Scenario label="Disabled" initTokens={[makeToken('us-east-1')]} disabled={true} />
      <Scenario label="Read-only" initTokens={[makeToken('us-east-1')]} readOnly={true} />
      <Scenario label="Invalid (error state)" initTokens={[makeToken('us-east-1')]} invalid={true} />
    </SimplePage>
  );
}
