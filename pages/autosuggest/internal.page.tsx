// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import InternalAutosuggest from '~components/autosuggest/internal';

const options = [
  {
    value: 'A very long option label that wraps upon resizing',
    tags: ['tag1', 'tag2'],
    filteringTags: ['bla', 'opt'],
    description: 'description1',
  },
  { value: 'Option 1', labelTag: 'This is a label tag' },
  { value: 'Option 2' },
  { value: 'Option', description: 'description2' },
];
const enteredTextLabel = (value: string) => `Use: ${value}`;
export default function AutosuggestPage() {
  const [value, setValue] = useState('Option 1');
  return (
    <div style={{ padding: 10 }}>
      <h1>Internal autosuggest features</h1>
      <InternalAutosuggest
        __filterText={value.substr(2)}
        __dropdownWidth={300}
        __disableShowAll={true}
        value={value}
        options={options}
        onChange={event => setValue(event.detail.value)}
        onSelect={event => event.preventDefault()}
        enteredTextLabel={enteredTextLabel}
        ariaLabel={'internal autosuggest'}
        virtualScroll={true}
      />
    </div>
  );
}
