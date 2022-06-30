// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AutosuggestItem } from '../interfaces';

type SearchableFields = 'value' | 'label' | 'description' | 'labelTag';
type SearchableTagFields = 'tags' | 'filteringTags';

const isGroup = (option: AutosuggestItem) => 'type' in option && option.type === 'parent';

const popLastGroup = (options: AutosuggestItem[]) => {
  if (options.length) {
    const lastOption = options[options.length - 1];
    if (isGroup(lastOption)) {
      options.pop();
    }
  }
};

export const filterOptions = (options: AutosuggestItem[], text: string): AutosuggestItem[] => {
  const filteredOptions = options.reduce<AutosuggestItem[]>((filteredIn, option) => {
    if (isGroup(option)) {
      popLastGroup(filteredIn);
      filteredIn.push(option);
    } else if (matchSingleOption(option, text)) {
      filteredIn.push(option);
    }
    return filteredIn;
  }, []);
  popLastGroup(filteredOptions);
  return filteredOptions;
};

const matchSingleOption = (option: AutosuggestItem, text: string): boolean => {
  const searchableFields: SearchableFields[] = ['value', 'label', 'description', 'labelTag'];
  const searchableTagFields: SearchableTagFields[] = ['tags', 'filteringTags'];

  const searchText = text.toLowerCase();

  const searchStrFieldsFn = (attr: SearchableFields) => matchString(option[attr], searchText);
  const searchTagsFieldsFn = (attr: SearchableTagFields) => option[attr]?.some(value => matchString(value, searchText));

  return searchableFields.some(searchStrFieldsFn) || searchableTagFields.some(searchTagsFieldsFn);
};

const matchString = (value: string | undefined, searchText: string) => {
  return value && value.toLowerCase().indexOf(searchText) !== -1;
};
