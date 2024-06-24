// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useContext } from 'react';
import { Checkbox } from '~components';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import PromptInput from '~components/prompt-input';
import AppContext, { AppContextType } from '../app/app-context';

const MAX_CHARS = 200;

type DemoContext = React.Context<
  AppContextType<{
    isDisabled: boolean;
    isReadOnly: boolean;
    isInvalid: boolean;
    hasWarning: boolean;
  }>
>;

export default function PromptInputPage() {
  const [textareaValue, setTextareaValue] = useState('');
  const { urlParams, setUrlParams } = useContext(AppContext as DemoContext);

  const { isDisabled, isReadOnly, isInvalid, hasWarning } = urlParams;

  return (
    <div style={{ padding: 10 }}>
      <h1>PromptInput demo</h1>
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
            maxRows={6}
            disabled={isDisabled}
            readOnly={isReadOnly}
            invalid={isInvalid || textareaValue.length > MAX_CHARS}
            warning={hasWarning}
          />
        </FormField>
        <div />
      </ColumnLayout>
    </div>
  );
}
