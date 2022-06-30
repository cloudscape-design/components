// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useMemo } from 'react';
import { generateUniqueId, useUniqueId } from '../../../hooks/use-unique-id';

interface UseIds {
  (inputProps: { hasSelectedOption: boolean }): {
    highlightedOptionId?: string;
    selectedOptionId?: string;
    menuId: string;
  };
}

export const useIds: UseIds = ({ hasSelectedOption }) => {
  return {
    selectedOptionId: useMemo(() => (hasSelectedOption ? generateUniqueId() : undefined), [hasSelectedOption]),
    menuId: useUniqueId('option-list'),
  };
};

export const getOptionId = (menuId: string, index: number) => {
  if (index < 0) {
    return undefined;
  }
  return `${menuId}-option-${index}`;
};
