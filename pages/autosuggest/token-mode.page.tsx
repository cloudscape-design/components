// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Autosuggest, AutosuggestProps, Button, FormField, SpaceBetween } from '~components';

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

export default function AutosuggestTokenModePage() {
  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState<AutosuggestProps.Token[]>([]);

  const selected = new Set(tokens.map(t => t.value));
  const filteredOptions = ALL_OPTIONS.filter(o => !selected.has(o.value!) && (!value || o.value!.includes(value)));

  return (
    <SimplePage title="Autosuggest token mode" screenshotArea={{ disableAnimations: true }}>
      <SpaceBetween size="s">
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
                enteredTextLabel: v => `Add "${v}"`,
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
            data-testid="add-token"
            onClick={() => {
              const next = ALL_OPTIONS.find(o => !selected.has(o.value!));
              if (next) {
                setTokens(prev => [...prev, { value: next.value! }]);
              }
            }}
          >
            Add token
          </Button>
        </SpaceBetween>
      </SpaceBetween>
    </SimplePage>
  );
}
