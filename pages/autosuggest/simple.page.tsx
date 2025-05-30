// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Autosuggest, AutosuggestProps, Box, SpaceBetween } from '~components';

const empty = <span>Nothing found</span>;
const options = [
  { value: 'Option 0', tags: ['tag1', 'tag2'], filteringTags: ['bla', 'opt', 'blauer'], description: 'description1' },
  { value: 'Option 1', labelTag: 'This is a label tag' },
  { value: 'Option 2' },
  { value: 'Option', description: 'description2' },
];
const enteredTextLabel = (value: string) => `Use: ${value}`;
export default function AutosuggestPage() {
  const [value, setValue] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const [hasOptions, setHasOptions] = useState(true);
  const ref = useRef<AutosuggestProps.Ref>(null);
  return (
    <Box margin="m">
      <h1>Simple autosuggest</h1>
      <SpaceBetween size="l">
        <Autosuggest
          ref={ref}
          value={value}
          readOnly={readOnly}
          options={hasOptions ? options : []}
          onChange={event => setValue(event.detail.value)}
          enteredTextLabel={enteredTextLabel}
          ariaLabel={'simple autosuggest'}
          selectedAriaLabel="Selected"
          empty={empty}
          filteringResultsText={matchesCount => `${matchesCount} items`}
        />

        <Box>
          <button id="remove-options" onClick={() => setHasOptions(false)}>
            set empty options
          </button>
          <button id="set-read-only" onClick={() => setReadOnly(true)}>
            set read only
          </button>
          <button onClick={() => ref.current?.focus()}>focus</button>
        </Box>
      </SpaceBetween>
    </Box>
  );
}
