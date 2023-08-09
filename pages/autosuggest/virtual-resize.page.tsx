// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Autosuggest from '~components/autosuggest';

interface ExtendedWindow extends Window {
  __shrinkComponent?: (shrunk: boolean) => void;
}
declare const window: ExtendedWindow;

const options = [
  {
    value:
      'A very very very very very very very very very very very very very long option label that wraps upon resizing',
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
  const [value, setValue] = useState('');
  const [shrunk, setShrunk] = useState(false);
  window.__shrinkComponent = setShrunk;

  const style = shrunk ? { width: '100px' } : undefined;
  return (
    <div style={{ padding: 10 }}>
      <h1>Virtual autosuggest resizing</h1>
      <div style={style}>
        <Autosuggest
          value={value}
          options={options}
          onChange={event => setValue(event.detail.value)}
          enteredTextLabel={enteredTextLabel}
          ariaLabel={'simple autosuggest'}
          selectedAriaLabel="Selected"
          virtualScroll={true}
          expandToViewport={false}
        />
      </div>
    </div>
  );
}
