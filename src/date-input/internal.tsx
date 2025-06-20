// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { Ref } from 'react';
import clsx from 'clsx';

import { CalendarProps } from '../calendar/interfaces.js';
import MaskedInput from '../internal/components/masked-input/index.js';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component/index.js';
import { displayToIso, isoToDisplay } from '../internal/utils/date-time/index.js';
import { DateInputProps } from './interfaces.js';
import { generateMaskArgs } from './utils.js';

import styles from './styles.css.js';

type InternalDateInputProps = DateInputProps &
  InternalBaseComponentProps & {
    granularity?: CalendarProps.Granularity;
  };

const InternalDateInput = React.forwardRef(
  (
    { value, onChange, granularity, __internalRootRef = null, ...props }: InternalDateInputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <MaskedInput
        ref={ref}
        {...props}
        value={isoToDisplay(value || '')}
        onChange={event => fireNonCancelableEvent(onChange, { value: displayToIso(event.detail.value) })}
        className={clsx(styles.root, props.className)}
        mask={generateMaskArgs({ granularity })}
        autofix={true}
        autoComplete={false}
        disableAutocompleteOnBlur={false}
        disableBrowserAutocorrect={true}
        __internalRootRef={__internalRootRef}
      />
    );
  }
);

export default InternalDateInput;
