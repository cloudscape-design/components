// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import PropertyFilterAutosuggest from '~components/property-filter/property-filter-autosuggest';

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

export default function PropertyFilterAutosuggestPage() {
  const [value, setValue] = useState('Option 1');
  return (
    <div style={{ padding: 10 }}>
      <h1>Property filter autosuggest features</h1>
      <PropertyFilterAutosuggest
        filterText={value.substr(2)}
        onOptionClick={e => e.preventDefault()}
        value={value}
        options={options}
        onChange={event => setValue(event.detail.value)}
        enteredTextLabel={enteredTextLabel}
        ariaLabel={'internal autosuggest'}
        clearAriaLabel="Clear"
        virtualScroll={true}
      />
    </div>
  );
}
