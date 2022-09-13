// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref } from 'react';

import { DateInputProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalDateInput from './internal';

export { DateInputProps };

const DateInput = React.forwardRef(
  ({ disableBrowserAutocorrect = true, ...props }: DateInputProps, ref: Ref<HTMLInputElement>) => {
    const baseComponentProps = useBaseComponent('DateInput');
    return (
      <InternalDateInput
        {...props}
        {...baseComponentProps}
        disableBrowserAutocorrect={disableBrowserAutocorrect}
        ref={ref}
      />
    );
  }
);

applyDisplayName(DateInput, 'DateInput');

export default DateInput;
