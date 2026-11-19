// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { Checkbox, FormField, KeyValuePairs, PromptInput, PromptInputProps, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

const menus: PromptInputProps.MenuDefinition[] = [
  {
    id: 'mentions',
    trigger: '@',
    options: [
      { value: 'alice', label: 'Alice' },
      { value: 'bob', label: 'Bob' },
    ],
    filteringType: 'auto',
    empty: 'No mentions found',
  },
];

const tokensToText = (tokens: readonly PromptInputProps.InputToken[]) => tokens.map(token => token.value).join('');

export default function FeatureFlagModeSwitchPage() {
  // Simulated async feature flag: starts false, becomes true after a delay.
  const [tokenModeEnabled, setTokenModeEnabled] = useState(false);
  // Auto-flip the flag shortly after mount to mimic the async API resolution.
  const [autoFlip, setAutoFlip] = useState(true);

  const [value, setValue] = useState('');
  const [tokens, setTokens] = useState<readonly PromptInputProps.InputToken[]>([]);

  useEffect(() => {
    if (!autoFlip || tokenModeEnabled) {
      return;
    }
    const timer = setTimeout(() => {
      setTokenModeEnabled(true);
      // Carry the text typed in string mode over into token mode.
      setTokens(prev => (prev.length > 0 ? prev : value ? [{ type: 'text', value }] : []));
    }, 1500);
    return () => clearTimeout(timer);
  }, [autoFlip, tokenModeEnabled, value]);

  const resetToStringMode = () => {
    setTokenModeEnabled(false);
    setTokens([]);
    setValue('');
  };

  return (
    <SimplePage title="PromptInput – feature flag mode switch">
      <SpaceBetween size="l">
        <FormField label="Settings">
          <Checkbox checked={autoFlip} onChange={({ detail }) => setAutoFlip(detail.checked)}>
            Auto-flip feature flag ~1.5s after mount (simulates async API)
          </Checkbox>
          <Checkbox
            checked={tokenModeEnabled}
            onChange={({ detail }) => {
              setTokenModeEnabled(detail.checked);
              if (detail.checked) {
                setTokens(prev => (prev.length > 0 ? prev : value ? [{ type: 'text', value }] : []));
              }
            }}
          >
            Token mode enabled (the &quot;feature flag&quot;)
          </Checkbox>
        </FormField>

        <button id="reset-button" onClick={resetToStringMode}>
          Reset to string mode (remount in string mode)
        </button>

        <KeyValuePairs
          columns={2}
          items={[
            { label: 'Resolved mode', value: tokenModeEnabled ? 'token mode' : 'string mode' },
            {
              label: tokenModeEnabled ? 'Current tokens' : 'Current value',
              value: (
                <code style={{ whiteSpace: 'pre-wrap' }}>
                  {tokenModeEnabled ? JSON.stringify(tokens, null, 2) : JSON.stringify(value)}
                </code>
              ),
            },
          ]}
        />

        <FormField label="User prompt">
          {tokenModeEnabled ? (
            <PromptInput
              data-testid="prompt-input"
              ariaLabel="Chat input (token mode)"
              actionButtonIconName="send"
              actionButtonAriaLabel="Submit prompt"
              placeholder="Type here after the flag flips…"
              tokens={tokens}
              tokensToText={tokensToText}
              menus={menus}
              onChange={event => {
                setTokens(event.detail.tokens ?? []);
                setValue(event.detail.value ?? '');
              }}
              onAction={({ detail }) => window.alert(`Submitted: ${detail.value ?? ''}`)}
            />
          ) : (
            <PromptInput
              data-testid="prompt-input"
              ariaLabel="Chat input (string mode)"
              actionButtonIconName="send"
              actionButtonAriaLabel="Submit prompt"
              placeholder="Type here (string mode)…"
              value={value}
              onChange={event => setValue(event.detail.value)}
              onAction={({ detail }) => window.alert(`Submitted: ${detail.value ?? ''}`)}
            />
          )}
        </FormField>
      </SpaceBetween>
    </SimplePage>
  );
}
