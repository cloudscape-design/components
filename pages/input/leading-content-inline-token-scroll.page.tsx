// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useContext, useRef, useState } from 'react';

import FormField from '~components/form-field';
import Input, { InputProps } from '~components/input';
import LiveRegion from '~components/live-region';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import Token from '~components/token';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    warning?: boolean;
  }>
>;

const INITIAL_TOKENS = ['us-east-1', 'prod'];

function TokenizedInput({
  disabled,
  readOnly,
  invalid,
  warning,
}: {
  disabled: boolean;
  readOnly: boolean;
  invalid: boolean;
  warning: boolean;
}) {
  const [inputValue, setInputValue] = useState('');
  const [tokens, setTokens] = useState<string[]>(INITIAL_TOKENS);
  const [announcement, setAnnouncement] = useState('');
  const inputRef = useRef<InputProps.Ref | null>(null);
  const tokenRefs = useRef<Array<HTMLElement | null>>([]);
  const slotRef = useRef<HTMLSpanElement | null>(null);

  const focusTokenAt = useCallback((index: number) => {
    queueMicrotask(() => {
      if (index >= 0 && index < tokenRefs.current.length) {
        const wrapper = tokenRefs.current[index];
        const dismissBtn = wrapper?.querySelector<HTMLElement>('button');
        (dismissBtn ?? wrapper)?.focus();
      } else {
        inputRef.current?.focus();
      }
    });
  }, []);

  const removeToken = useCallback(
    (index: number, currentLength: number) => {
      setTokens(prev => {
        const removed = prev[index];
        const next = prev.filter((_, i) => i !== index);
        setAnnouncement(`Removed ${removed}. ${next.length} filter${next.length !== 1 ? 's' : ''} applied.`);
        return next;
      });
      focusTokenAt(index < currentLength - 1 ? index : index - 1);
    },
    [focusTokenAt]
  );

  function handleKeyDown(event: CustomEvent<InputProps.KeyDetail>) {
    if (event.detail.key === 'Enter' && inputValue.trim() !== '') {
      const newToken = inputValue.trim();
      setTokens(prev => {
        const next = [...prev, newToken];
        setAnnouncement(`Added ${newToken}. ${next.length} filter${next.length !== 1 ? 's' : ''} applied.`);
        return next;
      });
      setInputValue('');
      // Scroll the slot to the right so the newly added token is visible.
      // slotRef is the inner list span; its parent is the .input-leading-content
      // wrapper which has overflow-x: auto.
      queueMicrotask(() => {
        const scrollable = slotRef.current?.parentElement;
        if (scrollable) {
          scrollable.scrollLeft = scrollable.scrollWidth;
        }
      });
    }
    if (event.detail.key === 'Backspace' && inputValue === '' && tokens.length > 0) {
      focusTokenAt(tokens.length - 1);
    }
  }

  function handleTokenKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault();
      removeToken(index, tokens.length);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTokenAt(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusTokenAt(index + 1);
    }
  }

  return (
    <div>
      <LiveRegion hidden={true}>{announcement}</LiveRegion>

      <Input
        ref={inputRef}
        value={inputValue}
        onChange={({ detail }) => setInputValue(detail.value)}
        onKeyDown={handleKeyDown}
        ariaLabel={`Filter resources. ${tokens.length} filter${tokens.length !== 1 ? 's' : ''} applied. Type and press Enter to add.`}
        placeholder={tokens.length === 0 ? 'Type and press Enter to add a filter' : undefined}
        disabled={disabled}
        readOnly={readOnly}
        invalid={invalid}
        warning={warning}
        leadingContent={
          tokens.length > 0 ? (
            <span
              role="list"
              aria-label="Applied filters"
              ref={slotRef}
              style={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}
            >
              {tokens.map((token, index) => (
                <span
                  key={token}
                  role="listitem"
                  ref={el => {
                    tokenRefs.current[index] = el;
                  }}
                  onKeyDown={e => handleTokenKeyDown(e, index)}
                >
                  <Token
                    variant="inline"
                    label={token}
                    dismissLabel={`Remove ${token}`}
                    disabled={disabled}
                    readOnly={readOnly}
                    onDismiss={() => removeToken(index, tokens.length)}
                  />
                </span>
              ))}
            </span>
          ) : undefined
        }
      />
    </div>
  );
}

export default function LeadingContentFullExamplePage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const disabled = urlParams.disabled ?? false;
  const readOnly = urlParams.readOnly ?? false;
  const invalid = urlParams.invalid ?? false;
  const warning = urlParams.warning ?? false;

  return (
    <SimplePage
      title="Input — leadingContent inline token scroll"
      settings={
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <Toggle checked={disabled} onChange={({ detail }) => setUrlParams({ disabled: detail.checked })}>
            Disabled
          </Toggle>
          <Toggle checked={readOnly} onChange={({ detail }) => setUrlParams({ readOnly: detail.checked })}>
            Read-only
          </Toggle>
          <Toggle checked={invalid} onChange={({ detail }) => setUrlParams({ invalid: detail.checked })}>
            Invalid
          </Toggle>
          <Toggle checked={warning} onChange={({ detail }) => setUrlParams({ warning: detail.checked })}>
            Warning
          </Toggle>
        </SpaceBetween>
      }
    >
      <FormField
        label="Filter resources"
        description="Type and press Enter to add a token. Backspace on empty input moves focus to last token. Arrow keys navigate between tokens. Delete/Backspace on a focused token removes it."
        errorText={invalid ? 'Validation error.' : undefined}
        warningText={warning && !invalid ? 'Validation warning.' : undefined}
      >
        <TokenizedInput disabled={disabled} readOnly={readOnly} invalid={invalid} warning={warning} />
      </FormField>
    </SimplePage>
  );
}
