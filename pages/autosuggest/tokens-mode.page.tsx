// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Autosuggest, AutosuggestProps, Box, Button, FormField, SpaceBetween } from '~components';

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
  return { label, dismissLabel: `Remove ${label}` };
}

// ---------------------------------------------------------------------------
// Interactive demo
// ---------------------------------------------------------------------------
function InteractiveDemo() {
  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState<AutosuggestProps.Token[]>([]);

  const selected = new Set(tokens.map(t => t.label));
  const filteredOptions = ALL_OPTIONS.filter(o => !selected.has(o.value!) && (!value || o.value!.includes(value)));

  return (
    <SpaceBetween size="s">
      <Box variant="h2">Interactive demo</Box>
      <FormField
        label="Filter logs"
        description="Type to search, press Enter or select from dropdown to add a token. Backspace on empty input focuses last token."
      >
        <Autosuggest
          mode="tokens"
          value={value}
          onChange={({ detail }) => setValue(detail.value)}
          onSelect={({ detail }) => {
            if (detail.value && !selected.has(detail.value)) {
              setValue('');
            }
          }}
          tokens={tokens}
          onTokensChange={({ detail }) => setTokens([...detail.tokens])}
          options={filteredOptions}
          enteredTextLabel={v => `Use "${v}"`}
          placeholder="Search or add a region"
          empty="No options"
        />
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

// ---------------------------------------------------------------------------
// Static scenarios
// ---------------------------------------------------------------------------
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
        mode="tokens"
        value={value}
        onChange={({ detail }) => setValue(detail.value)}
        tokens={tokens}
        onTokensChange={({ detail }) => setTokens([...detail.tokens])}
        options={options.filter(o => !value || o.value!.includes(value))}
        enteredTextLabel={v => `Use "${v}"`}
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
          <Scenario label="No tokens" initTokens={[]} />
          <Scenario label="Email recipients (long token labels)" options={EMAIL_OPTIONS} initTokens={[]} />
          <Scenario label="Few tokens (2)" initTokens={[]} />
          <Scenario label="Many tokens (overflow)" initTokens={[]} />
          <Scenario label="Disabled" initTokens={[]} disabled={true} />
          <Scenario label="Read-only" initTokens={[]} readOnly={true} />
          <Scenario label="Invalid (error state)" initTokens={[]} invalid={true} />
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
