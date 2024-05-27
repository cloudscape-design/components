// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import PromptInput from '~components/prompt-input';

export default function PromptInputPage() {
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div style={{ padding: 10 }}>
      <h1>PromptInput demo</h1>
      <PromptInput
        ariaLabel="textarea"
        value={textareaValue}
        onChange={(event: any) => setTextareaValue(event.detail.value)}
        placeholder="Ask a question"
        maxRows={6}
      />
    </div>
  );
}
