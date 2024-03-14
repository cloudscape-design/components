// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref } from 'react';

import { DateInputProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalDateInput from './internal';

export { DateInputProps };

const DateInput = React.forwardRef((props: DateInputProps, ref: Ref<HTMLInputElement>) => {
  const baseComponentProps = useBaseComponent('DateInput', {
    props: { autoFocus: props.autoFocus, readOnly: props.readOnly },
  });
  return <InternalDateInput {...props} {...baseComponentProps} ref={ref} />;
});

applyDisplayName(DateInput, 'DateInput');

export default DateInput;
