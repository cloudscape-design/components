// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption, OptionDefinition, OptionGroup } from '../interfaces';

type SearchableField = 'value' | 'label' | 'description' | 'labelTag';
type SearchableTagField = 'tags' | 'filteringTags';

const searchableFields: SearchableField[] = ['value', 'label', 'description', 'labelTag'];

export const matchesString = (value: string | undefined, searchText: string, strictMatching: boolean): boolean => {
  if (!value) {
    return false;
  }
  const index = value.toLowerCase().indexOf(searchText);
  return strictMatching ? index === 0 : index > -1;
};

const matchesSingleOption = (dropdownOption: DropdownOption, text: string, strictMatching: boolean): boolean => {
  const searchText = text.toLowerCase();

  const option: OptionDefinition = dropdownOption.option;
  const searchStrFields = (attr: SearchableField) => matchesString(option[attr], searchText, strictMatching);
  const searchTagsFields = (attr: SearchableTagField) =>
    option[attr]?.some(value => matchesString(value, searchText, strictMatching));

  const searchableTagFields: SearchableTagField[] = ['tags'];
  if (!strictMatching) {
    searchableTagFields.push('filteringTags');
  }

  return searchableFields.some(searchStrFields) || searchableTagFields.some(searchTagsFields);
};

export const filterOptions = (
  options: ReadonlyArray<DropdownOption>,
  searchText: string,
  strictMatching = false
): ReadonlyArray<DropdownOption> => {
  if (searchText === '') {
    return options;
  }

  let currentGroup: DropdownOption | null = null;
  let parentMatched = false;
  return options.reduce<DropdownOption[]>((acc, option) => {
    if (option.type === 'parent') {
      parentMatched = false;
      currentGroup = option;
      if (matchesSingleOption(option, searchText, strictMatching)) {
        parentMatched = true;
        acc.push(currentGroup);
      }
      return acc;
    }
    if (option.type !== 'child') {
      currentGroup = null;
      parentMatched = false;
    }
    if (parentMatched) {
      acc.push(option);
    } else if (matchesSingleOption(option, searchText, strictMatching)) {
      if (currentGroup) {
        acc.push(currentGroup);
        currentGroup = null;
      }
      acc.push(option);
    }
    return acc;
  }, []);
};

export const isInteractive = (option?: DropdownOption) => !!option && !option.disabled && option.type !== 'parent';

export const isGroupInteractive = (option?: DropdownOption) => !!option && !option.disabled;

export const isGroup = (option?: OptionDefinition | OptionGroup): option is OptionGroup =>
  !!option && 'options' in option;
