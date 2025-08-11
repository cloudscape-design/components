// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
'use client';
import React, { Ref } from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { TimeInputProps } from './interfaces.js';
import InternalTimeInput from './internal.js';

export { TimeInputProps };

const TimeInput = React.forwardRef(
  (
    { format = 'hh:mm:ss', use24Hour = true, autoComplete = true, ...props }: TimeInputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const baseComponentProps = useBaseComponent('TimeInput', {
      props: {
        autoFocus: props.autoFocus,
        disableBrowserAutocorrect: props.disableBrowserAutocorrect,
        format,
        readOnly: props.readOnly,
        use24Hour,
      },
    });
    return (
      <InternalTimeInput
        format={format}
        use24Hour={use24Hour}
        autoComplete={autoComplete}
        {...props}
        {...baseComponentProps}
        ref={ref}
      />
    );
  }
);

applyDisplayName(TimeInput, 'TimeInput');

export default TimeInput;
