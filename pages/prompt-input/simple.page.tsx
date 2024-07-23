// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useEffect, useState } from 'react';

import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import PromptInput from '~components/prompt-input';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';

const MAX_CHARS = 200;

type DemoContext = React.Context<
  AppContextType<{
    isDisabled: boolean;
    isReadOnly: boolean;
    isInvalid: boolean;
    hasWarning: boolean;
    hasText: boolean;
  }>
>;

const placeholderText =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default function PromptInputPage() {
  const [textareaValue, setTextareaValue] = useState('');
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  const { isDisabled, isReadOnly, isInvalid, hasWarning, hasText } = urlParams;

  useEffect(() => {
    if (hasText) {
      setTextareaValue(placeholderText);
    }
  }, [hasText]);

  useEffect(() => {
    if (textareaValue !== placeholderText) {
      setUrlParams({ hasText: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textareaValue]);

  const ref = React.createRef<HTMLTextAreaElement>();

  return (
    <div style={{ padding: 10 }}>
      <h1>PromptInput demo</h1>
      <SpaceBetween size="xl">
        <FormField label="Settings">
          <Checkbox checked={isDisabled} onChange={() => setUrlParams({ isDisabled: !isDisabled })}>
            Disabled
          </Checkbox>
          <Checkbox checked={isReadOnly} onChange={() => setUrlParams({ isReadOnly: !isReadOnly })}>
            Read-only
          </Checkbox>
          <Checkbox checked={isInvalid} onChange={() => setUrlParams({ isInvalid: !isInvalid })}>
            Invalid
          </Checkbox>
          <Checkbox checked={hasWarning} onChange={() => setUrlParams({ hasWarning: !hasWarning })}>
            Warning
          </Checkbox>
        </FormField>
        <button id="placeholder-text-button" onClick={() => setUrlParams({ hasText: true })}>
          Fill with placeholder text
        </button>

        <button onClick={() => ref.current?.focus()}>Focus component</button>
        <button onClick={() => ref.current?.select()}>Select all text</button>

        <ColumnLayout columns={2}>
          <FormField
            errorText={textareaValue.length > MAX_CHARS && 'The query has too many characters.'}
            constraintText={
              <>
                This service is subject to some policy. Character count: {textareaValue.length}/{MAX_CHARS}
              </>
            }
            label={<span>User prompt</span>}
            i18nStrings={{ errorIconAriaLabel: 'Error' }}
          >
            <PromptInput
              actionButtonIconName="send"
              actionButtonAriaLabel="Submit prompt"
              value={textareaValue}
              onChange={(event: any) => setTextareaValue(event.detail.value)}
              onAction={event => window.alert(`Submitted the following: ${event.detail.value}`)}
              placeholder="Ask a question"
              maxRows={4}
              disabled={isDisabled}
              readOnly={isReadOnly}
              invalid={isInvalid || textareaValue.length > MAX_CHARS}
              warning={hasWarning}
              ref={ref}
            />
          </FormField>
          <div />
        </ColumnLayout>
      </SpaceBetween>
    </div>
  );
}
