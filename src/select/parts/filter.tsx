// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalInput, { InternalInputProps } from '../../input/internal';
import { SelectProps } from '../interfaces';

import styles from './styles.css.js';

export interface FilterProps extends InternalInputProps {
  ref?: React.Ref<HTMLInputElement>;
  filteringType: SelectProps.FilteringType;
  /** Custom controls rendered inline alongside the filter input (renderFilteringActions). */
  filteringActions?: React.ReactNode;
}

const Filter = React.forwardRef(
  ({ filteringType, filteringActions, ...filterProps }: FilterProps, ref: React.Ref<HTMLInputElement>) => {
    if (filteringType === 'none') {
      return null;
    }

    const input = (
      <InternalInput
        ref={ref}
        type="visualSearch"
        className={styles.filter}
        autoComplete={false}
        disableBrowserAutocorrect={true}
        invalid={false}
        __noBorderRadius={true}
        {...filterProps}
        nativeInputAttributes={{
          'aria-expanded': true,
          'aria-haspopup': 'listbox',
          role: 'combobox',
          autoCorrect: 'off',
          autoCapitalize: 'off',
          ...filterProps.nativeInputAttributes,
        }}
        __skipNativeAttributesWarnings={true}
      />
    );

    // Without custom actions, render the input directly so the default filtering DOM is unchanged.
    if ((filteringActions ?? null) === null) {
      return input;
    }

    return (
      <div className={styles['filter-row']}>
        <div className={styles['filter-input']}>{input}</div>
        <div className={styles['filtering-actions']}>{filteringActions}</div>
      </div>
    );
  }
);

export default Filter;
