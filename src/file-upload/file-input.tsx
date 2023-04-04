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
  ref: ForwardedRef<ButtonProps.Ref>
) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadButtonLabelId = useUniqueId('button-label');
  const selfControlId = useUniqueId('file-input');
  const formFieldContext = useFormFieldContext(restProps);
  const controlId = formFieldContext.controlId ?? selfControlId;

  const onUploadButtonClick = () => fileInputRef.current?.click();

  const onFileInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onChange(target.files ? Array.from(target.files) : []);
  };

  const nativeAttributes: Record<string, any> = {
    'aria-labelledby': joinStrings(formFieldContext.ariaLabelledby, uploadButtonLabelId),
    'aria-describedby': formFieldContext.ariaDescribedby,
  };
  if (formFieldContext.invalid) {
    nativeAttributes['aria-invalid'] = true;
  }
  if (ariaRequired) {
    nativeAttributes['aria-required'] = true;
  }

  useEffect(() => {
    if (window.DataTransfer) {
      const dataTransfer = new DataTransfer();
      for (const file of value) {
        dataTransfer.items.add(file);
      }
      fileInputRef.current!.files = dataTransfer.files;
    }
  }, [value]);

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        hidden={true}
        multiple={multiple}
        accept={accept}
        onChange={onFileInputChange}
        className={styles['upload-input']}
        value=""
      />

      <div className={styles['file-input-container']}>
        <InternalButton
          ref={ref}
          id={controlId}
          iconName="upload"
          formAction="none"
          onClick={onUploadButtonClick}
          className={styles['upload-button']}
          __nativeAttributes={nativeAttributes}
        >
          <span id={uploadButtonLabelId}>{children}</span>
        </InternalButton>
      </div>
    </div>
  );
}
