// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import type { OptionDefinition, OptionGroup } from '../../../types/option';
import { useDebounceCallback } from '../../hooks/use-debounce-callback';
import type { DropdownOption } from '../option/interfaces';
import { filterOptions, isGroup } from '../option/utils/filter-options';
import { isHighlightable } from './utils/option-props';

const isRepeatedChar = (str: string) => str.split('').every(c => c === str[0]);

interface UseTypeAheadProps {
  isEnabled: boolean;
  options: ReadonlyArray<DropdownOption>;
  highlightOption: (option: DropdownOption) => void;
  highlightedOption: OptionDefinition | undefined | null;
  interactiveGroups?: boolean;
  /**
   * Skips disabled options when matching. By default, type-ahead reaches disabled options, like Up and Down, so
   * a screen reader announces their disabled state and reason.
   *
   * Set it when type-ahead selects the match instead of highlighting it. Selecting ignores a disabled option, so
   * without this a disabled match would swallow the key press and the next enabled match would never be selected.
   * Select uses it while it's closed, where typing on the trigger selects an option, as a native select does.
   */
  skipDisabled?: boolean;
}

interface FindMatchingOptionParams {
  options: ReadonlyArray<DropdownOption>;
  searchText: string;
  currentHighlight: OptionDefinition | OptionGroup | undefined | null;
  interactiveGroups: boolean;
  skipDisabled: boolean;
}

function findMatchingOption({
  options,
  searchText,
  currentHighlight,
  interactiveGroups,
  skipDisabled,
}: FindMatchingOptionParams) {
  // Type-ahead matches the options that Up and Down can highlight (`isHighlightable`, shared with the listbox),
  // minus disabled options when `skipDisabled` is set.
  const isMatchable = (option: DropdownOption) =>
    isHighlightable(option, interactiveGroups) && !(skipDisabled && option.disabled);
  const filter = (searchText: string) => filterOptions(options, searchText, true).filter(isMatchable);
  const matchingOptions = filter(searchText);

  if (matchingOptions.length === 1) {
    return matchingOptions[0];
  }

  // Hit the same char over and over, we assume they want to cycle through
  if (currentHighlight && searchText.length > 1 && isRepeatedChar(searchText)) {
    const matchingOptions = filter(searchText[0]);

    if (matchingOptions.length > 0) {
      //handling OptionGroups when interactiveGroups is set
      let active: number = isGroup(currentHighlight)
        ? matchingOptions.map(({ option }) => option).indexOf(currentHighlight)
        : matchingOptions
            .map(({ option }) => (option as OptionDefinition).value)
            .indexOf((currentHighlight as OptionDefinition).value);

      // Pick the next thing (if something with this prefix wasn't selected
      // we'll end up with the first option)
      active += 1;
      active = active % matchingOptions.length;
      return matchingOptions[active];
    }
  }

  // We have multiple things that start with this prefix.  Based on the
  // behavior of native select, this is considered after the repeated case
  if (matchingOptions.length > 0) {
    return matchingOptions[0];
  }
  return null;
}

export function useTypeAhead({
  isEnabled,
  options,
  highlightOption,
  highlightedOption,
  interactiveGroups = false,
  skipDisabled = false,
}: UseTypeAheadProps) {
  const value = useRef('');

  const delayedResetValue = useDebounceCallback(() => (value.current = ''), 500);

  return (event: React.KeyboardEvent) => {
    if (!isEnabled) {
      return;
    }

    const { key } = event;

    if (!key || key.length !== 1) {
      return;
    }

    delayedResetValue();
    const newValue = value.current + key;
    value.current = newValue;

    const nextHighlight = findMatchingOption({
      options,
      searchText: newValue,
      currentHighlight: highlightedOption,
      interactiveGroups,
      skipDisabled,
    });
    if (nextHighlight) {
      highlightOption(nextHighlight);
    }
  };
}
