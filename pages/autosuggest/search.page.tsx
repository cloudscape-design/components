// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';

import { Badge, Box, Checkbox, ExpandableSection, Header, SpaceBetween } from '~components';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';

import AppContext, { AppContextType } from '../app/app-context';

type PageContext = React.Context<
  AppContextType<{
    empty?: boolean;
    showEnteredTextOption?: boolean;
    showMatchesCount?: boolean;
  }>
>;

const options = [
  { value: '__apple__', label: 'Apple' },
  { value: '__orange__', label: 'Orange', tags: ['sweet'] },
  { value: '__banana__', label: 'Banana', tags: ['sweet'] },
  { value: '__pineapple__', label: 'Pineapple', description: 'pine+apple' },
];
const enteredTextLabel = (value: string) => `Use: ${value}`;

export default function AutosuggestPage() {
  const {
    urlParams: { empty = false, showEnteredTextOption = true, showMatchesCount = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const [value, setValue] = useState('');
  const [selection, setSelection] = useState('');
  const ref = useRef<AutosuggestProps.Ref>(null);
  return (
    <Box margin="m">
      <SpaceBetween size="m">
        <Header
          variant="h1"
          description="This demo shows how an updated version of Autosuggest can be used as a search input"
        >
          Search
        </Header>

        <ExpandableSection defaultExpanded={true} headerText="Settings">
          <Checkbox checked={empty} onChange={({ detail }) => setUrlParams({ empty: detail.checked })}>
            Empty
          </Checkbox>
          <Checkbox
            checked={showEnteredTextOption}
            onChange={({ detail }) => setUrlParams({ showEnteredTextOption: detail.checked })}
          >
            Show entered text option
          </Checkbox>
          <Checkbox
            checked={showMatchesCount}
            onChange={({ detail }) => setUrlParams({ showMatchesCount: detail.checked })}
          >
            Show matches count
          </Checkbox>
        </ExpandableSection>

        <Autosuggest
          ref={ref}
          value={value}
          options={empty ? [] : options}
          onChange={event => setValue(event.detail.value)}
          onSelect={event => {
            if (options.some(o => o.value === event.detail.value)) {
              setSelection(event.detail.value);
              setValue('');
            }
          }}
          enteredTextLabel={enteredTextLabel}
          ariaLabel={'simple autosuggest'}
          selectedAriaLabel="Selected"
          empty="No suggestions"
          showEnteredTextOption={showEnteredTextOption}
          filteringResultsText={
            showMatchesCount
              ? matchesCount => {
                  matchesCount = showEnteredTextOption ? matchesCount - 1 : matchesCount;
                  return matchesCount ? `${matchesCount} items` : `No matches`;
                }
              : undefined
          }
        />

        <SpaceBetween size="s" direction="horizontal">
          <Box>Selection: {selection || 'none'}</Box>
          {options.map(option => (
            <Badge key={option.value} color={selection === option.value ? 'green' : 'grey'}>
              {option.label}
            </Badge>
          ))}
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
