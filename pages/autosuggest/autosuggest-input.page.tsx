// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Box from '~components/box';
import AutosuggestInput from '~components/internal/components/autosuggest-input';

const contentOptions = [
  { key: 'small', content: ContentSmall },
  { key: 'medium', content: ContentMedium },
  { key: 'large', content: ContentLarge },
];

export default function AutosuggestInputPage() {
  const [value, setValue] = useState('');

  const [matched] = contentOptions.filter(o => o.key.startsWith(value.toLowerCase()));
  const dropdownContentKey = matched ? matched.key : 'not-matched';
  const DropdownContent = matched ? matched.content : ContentNoMatch;

  return (
    <Box margin="m">
      <h1>Autosuggest input</h1>
      <AutosuggestInput
        value={value}
        onChange={e => setValue(e.detail.value)}
        dropdownContentKey={dropdownContentKey}
        dropdownContent={
          <Box padding="m">
            <DropdownContent />
          </Box>
        }
        dropdownWidth={300}
        ariaLabel="autosuggest input"
      />
    </Box>
  );
}

function ContentNoMatch() {
  return <div>Nothing matched</div>;
}

function ContentSmall() {
  return <div style={{ width: 200 }}>Small</div>;
}

function ContentMedium() {
  return <div style={{ width: 350 }}>Medium</div>;
}

function ContentLarge() {
  return <div style={{ width: 500 }}>Large</div>;
}
