// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ChangeEvent, ForwardedRef, useCallback, useRef, useState } from 'react';
import { FileUploadProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import { FileNameEditingProps, FileOption } from './file-option';
import { ButtonProps } from '../button/interfaces';
import InternalSpaceBetween from '../space-between/internal';
import InternalButton from '../button/internal';
import styles from './styles.css.js';
import { fireNonCancelableEvent } from '../internal/events';
import { getBaseProps } from '../internal/base-component';
import { useFormFieldContext } from '../contexts/form-field';
import checkControlled from '../internal/hooks/check-controlled';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import clsx from 'clsx';
import { SomeRequired } from '../internal/types';
import AbstractTokenGroup from '../token-group/abstract-token-group';

type InternalFileUploadProps = SomeRequired<
  FileUploadProps,
  'accept' | 'multiple' | 'showFileType' | 'showFileSize' | 'showFileLastModified' | 'showFileThumbnail' | 'i18nStrings'
> &
  InternalBaseComponentProps;

export default React.forwardRef(InternalFileUpload);

function InternalFileUpload(
  {
    accept,
    ariaLabel,
    dismissAriaLabel,
    ariaRequired,
    buttonText,
    disabled,
    multiple,
    onChange,
    value,
    showFileType,
    showFileSize,
    showFileLastModified,
    showFileThumbnail,
    i18nStrings,
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
      if (target.files && target.files[0] && onChange) {
        const newValue = multiple
          ? value instanceof Array
            ? [...value, target.files[0]]
            : [target.files[0]]
          : target.files[0];
        fireNonCancelableEvent(onChange, { value: newValue });
      }
    },
    [value, multiple, onChange]
  );

  const handleDismiss = useCallback(
    (index: number) => {
      if (onChange) {
        const files = value instanceof File ? [value] : Array.isArray(value) ? value : [];
        fireNonCancelableEvent(onChange, { value: files.filter((_, fileIndex) => fileIndex !== index) });
      }
    },
    [value, onChange]
  );

  const metadata = { showFileType, showFileSize, showFileLastModified, showFileThumbnail };

  const [editingFileIndex, setEditingFileIndex] = useState(-1);
  const [editingFileName, setEditingFileName] = useState<null | string>(null);
  const editingProps: FileNameEditingProps = {
    editingFileName,
    onNameChange: (fileName: string) => setEditingFileName(fileName),
    onNameEditStart: (file: File) => {
      const files = value instanceof File ? [value] : Array.isArray(value) ? value : [];
      setEditingFileIndex(files.indexOf(file));
      setEditingFileName(file.name);
    },
    onNameEditSubmit: () => {
      if (value instanceof File) {
        fireNonCancelableEvent(onChange, { value: new File([value], editingFileName!) });
      } else if (Array.isArray(value) && value[editingFileIndex]) {
        const files = [...value];
        const updated = new File([files[editingFileIndex]], editingFileName!);
        files.splice(editingFileIndex, 1, updated);
        fireNonCancelableEvent(onChange, { value: files });
      }
      setEditingFileName(null);
      setEditingFileIndex(-1);
    },
    onNameEditCancel: () => {
      setEditingFileName(null);
      setEditingFileIndex(-1);
    },
  };

  const isEditing = editingFileName !== null;

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
          aria-labelledby={formFieldContext.ariaLabelledby}
          aria-describedby={formFieldContext.ariaDescribedby}
          aria-invalid={formFieldContext.invalid}
          id={controlId}
        />
        <span>{buttonText}</span>
      </InternalButton>

      {value instanceof File ? (
        <div className={styles['single-file-token']}>
          <FileOption file={value} metadata={metadata} multiple={false} i18nStrings={i18nStrings} {...editingProps} />
          {!isEditing && (
            <div className={styles['single-file-token-dismiss']}>
              <InternalButton
                iconName="close"
                variant="icon"
                formAction="none"
                onClick={() => handleDismiss(0)}
                ariaLabel={dismissAriaLabel}
              />
            </div>
          )}
        </div>
      ) : value instanceof Array && value.length > 0 ? (
        <AbstractTokenGroup
          alignment="vertical"
          items={value}
          getItemAttributes={(_, itemIndex) => ({
            dismissLabel: dismissAriaLabel,
            showDismiss: itemIndex !== editingFileIndex,
          })}
          renderItem={(item, itemIndex) => (
            <FileOption
              file={item}
              metadata={metadata}
              multiple={true}
              i18nStrings={i18nStrings}
              {...editingProps}
              editingFileName={itemIndex === editingFileIndex ? editingProps.editingFileName : null}
            />
          )}
          onDismiss={index => handleDismiss(index)}
        />
      ) : null}
    </InternalSpaceBetween>
  );
}
