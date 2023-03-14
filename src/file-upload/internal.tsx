// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ChangeEvent, ForwardedRef, useCallback, useRef } from 'react';
import { FileUploadProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import { SelectedFile } from './components/selected-file';
import { SelectedFileList } from './components/selected-file-list';
import { ButtonProps } from '../button/interfaces';
import InternalSpaceBetween from '../space-between/internal';
import InternalButton from '../button/internal';
import styles from './styles.css.js';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../contexts/form-field';
import checkControlled from '../internal/hooks/check-controlled';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import clsx from 'clsx';
import { SomeRequired } from '../internal/types';

type InternalFileUploadProps = SomeRequired<FileUploadProps, 'accept' | 'multiple'> & InternalBaseComponentProps;

export default React.forwardRef(InternalFileUpload);

function InternalFileUpload(
  {
    accept,
    ariaLabel,
    ariaRequired,
    buttonText,
    disabled,
    fileMetadata,
    multiple,
    onChange,
    value,
    __internalRootRef = null,
    ...restProps
  }: InternalFileUploadProps,
  ref: ForwardedRef<ButtonProps.Ref>
) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const baseProps = getBaseProps(restProps);
  const formFieldContext = useFormFieldContext(restProps);

  const selfControlId = useUniqueId('input');
  const controlId = formFieldContext.controlId ?? selfControlId;

  checkControlled('FileUpload', 'value', value, 'onChange', onChange);

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

  return (
    <InternalSpaceBetween
      {...baseProps}
      size="xs"
      className={clsx(baseProps.className, styles.root)}
      __internalRootRef={__internalRootRef}
    >
      <InternalButton ref={ref} iconName="upload" formAction="none" disabled={disabled} onClick={handleButtonClick}>
        <input
          ref={fileInputRef}
          type="file"
          multiple={false}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-required={ariaRequired ? 'true' : 'false'}
          accept={accept}
          onChange={handleChange}
          hidden={true}
          {...formFieldContext}
          id={controlId}
        />
        <span>{buttonText}</span>
      </InternalButton>

      {value instanceof File ? (
        <SelectedFile file={value} metadata={fileMetadata} multiple={false} />
      ) : value instanceof Array ? (
        <SelectedFileList fileList={value} metadata={fileMetadata} onDismiss={handleDismiss} />
      ) : null}
    </InternalSpaceBetween>
  );
}
