// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useRef } from 'react';
import clsx from 'clsx';

import MaskedInput from '../internal/components/masked-input';
import { MaskArgs } from '../internal/components/masked-input/utils/mask-format';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { TimeInputProps } from './interfaces';

import styles from './styles.css.js';

const getMaskArgs = (format: string, use24Hour: boolean): MaskArgs => {
  const segments = [
    use24Hour ? { min: 0, max: 23, length: 2 } : { min: 1, max: 12, length: 2 },
    { min: 0, max: 59, length: 2 },
    { min: 0, max: 59, length: 2 },
  ];

  return {
    separator: ':',
    segments: segments.slice(0, format.split(':').length),
  };
};

type InternalTimeInputProps = TimeInputProps & InternalBaseComponentProps;

const InternalTimeInput = React.forwardRef(
  (
    {
      format = 'hh:mm:ss',
      use24Hour = true,
      autoComplete = true,
      __internalRootRef = null,
      ...props
    }: InternalTimeInputProps,
    ref: Ref<HTMLInputElement>
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    useForwardFocus(ref, inputRef);

    const maskArgs = getMaskArgs(format, use24Hour);

    return (
      <MaskedInput
        {...props}
        __internalRootRef={__internalRootRef}
        ref={inputRef}
        className={clsx(styles.root, props.className)}
        autoComplete={autoComplete}
        disableBrowserAutocorrect={true}
        mask={maskArgs}
      />
    );
  }
);

export default InternalTimeInput;
