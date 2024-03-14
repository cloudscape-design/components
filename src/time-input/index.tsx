// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref } from 'react';

import { TimeInputProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalTimeInput from './internal';

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
