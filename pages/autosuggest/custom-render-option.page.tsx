// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import { Autosuggest, AutosuggestProps, Toggle } from '~components';

import AppContext, { AppContextType } from '../app/app-context';
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
type PageContext = React.Context<
  AppContextType<{
    virtualScroll?: boolean;
  }>
>;

export default function AutosuggestPage() {
  const [value, setValue] = useState('');
  const ref = useRef<AutosuggestProps.Ref>(null);

  const renderOption: AutosuggestProps.ItemRenderer = ({ item }) => {
    if (item.type === 'use-entered') {
      return <div>Use-Entered: {item.option.value}</div>;
    } else if (item.type === 'group') {
      return <div>Group: {item.option.value}</div>;
    } else if (item.type === 'item') {
      return <div>Item: {item.option.value}</div>;
    }
    return null;
  };
  const { urlParams, setUrlParams } = React.useContext(AppContext as PageContext);
  const virtualScroll = urlParams.virtualScroll ?? false;

  return (
    <SimplePage
      title="Autosuggest with custom item renderer"
      settings={
        <Toggle
          checked={!!urlParams.virtualScroll}
          onChange={({ detail }) => setUrlParams({ virtualScroll: detail.checked })}
        >
          Virtual Scroll
        </Toggle>
      }
      screenshotArea={{
        style: {
          padding: 10,
        },
      }}
    >
      <div style={{ maxInlineSize: '400px', blockSize: '650px' }}>
        <Autosuggest
          virtualScroll={virtualScroll}
          renderOption={renderOption}
          ref={ref}
          value={value}
          options={options}
          onChange={event => setValue(event.detail.value)}
          placeholder={`Type... ${virtualScroll ? '(virtual)' : ''}`}
          ariaLabel={'simple autosuggest'}
          selectedAriaLabel="Selected"
          empty={empty}
        />
      </div>
    </SimplePage>
  );
}
