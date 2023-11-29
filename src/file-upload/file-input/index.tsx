// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ChangeEvent, ForwardedRef, useEffect, useRef, useState } from 'react';

import InternalButton from '../../button/internal';
import styles from './styles.css.js';
import { useFormFieldContext } from '../../contexts/form-field';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { FormFieldValidationControlProps } from '../../internal/context/form-field-context';
import { joinStrings } from '../../internal/utils/strings';
import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { FileUploadProps } from '../interfaces';
import useForwardFocus from '../../internal/hooks/forward-focus';
import clsx from 'clsx';

interface FileInputProps extends FormFieldValidationControlProps {
  accept?: string;
  ariaRequired?: boolean;
  multiple: boolean;
  value: readonly File[];
  onChange: (files: File[]) => void;
  children: React.ReactNode;
}

export default React.forwardRef(FileInput);

function FileInput(
  { accept, ariaRequired, multiple, value, onChange, children, ...restProps }: FileInputProps,
  ref: ForwardedRef<FileUploadProps.Ref>
) {
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const uploadButtonLabelId = useUniqueId('upload-button-label');
  const formFieldContext = useFormFieldContext(restProps);
  const selfControlId = useUniqueId('upload-input');
  const controlId = formFieldContext.controlId ?? selfControlId;

  useForwardFocus(ref, uploadInputRef);

  const [isFocused, setIsFocused] = useState(false);

  const onUploadButtonClick = () => uploadInputRef.current?.click();

  const onUploadInputFocus = () => setIsFocused(true);

  const onUploadInputBlur = () => setIsFocused(false);

  const onUploadInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onChange(target.files ? Array.from(target.files) : []);
  };

  const nativeAttributes: Record<string, string | number | boolean | undefined> = {
    'aria-labelledby': joinStrings(formFieldContext.ariaLabelledby, uploadButtonLabelId),
    'aria-describedby': formFieldContext.ariaDescribedby,
  };
  if (formFieldContext.invalid) {
    nativeAttributes['aria-invalid'] = true;
  }
  if (ariaRequired) {
    nativeAttributes['aria-required'] = true;
  }

  // Synchronizing component's value with the native file input state.
  useEffect(() => {
    // The DataTransfer is not available in jsdom.
    if (window.DataTransfer) {
      const dataTransfer = new DataTransfer();
      for (const file of value) {
        dataTransfer.items.add(file);
      }
      uploadInputRef.current!.files = dataTransfer.files;
    }
  }, [value]);

  return (
    <div className={styles['file-input-container']}>
      {/* This is the actual interactive and accessible file-upload element. */}
      {/* It is visually hidden to achieve the desired UX design. */}
      <input
        id={controlId}
        ref={uploadInputRef}
        type="file"
        hidden={false}
        multiple={multiple}
        accept={accept}
        onChange={onUploadInputChange}
        onFocus={onUploadInputFocus}
        onBlur={onUploadInputBlur}
        className={styles['upload-input']}
        {...nativeAttributes}
      />

      {/* The button is decorative. It dispatches clicks to the file input and is ARIA-hidden. */}
      {/* When the input is focused the focus outline is forced on the button. */}
      <InternalButton
        iconName="upload"
        formAction="none"
        onClick={onUploadButtonClick}
        className={clsx(styles['upload-button'], isFocused && styles['force-focus-outline'])}
        __nativeAttributes={{ tabIndex: -1, 'aria-hidden': true }}
      >
        {children}
      </InternalButton>

      {/* The file input needs to be labelled with provided content. Can't use the button because it is ARIA-hidden. */}
      <ScreenreaderOnly id={uploadButtonLabelId}>{children}</ScreenreaderOnly>
    </div>
  );
}
