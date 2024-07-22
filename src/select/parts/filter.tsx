// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalInput, { InternalInputProps } from '../../input/internal';
import { SelectProps } from '../interfaces';

import styles from './styles.css.js';

export interface FilterProps extends InternalInputProps {
  ref?: React.Ref<HTMLInputElement>;
  filteringType: SelectProps.FilteringType;
}

const Filter = React.forwardRef(({ filteringType, ...filterProps }: FilterProps, ref: React.Ref<HTMLInputElement>) => {
  if (filteringType === 'none') {
    return null;
  }

  return (
    <InternalInput
      ref={ref}
      type="visualSearch"
      className={styles.filter}
      autoComplete={false}
      disableBrowserAutocorrect={true}
      invalid={false}
      __noBorderRadius={true}
      {...filterProps}
      __nativeAttributes={{
        'aria-expanded': true,
        'aria-haspopup': true,
        role: 'combobox',
        autoCorrect: 'off',
        autoCapitalize: 'off',
        ...filterProps.__nativeAttributes,
      }}
    />
  );
});

export default Filter;
