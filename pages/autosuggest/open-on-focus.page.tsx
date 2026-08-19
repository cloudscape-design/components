// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Autosuggest, AutosuggestProps, Box, SpaceBetween } from '~components';

const options = [
  { value: 'Option 0', description: 'description1' },
  { value: 'Option 1', labelTag: 'tag' },
  { value: 'Option 2' },
  { value: 'Option 3', description: 'description2' },
];
const enteredTextLabel = (value: string) => `Use: ${value}`;

function StatefulAutosuggest(props: Omit<AutosuggestProps, 'value' | 'onChange'>) {
  const [value, setValue] = useState('');
  return (
    <Autosuggest
      {...props}
      value={value}
      onChange={event => setValue(event.detail.value)}
      options={options}
      enteredTextLabel={enteredTextLabel}
    />
  );
}

export default function AutosuggestOpenOnFocusPage() {
  const ref = useRef<AutosuggestProps.Ref>(null);
  const [refValue, setRefValue] = useState('');

  return (
    <Box margin="m">
      <h1>Autosuggest — openOnFocus</h1>
      <SpaceBetween size="l">
        <Box>
          <h2>Default (openOnFocus=true)</h2>
          <p>Focusing the input opens the dropdown immediately.</p>
          <StatefulAutosuggest ariaLabel="default autosuggest" />
        </Box>

        <Box>
          <h2>openOnFocus=false</h2>
          <p>Focusing the input does NOT open the dropdown. Type or press arrow keys to open it.</p>
          <StatefulAutosuggest ariaLabel="no open on focus" openOnFocus={false} />
        </Box>

        <Box>
          <h2>openOnFocus=false + autoFocus</h2>
          <p>Input receives focus on mount without opening the dropdown.</p>
          <StatefulAutosuggest ariaLabel="autofocus no dropdown" openOnFocus={false} autoFocus={true} />
        </Box>

        <Box>
          <h2>Programmatic focus without dropdown (openOnFocus=false)</h2>
          <Autosuggest
            ref={ref}
            value={refValue}
            onChange={event => setRefValue(event.detail.value)}
            options={options}
            enteredTextLabel={enteredTextLabel}
            ariaLabel="programmatic focus"
            openOnFocus={false}
          />
          <button id="focus-button" onClick={() => ref.current?.focus()}>
            Focus via ref
          </button>
        </Box>
      </SpaceBetween>
    </Box>
  );
}
