// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { generateUniqueId } from '../../internal/hooks/use-unique-id';

import { AutosuggestItem } from '../interfaces';

type NativeAttributes = Record<string, any>;

export const useDropdownA11yProps = (
  listId: string,
  expanded: boolean,
  inputAriaLabel?: string,
  highlightedOption?: AutosuggestItem
): [NativeAttributes, NativeAttributes] => {
  const itemProps: Record<string, string> = {};
  const inputProps: NativeAttributes = {
    role: 'combobox',
    'aria-autocomplete': 'list',
    'aria-expanded': expanded,
    'aria-controls': listId,
    // 'aria-owns' needed for safari+vo to announce activedescendant content
    'aria-owns': listId,
  };

  if (inputAriaLabel) {
    inputProps['aria-label'] = inputAriaLabel;
  }

  if (highlightedOption) {
    const id = generateUniqueId();
    itemProps.id = id;
    inputProps['aria-activedescendant'] = id;
  }

  return [inputProps, itemProps];
};
