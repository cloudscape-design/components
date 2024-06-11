// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import PromptInput from '~components/prompt-input';

const MAX_CHARS = 200;

export default function PromptInputPage() {
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div style={{ padding: 10 }}>
      <h1>PromptInput demo</h1>
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
            placeholder="Ask a question"
            maxRows={6}
          />
        </FormField>
        <div />
      </ColumnLayout>
    </div>
  );
}
