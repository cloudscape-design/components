// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Autosuggest, AutosuggestProps, Box, FormField, SpaceBetween } from '~components';

const options = [
  {
    label: 'Option 0',
    value: 'Option 0',
    tags: ['tag1', 'tag2'],
    filteringTags: ['bla', 'opt', 'blauer'],
    description: 'description1',
  },
  { label: 'Option 1', value: 'Option 1', labelTag: 'This is a label tag' },
  { label: 'Option 2', value: 'Option 2' },
  {
    label: 'Group',
    options: [
      { label: 'Option 3', value: 'Option 3', description: 'description3' },
      { label: 'Option 4', value: 'Option 4' },
      { label: 'Option 5', value: 'Option 5' },
    ],
  },
];

const aLotOfOptions: AutosuggestProps.Option[] = [];
for (let i = 0; i < 20; i++) {
  aLotOfOptions.push({ label: `Option ${i}`, value: `Option ${i}`, description: `description ${i}` });
}

const renderOption = (item: AutosuggestProps.AutosuggestItem) => {
  if (item.type === 'use-entered') {
    return <div>Use: {item.option.value}</div>;
  } else if (item.type === 'parent') {
    return <div>{item.option.label}</div>;
  } else {
    return <div>{item.option.label}</div>;
  }
};

export default function CustomRenderOptionPage() {
  const [value, setValue] = useState('');
  const ref = useRef<AutosuggestProps.Ref>(null);
  return (
    <Box margin="m">
      <h1>Custom Render Option</h1>
      <SpaceBetween size="l">
        <FormField label={'Plain-List Autosuggest'}>
          <Autosuggest
            ref={ref}
            value={value}
            options={options}
            onChange={event => setValue(event.detail.value)}
            renderOption={renderOption}
          />
        </FormField>
      </SpaceBetween>
    </Box>
  );
}
