// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import OmniBox from '~components/omni-box';
import SpaceBetween from '~components/space-between';

function OmniBoxes() {
  const [textareaValue, setTextareaValue] = useState('something');
  return (
    <SpaceBetween size="xs">
      <OmniBox
        ariaLabel="textarea"
        value={textareaValue}
        onChange={(event: any) => setTextareaValue(event.detail.value)}
      />
      <OmniBox ariaLabel="textarea" placeholder="Enter something" value="" readOnly={true} />
      <OmniBox ariaLabel="Disabled textarea" disabled={true} placeholder="Enter something" value="" />
    </SpaceBetween>
  );
}

export default function OmniBoxPage() {
  return (
    <div style={{ padding: 10 }}>
      <h1>OmniBox demo</h1>
      <OmniBoxes />
    </div>
  );
}
