// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RefObject, useCallback } from 'react';

import { InternalInputProps } from './internal';

export const useSearchProps = (
  type: string,
  disabled: boolean | undefined,
  readOnly: boolean | undefined,
  value: string,
  inputRef: RefObject<HTMLInputElement>,
  onChange: (value: string) => void
) => {
  const searchProps: Partial<InternalInputProps> = {};
  const handleIconClick = useCallback(() => {
    inputRef.current?.focus();
    onChange('');
  }, [inputRef, onChange]);
  if (type === 'search' || type === 'visualSearch') {
    searchProps.__leftIcon = 'search';

    if (!disabled && !readOnly && value) {
      searchProps.__rightIcon = 'close';
      searchProps.__onRightIconClick = handleIconClick;
    }
  }
  return searchProps;
};

/**
 * Converts the boolean or string value of the `autoComplete` property to the correct `autocomplete` attribute value.
 */
export const convertAutoComplete = (propertyValue: boolean | string = false): string => {
  if (propertyValue === true) {
    return 'on';
  }
  return propertyValue || 'off';
};
