// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Autosuggest, AutosuggestProps } from '~components';

import { SimplePage } from '../app/templates';

const empty = <span>Nothing found</span>;
const options = [
  { value: 'Option 0', tags: ['tag1', 'tag2'], filteringTags: ['bla', 'opt', 'blauer'], description: 'description1' },
  { value: 'Option 1', labelTag: 'This is a label tag' },
  { value: 'Option 2' },
  {
    value: 'Option Group',
    description: 'description2',
    options: [
      {
        value: 'value1',
        label: 'label1',
      },
      {
        value: 'value1repeated',
        label: 'label1repeated',
      },
    ],
  },
];
const enteredTextLabel = (value: string) => `Use: ${value}`;
export default function AutosuggestPage() {
  const [value, setValue] = useState('');
  const ref = useRef<AutosuggestProps.Ref>(null);

  const renderOption: AutosuggestProps.AutosuggestOptionItemRenderer = ({ item }) => {
    if (item.type === 'use-entered') {
      return <div>Use-Entered: {item.option.value}</div>;
    } else if (item.type === 'group') {
      return <div>Group: {item.option.value}</div>;
    } else if (item.type === 'item') {
      return <div>Item: {item.option.value}</div>;
    }
    return null;
  };

  return (
    <SimplePage title="Autosuggest with custom item renderer" screenshotArea={{}}>
      <Autosuggest
        renderOption={renderOption}
        ref={ref}
        value={value}
        options={options}
        onChange={event => setValue(event.detail.value)}
        enteredTextLabel={enteredTextLabel}
        ariaLabel={'simple autosuggest'}
        selectedAriaLabel="Selected"
        empty={empty}
        finishedText="Finished"
        filteringResultsText={matchesCount => `${matchesCount} items`}
      />
    </SimplePage>
  );
}
