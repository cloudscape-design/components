// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import PromptInput from '~components/prompt-input';
import SpaceBetween from '~components/space-between';

function PromptInputes() {
  const [textareaValue, setTextareaValue] = useState('something');
  return (
    <SpaceBetween size="xs">
      <PromptInput
        ariaLabel="textarea"
        value={textareaValue}
        onChange={(event: any) => setTextareaValue(event.detail.value)}
      />
      <PromptInput ariaLabel="textarea" placeholder="Enter something" value="" readOnly={true} />
      <PromptInput ariaLabel="Disabled textarea" disabled={true} placeholder="Enter something" value="" />
    </SpaceBetween>
  );
}

export default function PromptInputPage() {
  return (
    <div style={{ padding: 10 }}>
      <h1>PromptInput demo</h1>
      <PromptInputes />
    </div>
  );
}
