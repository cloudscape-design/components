// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useLayoutEffect, useState } from 'react';

import { useMergeRefs } from '@cloudscape-design/component-toolkit/internal';

import InternalInput from '../../../input/internal.js';
import { getBaseProps } from '../../base-component/index.js';
import { useFormFieldContext } from '../../context/form-field-context.js';
import { fireCancelableEvent, fireNonCancelableEvent } from '../../events/index.js';
import { MaskedInputProps } from './interfaces.js';
import useMask from './use-mask.js';
import MaskFormat from './utils/mask-format.js';

const MaskedInput = React.forwardRef(
  (
    {
      value,
      onBlur,
      onChange,
      onKeyDown,
      mask,
      autofix = false,
      disableAutocompleteOnBlur = false,
      showUnmaskedValue = false,
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
      onChange: (value: string) => !rest.readOnly && fireNonCancelableEvent(onChange, { value }),
      onKeyDown: (event: CustomEvent) =>
        !rest.readOnly && onKeyDown && fireCancelableEvent(onKeyDown, event.detail, event),
      onBlur: () => fireNonCancelableEvent(onBlur),
      setPosition: setCursorPosition,
    });

    const inputProps = {
      ...rest,
      ...baseProps,
      ...formFieldContext,
      ...maskProps,
      value: showUnmaskedValue ? value : maskProps.value,
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
