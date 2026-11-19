// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import InternalInput, { InternalInputProps } from '../input/internal';

import styles from './styles.css.js';

export interface ButtonDropdownFilterProps extends Omit<InternalInputProps, 'type'> {
  ref?: React.Ref<HTMLInputElement>;
}

const ButtonDropdownFilter = React.forwardRef((props: ButtonDropdownFilterProps, ref: React.Ref<HTMLInputElement>) => {
  return (
    <div className={styles.filter}>
      <InternalInput
        ref={ref}
        type="visualSearch"
        autoComplete={false}
        disableBrowserAutocorrect={true}
        invalid={false}
        __noBorderRadius={true}
        {...props}
        nativeInputAttributes={{
          'aria-expanded': true,
          'aria-haspopup': true,
          role: 'combobox',
          autoCorrect: 'off',
          autoCapitalize: 'off',
          ...props.nativeInputAttributes,
        }}
        __skipNativeAttributesWarnings={true}
      />
    </div>
  );
});

export default ButtonDropdownFilter;
