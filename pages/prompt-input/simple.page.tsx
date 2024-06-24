// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { Checkbox } from '~components';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import PromptInput from '~components/prompt-input';

const MAX_CHARS = 200;

export default function PromptInputPage() {
  const [textareaValue, setTextareaValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [hasWarning, setHasWarning] = useState(false);

  return (
    <div style={{ padding: 10 }}>
      <h1>PromptInput demo</h1>
      <FormField label="Settings">
        <Checkbox checked={isDisabled} onChange={() => setIsDisabled(!isDisabled)}>
          Disabled
        </Checkbox>
        <Checkbox checked={isReadOnly} onChange={() => setIsReadOnly(!isReadOnly)}>
          Read-only
        </Checkbox>
        <Checkbox checked={isInvalid} onChange={() => setIsInvalid(!isInvalid)}>
          Invalid
        </Checkbox>
        <Checkbox checked={hasWarning} onChange={() => setHasWarning(!hasWarning)}>
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
            invalid={isInvalid}
            warning={hasWarning}
          />
        </FormField>
        <div />
      </ColumnLayout>
    </div>
  );
}
