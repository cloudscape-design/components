// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { DropdownOption } from '../interfaces';

export function optionKeyExtractor(option: DropdownOption | undefined, index: number) {
  if (option && 'value' in option.option && option.option.value) {
    // prepend with type to have unique ids for "use-entered" and normal options
    return `${option.type}_${option.option.value}`;
  }
  // fallback to index if value does not exist
  return index;
}
