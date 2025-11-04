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

/**
 * Parses CSS paddingInline value into separate start and end values.
 * Handles both single values ('10px') and shorthand notation ('10px 20px').
 */
export const parsePaddingInline = (
  paddingInline: string | undefined
): { start: string | undefined; end: string | undefined } => {
  if (!paddingInline) {
    return { start: undefined, end: undefined };
  }

  const [start, end = start] = paddingInline.trim().split(/\s+/);
  return { start, end };
};
