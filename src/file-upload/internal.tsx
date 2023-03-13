// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ChangeEvent, ForwardedRef, useCallback, useMemo, useRef } from 'react';
import { FileUploadProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import { SelectedFile } from './components/selected-file';
import { SelectedFileList } from './components/selected-file-list';
import { ButtonProps } from '../button/interfaces';
import InternalSpaceBetween from '../space-between/internal';
import InternalButton from '../button/internal';
import InternalFormField from '../form-field/internal';
import styles from './styles.css.js';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';

type InternalFileUploadProps = FileUploadProps & InternalBaseComponentProps;

export default React.forwardRef(InternalFileUpload);

function InternalFileUpload(
  {
    accept = 'text/plain',
    ariaLabel,
    ariaRequired,
    buttonText,
    description,
    disabled,
    errorText,
    fileMetadata,
    constraintText,
    id,
    label,
    multiple = false,
    onChange,
    value,
  }: InternalFileUploadProps,
  ref: ForwardedRef<ButtonProps.Ref>
) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      let newValue = null;
      if (target.files && target.files[0]) {
        newValue = multiple
          ? value instanceof Array
            ? [...value, target.files[0]]
            : [target.files[0]]
          : target.files[0];
      }
      if (onChange) {
        fireNonCancelableEvent(onChange, { value: newValue });
      }
    },
    [value, multiple, onChange]
  );

  const handleDismiss: NonCancelableEventHandler<FileUploadProps.DismissDetail> = useCallback(
    ({ detail }) => {
      const { index, file } = detail;
      let newValue = value;
      if (multiple && value instanceof Array && value[index]) {
        newValue = value.filter((f, i) => f !== file && i !== index);
      }
      if (onChange) {
        fireNonCancelableEvent(onChange, { value: newValue });
      }
    },
    [value, multiple, onChange]
  );

  const selectedFiles = useMemo((): React.ReactNode => {
    if (errorText) {
      return null;
    }
    if (!multiple && value instanceof File) {
      return <SelectedFile file={value} metadata={fileMetadata} multiple={false} />;
    }
    if (multiple && value instanceof Array) {
      return <SelectedFileList fileList={value} metadata={fileMetadata} onDismiss={handleDismiss} />;
    }
  }, [errorText, value, multiple, fileMetadata, handleDismiss]);

  return (
    <InternalSpaceBetween size="xs" className={styles.root}>
      <InternalFormField
        controlId={id}
        label={label}
        description={description}
        errorText={errorText}
        constraintText={constraintText}
      >
        <InternalButton ref={ref} iconName="upload" formAction="none" disabled={disabled} onClick={handleButtonClick}>
          <input
            id={id}
            ref={fileInputRef}
            type="file"
            multiple={false}
            disabled={disabled}
            aria-label={ariaLabel}
            aria-required={ariaRequired ? 'true' : 'false'}
            accept={accept}
            onChange={handleChange}
            hidden={true}
          />
          <span>{buttonText}</span>
        </InternalButton>
      </InternalFormField>
      {selectedFiles}
    </InternalSpaceBetween>
  );
}
