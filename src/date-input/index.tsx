// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use client';
import React, { Ref } from 'react';

import useBaseComponent from '../internal/hooks/use-base-component/index.js';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { DateInputProps } from './interfaces.js';
import InternalDateInput from './internal.js';

export { DateInputProps };

const DateInput = React.forwardRef((props: DateInputProps, ref: Ref<DateInputProps.Ref>) => {
  const baseComponentProps = useBaseComponent('DateInput', {
    props: { autoFocus: props.autoFocus, readOnly: props.readOnly },
  });
  return <InternalDateInput {...props} {...baseComponentProps} ref={ref} />;
});

applyDisplayName(DateInput, 'DateInput');

export default DateInput;
