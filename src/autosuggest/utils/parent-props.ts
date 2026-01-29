// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { AutosuggestRenderItemParentProps } from '../autosuggest-option';
import { AutosuggestItem } from '../interfaces';

/**
 * Generates parent props for autosuggest items based on the current item and last group index.
 * This logic is shared between plain-list and virtual-list implementations.
 */
export const getParentProps = (
  item: AutosuggestItem,
  index: number,
  lastGroupIndex: number,
  virtualIndex?: number
): { parentProps: AutosuggestRenderItemParentProps | undefined; updatedLastGroupIndex: number } => {
  let updatedLastGroupIndex = lastGroupIndex;
  let parentProps: AutosuggestRenderItemParentProps | undefined = undefined;

  if (item.type === 'parent') {
    updatedLastGroupIndex = index;
  } else if (lastGroupIndex !== -1 && !!item.parent) {
    parentProps = {
      index: lastGroupIndex,
      virtualIndex: virtualIndex ?? lastGroupIndex,
      disabled: !!item.parent.disabled,
      option: {
        ...item.parent,
        disabled: !!item.parent.disabled,
        option: item.parent,
        type: 'parent',
      },
    };
  }

  return { parentProps, updatedLastGroupIndex };
};
