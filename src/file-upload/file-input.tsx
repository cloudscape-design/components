// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ChangeEvent, ForwardedRef, useEffect, useRef } from 'react';

import { ButtonProps } from '../button/interfaces';
import InternalButton from '../button/internal';
import styles from './styles.css.js';
import { useFormFieldContext } from '../contexts/form-field';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { FormFieldValidationControlProps } from '../internal/context/form-field-context';
import { joinStrings } from '../internal/utils/strings';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';

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
  externalRef: ForwardedRef<ButtonProps.Ref>
) {
  const uploadInputId = useUniqueId('upload-input');
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const uploadButtonId = useUniqueId('upload-button');
  const uploadButtonRef = useRef<ButtonProps.Ref>(null);
  const formFieldContext = useFormFieldContext(restProps);

  const onUploadButtonClick = () => uploadInputRef.current?.click();

  const onUploadInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onChange(target.files ? Array.from(target.files) : []);
  };

  const nativeAttributes: Record<string, any> = {
    'aria-labelledby': joinStrings(formFieldContext.ariaLabelledby, uploadButtonId, uploadInputId),
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
    if (window.DataTransfer) {
      const dataTransfer = new DataTransfer();
      for (const file of value) {
        dataTransfer.items.add(file);
      }
      uploadInputRef.current!.files = dataTransfer.files;
    }
  }, [value]);

  const ref = useMergeRefs(externalRef, uploadButtonRef);

  return (
    <div className={styles['file-input-container']}>
      <input
        id={uploadInputId}
        ref={uploadInputRef}
        type="file"
        hidden={false}
        multiple={multiple}
        accept={accept}
        onChange={onUploadInputChange}
        className={styles['upload-input']}
        {...nativeAttributes}
      />

      <InternalButton
        id={uploadButtonId}
        ref={ref}
        iconName="upload"
        formAction="none"
        onClick={onUploadButtonClick}
        className={styles['upload-button']}
        __nativeAttributes={{ tabIndex: -1 }}
      >
        {children}
      </InternalButton>
    </div>
  );
}
