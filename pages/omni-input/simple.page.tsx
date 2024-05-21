// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import OmniBox from '~components/omni-box';

export default function OmniBoxPage() {
  const [textareaValue, setTextareaValue] = useState('');

  return (
    <div style={{ padding: 10 }}>
      <h1>OmniBox demo</h1>
      <OmniBox
        ariaLabel="textarea"
        value={textareaValue}
        onChange={(event: any) => setTextareaValue(event.detail.value)}
        placeholder="Ask a question"
      />
    </div>
  );
}
