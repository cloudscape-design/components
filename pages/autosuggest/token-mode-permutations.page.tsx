// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Autosuggest, AutosuggestProps, FormField, Icon } from '~components';

import { PermutationsPage } from '../app/templates';
import PermutationsView from '../utils/permutations-view';

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
const OPTION_SETS: Record<string, AutosuggestProps.Options> = {
  regions: ALL_OPTIONS,
  emails: EMAIL_OPTIONS,
  icons: ICON_OPTIONS,
  none: [],
};

interface Permutation {
  label: string;
  tokens: ReadonlyArray<string>;
  options?: keyof typeof OPTION_SETS;
  maxInlineSize?: string;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
}

const permutations: ReadonlyArray<Permutation> = [
  { label: 'No tokens', tokens: [] },
  { label: 'No options (empty dropdown)', tokens: [], options: 'none' },
  { label: 'Email recipients (long token labels)', tokens: ['alice@example.com'], options: 'emails' },
  { label: 'Few tokens (2)', tokens: ['us-east-1', 'eu-west-1'] },
  {
    label: 'Tokens with icons (icon on option transfers to token)',
    tokens: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
    options: 'icons',
  },
  {
    label: 'Many tokens — overflow trigger',
    tokens: ALL_OPTIONS.slice(0, 6).map(o => o.value!),
    maxInlineSize: '400px',
  },
  { label: 'Disabled', tokens: ['us-east-1'], disabled: true },
  { label: 'Read-only', tokens: ['us-east-1'], readOnly: true },
  { label: 'Invalid (error state)', tokens: ['us-east-1'], invalid: true },
];

function Scenario({
  label,
  tokens: initTokens,
  options: optionSet = 'regions',
  maxInlineSize,
  disabled,
  readOnly,
  invalid,
}: Permutation) {
  const options = OPTION_SETS[optionSet];
  const toToken = optionSet === 'icons' ? makeIconToken : (v: string): AutosuggestProps.Token => ({ value: v });
  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState(() => initTokens.map(toToken));
  const selected = new Set(tokens.map(t => t.value));
  return (
    <div style={{ maxInlineSize }}>
      <FormField label={label} errorText={invalid ? 'At least one region required.' : undefined}>
        <Autosuggest
          value={value}
          tokens={tokens}
          onChange={({ detail }) => {
            setValue(detail.value);
            if (detail.tokens !== undefined) {
              setTokens(detail.tokens.map(t => toToken(t.value)));
            }
          }}
          options={options.filter(o => !selected.has(o.value!) && (!value || o.value!.includes(value)))}
          placeholder="Search or add a region"
          empty="No options"
          disabled={disabled}
          readOnly={readOnly}
          invalid={invalid}
        />
      </FormField>
    </div>
  );
}

export default function AutosuggestTokenModePermutationsPage() {
  return (
    <PermutationsPage
      title="Autosuggest token mode permutations"
      screenshotArea={{ disableAnimations: true }}
      i18n={{}}
    >
      <PermutationsView permutations={permutations} render={permutation => <Scenario {...permutation} />} />
    </PermutationsPage>
  );
}
