// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { Badge, Box, Checkbox, SpaceBetween } from '~components';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    empty?: boolean;
    hideEnteredTextOption?: boolean;
    showMatchesCount?: boolean;
  }>
>;

const options: AutosuggestProps.Option[] = [
  { value: '_orange_', label: 'Orange', tags: ['sweet'] },
  { value: '_banana_', label: 'Banana', tags: ['sweet'] },
  { value: '_apple_', label: 'Apple' },
  { value: '_sweet_apple_', label: 'Apple (sweet)', tags: ['sweet'] },
  { value: '_pineapple_', label: 'Pineapple XL', description: 'pine+apple' },
];
const enteredTextLabel = (value: string) => `Search for: "${value}"`;

// This performs a simple fuzzy-search to illustrate how options order can change when searching,
// which can be helpful to increase the search quality.
function findMatchedOptions(options: AutosuggestProps.Option[], searchText: string) {
  searchText = searchText.toLowerCase();

  const getOptionMatchScore = (option: AutosuggestProps.Option) => [
    getPropertyMatchScore(option.label),
    getPropertyMatchScore(option.description),
    getPropertyMatchScore((option.tags ?? []).join(' ')),
  ];

  const getPropertyMatchScore = (property = '') => {
    property = property.toLowerCase();
    return property.indexOf(searchText) === -1
      ? Number.MAX_VALUE
      : property.indexOf(searchText) + (property.length - searchText.length);
  };

  return (
    [...options]
      // Remove not matched.
      .filter(o => getOptionMatchScore(o).some(score => score !== Number.MAX_VALUE))
      // Sort the rest by best match using fuzzy-search with priorities.
      .sort((a, b) => {
        const aScore = getOptionMatchScore(a);
        const bScore = getOptionMatchScore(b);
        for (let index = 0; index < Math.min(aScore.length, bScore.length); index++) {
          if (aScore[index] !== bScore[index]) {
            return aScore[index] - bScore[index];
          }
        }
        return 0;
      })
  );
}

export default function AutosuggestPage() {
  const {
    urlParams: { empty = false, hideEnteredTextOption = true, showMatchesCount = true },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const [searchText, setSearchText] = useState('');
  const [selection, setSelection] = useState<null | string | AutosuggestProps.Option>(null);
  const matchedOptions = findMatchedOptions(options, searchText);

  // The entered text option indicates that the search text is selectable either from the options dropdown
  // or by pressing Enter. This can be used e.g. to navigate the user to a search page.
  const onSelectWithFreeSearch: AutosuggestProps['onSelect'] = ({ detail }) => {
    if (detail.selectedOption) {
      setSelection(detail.selectedOption);
      setSearchText('');
    } else {
      setSelection(detail.value);
      setSearchText('');
    }
  };

  // When the search text is not selectable, pressing Enter from the input can be used to select the best
  // matched (first) option instead.
  const onSelectWithAutoMatch: AutosuggestProps['onSelect'] = ({ detail }) => {
    const selectedOption = detail.selectedOption ?? matchedOptions[0];
    if (selectedOption) {
      setSelection(selectedOption);
      setSearchText('');
    }
  };

  const onSelect = hideEnteredTextOption ? onSelectWithAutoMatch : onSelectWithFreeSearch;

  return (
    <SimplePage title="Search" subtitle="This demo shows how Autosuggest can be used as a search input">
      <SpaceBetween size="m">
        <SpaceBetween size="s" direction="horizontal">
          <Checkbox checked={empty} onChange={({ detail }) => setUrlParams({ empty: detail.checked })}>
            Empty
          </Checkbox>
          <Checkbox
            checked={hideEnteredTextOption}
            onChange={({ detail }) => setUrlParams({ hideEnteredTextOption: detail.checked })}
          >
            Hide entered text option
          </Checkbox>
          <Checkbox
            checked={showMatchesCount}
            onChange={({ detail }) => setUrlParams({ showMatchesCount: detail.checked })}
          >
            Show matches count
          </Checkbox>
        </SpaceBetween>

        <Autosuggest
          value={searchText}
          options={empty ? [] : matchedOptions}
          onChange={event => setSearchText(event.detail.value)}
          onSelect={onSelect}
          enteredTextLabel={enteredTextLabel}
          ariaLabel="website search"
          selectedAriaLabel="selected"
          empty="No suggestions"
          hideEnteredTextOption={hideEnteredTextOption}
          filteringResultsText={
            showMatchesCount
              ? () => (matchedOptions.length ? `${matchedOptions.length} items` : `No matches`)
              : undefined
          }
        />

        <Box>
          {selection && typeof selection === 'object' ? (
            <Badge color="green">
              {selection?.label} ({selection?.value})
            </Badge>
          ) : typeof selection === 'string' ? (
            <Badge color="grey">Search for &quot;{selection}&quot;</Badge>
          ) : (
            'Nothing selected'
          )}
        </Box>
      </SpaceBetween>
    </SimplePage>
  );
}
