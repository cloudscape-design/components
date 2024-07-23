// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Toggle from '~components/toggle';

import AppContext, { AppContextType } from '../app/app-context';

const empty = <span>Nothing found</span>;

const options = [
  { value: 'Option 0', tags: ['tag1', 'tag2'], filteringTags: ['bla', 'opt'], description: 'description1' },
  { value: 'Option 1', labelTag: 'This is a label tag' },
  { value: 'Option 2' },
  { value: 'Option', description: 'description2' },
];

const enteredTextLabel = (value: string) => `Use: ${value}`;

type PageContext = React.Context<
  AppContextType<{
    hasOptions?: boolean;
    hasEmpty?: boolean;
    hasEnteredTextLabel?: boolean;
  }>
>;

export default function AutosuggestPage() {
  const [value, setValue] = useState('');
  const {
    urlParams: { hasOptions = true, hasEmpty = true, hasEnteredTextLabel = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const ref = useRef<AutosuggestProps.Ref>(null);
  return (
    <div style={{ padding: 10 }}>
      <h1>Hide entered text labebel in autosuggest</h1>
      <Autosuggest
        ref={ref}
        value={value}
        readOnly={false}
        options={hasOptions ? options : []}
        onChange={event => setValue(event.detail.value)}
        enteredTextLabel={enteredTextLabel}
        hideEnteredTextLabel={!hasEnteredTextLabel}
        ariaLabel={'hide entered text label in autosuggest'}
        selectedAriaLabel="Selected"
        empty={hasEmpty ? empty : null}
      />
      <Toggle
        checked={hasEnteredTextLabel}
        onChange={({ detail }) => setUrlParams({ hasEnteredTextLabel: detail.checked })}
      >
        has entered text label
      </Toggle>
      <Toggle checked={hasEmpty} onChange={({ detail }) => setUrlParams({ hasEmpty: detail.checked })}>
        has empty results text
      </Toggle>
      <Toggle checked={hasOptions} onChange={({ detail }) => setUrlParams({ hasOptions: detail.checked })}>
        has options
      </Toggle>
    </div>
  );
}
