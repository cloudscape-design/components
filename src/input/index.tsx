// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref, useImperativeHandle, useRef } from 'react';
import clsx from 'clsx';

import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { InputProps } from './interfaces';
import InternalInput from './internal';

import styles from './styles.css.js';

export { InputProps };

const Input = React.forwardRef(
  (
    {
      value,
      type = 'text',
      step,
      inputMode,
      autoComplete = true,
      spellcheck,
      disabled,
      readOnly,
      disableBrowserAutocorrect,
      onKeyDown,
      onKeyUp,
      onChange,
      onBlur,
      onFocus,
      ariaRequired,
      name,
      placeholder,
      autoFocus,
      ariaLabel,
      ariaLabelledby,
      ariaDescribedby,
      invalid,
      warning,
      controlId,
      clearAriaLabel,
      ...rest
    }: InputProps,
    ref: Ref<InputProps.Ref>
  ) => {
    const baseComponentProps = useBaseComponent('Input', {
      props: { autoComplete, autoFocus, disableBrowserAutocorrect, inputMode, readOnly, spellcheck, type },
    });
    const baseProps = getBaseProps(rest);

    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(
      ref,
      () => ({
        focus(...args: Parameters<HTMLElement['focus']>) {
          inputRef.current?.focus(...args);
        },
        select() {
          inputRef.current?.select();
        },
      }),
      [inputRef]
    );

    return (
      <InternalInput
        ref={inputRef}
        {...{
          ...baseProps,
          ...baseComponentProps,
          autoComplete,
          ariaLabel,
          ariaRequired,
          autoFocus,
          disabled,
          disableBrowserAutocorrect,
          name,
          onKeyDown,
          onKeyUp,
          onChange,
          onBlur,
          onFocus,
          placeholder,
          readOnly,
          type,
          step,
          inputMode,
          spellcheck,
          value,
          ariaDescribedby,
          ariaLabelledby,
          invalid,
          warning,
          controlId,
          clearAriaLabel,
        }}
        className={clsx(styles.root, baseProps.className)}
        __inheritFormFieldProps={true}
      />
    );
  }
);

applyDisplayName(Input, 'Input');
export default Input;
