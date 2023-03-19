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
import { warnOnce } from '../internal/logging';

type InternalFileUploadProps = SomeRequired<
  FileUploadProps,
  'multiple' | 'showFileType' | 'showFileSize' | 'showFileLastModified' | 'showFileThumbnail' | 'i18nStrings'
> &
  InternalBaseComponentProps;

export default React.forwardRef(InternalFileUpload);

function InternalFileUpload(
  {
    accept,
    ariaRequired,
    multiple,
    onChange,
    value,
    limit,
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

  if (!multiple && value.length > 1) {
    warnOnce('FileUpload', 'Value must be an array of size 0 or 1 when `multiple=false`.');
  }

  const handleButtonClick = () => fileInputRef.current?.click();

  const handleChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      const currentFiles = [...value];
      const newFiles = target.files ? Array.from(target.files) : [];
      const newValue = multiple ? [...currentFiles, ...newFiles] : newFiles[0] ? newFiles : currentFiles;
      fireNonCancelableEvent(onChange, { value: newValue });
    },
    [value, multiple, onChange]
  );

  const handleDismiss = useCallback(
    (index: number) => {
      if (onChange) {
        fireNonCancelableEvent(onChange, { value: value.filter((_, fileIndex) => fileIndex !== index) });
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
      const files = [...value];
      const updated = new File([files[editingFileIndex]], editingFileName!);
      files.splice(editingFileIndex, 1, updated);
      fireNonCancelableEvent(onChange, { value: files });
      setEditingFileName(null);
      setEditingFileIndex(-1);
    },
    onNameEditCancel: () => {
      setEditingFileName(null);
      setEditingFileIndex(-1);
    },
  };

  const nativeAttributes: Record<string, any> = {
    'aria-labelledby': formFieldContext.ariaLabelledby,
    'aria-describedby': formFieldContext.ariaDescribedby,
  };
  if (formFieldContext.invalid) {
    nativeAttributes['aria-invalid'] = true;
  }
  if (ariaRequired) {
    nativeAttributes['aria-required'] = true;
  }

  return (
    <InternalSpaceBetween
      {...baseProps}
      size="xs"
      className={clsx(baseProps.className, styles.root)}
      __internalRootRef={__internalRootRef}
    >
      <div>
        <InternalButton
          ref={ref}
          id={controlId}
          iconName="upload"
          formAction="none"
          onClick={handleButtonClick}
          className={styles['upload-button']}
          __nativeAttributes={nativeAttributes}
        >
          {i18nStrings.uploadButtonText(multiple)}
        </InternalButton>

        <input
          ref={fileInputRef}
          type="file"
          hidden={true}
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className={styles['upload-input']}
        />
      </div>

      {value.length > 0 ? (
        <AbstractTokenGroup
          alignment="vertical"
          items={multiple ? value : value.slice(0, 1)}
          getItemAttributes={(_, itemIndex) => ({
            dismissLabel: i18nStrings.removeFileAriaLabel,
            showDismiss: itemIndex !== editingFileIndex,
          })}
          renderItem={(item, itemIndex) => (
            <FileOption
              file={item}
              metadata={metadata}
              i18nStrings={i18nStrings}
              {...editingProps}
              editingFileName={itemIndex === editingFileIndex ? editingProps.editingFileName : null}
            />
          )}
          onDismiss={index => handleDismiss(index)}
          limit={limit}
          i18nStrings={{
            limitShowFewer: i18nStrings.limitShowFewer,
            limitShowMore: i18nStrings.limitShowMore,
          }}
        />
      ) : null}
    </InternalSpaceBetween>
  );
}
