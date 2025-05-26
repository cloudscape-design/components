// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useLayoutEffect, useState } from 'react';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import InternalInput from '../../../input/internal';
import { getBaseProps } from '../../base-component';
import { useFormFieldContext } from '../../context/form-field-context';
import { fireCancelableEvent, fireNonCancelableEvent } from '../../events';
import { MaskedInputProps } from './interfaces';
import useMask from './use-mask';
import MaskFormat from './utils/mask-format';

const MaskedInput = React.forwardRef(
  (
    {
      value,
      staticValue = '',
      onBlur,
      onChange,
      onKeyDown,
      mask,
      autofix = false,
      disableAutocompleteOnBlur = false,
      ...rest
    }: MaskedInputProps,
    ref: Ref<MaskedInputProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const formFieldContext = useFormFieldContext(rest);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = useState<number | null>(null);

    useLayoutEffect(() => {
      if (cursorPosition !== null) {
        inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, [cursorPosition, inputRef]);

    const { onPaste, ...maskProps } = useMask({
      format: new MaskFormat(mask),
      value,
      inputRef,
      autofix,
      disableAutocompleteOnBlur,
      onChange: (value: string) => !rest.readOnly && !rest.disabled && fireNonCancelableEvent(onChange, { value }),
      onKeyDown: (event: CustomEvent) =>
        !rest.readOnly && !rest.disabled && onKeyDown && fireCancelableEvent(onKeyDown, event.detail, event),
      onBlur: () => fireNonCancelableEvent(onBlur),
      setPosition: setCursorPosition,
    });

    const inputProps = {
      ...rest,
      ...baseProps,
      ...formFieldContext,
      ...(staticValue
        ? {
            value: staticValue,
          }
        : maskProps),
    };

    const mergedRef = useMergeRefs(ref, inputRef);

    return (
      <InternalInput
        {...inputProps}
        ref={mergedRef}
        __nativeAttributes={{
          onPaste,
        }}
      />
    );
  }
);

export { MaskedInputProps };
export default MaskedInput;
