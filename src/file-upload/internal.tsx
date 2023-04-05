// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef } from 'react';
import { FileUploadProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import { FileOption } from './file-option';
import { ButtonProps } from '../button/interfaces';
import InternalSpaceBetween from '../space-between/internal';
import formFieldStyles from '../form-field/styles.css.js';
import styles from './styles.css.js';
import { fireNonCancelableEvent } from '../internal/events';
import { getBaseProps } from '../internal/base-component';
import checkControlled from '../internal/hooks/check-controlled';
import clsx from 'clsx';
import { SomeRequired } from '../internal/types';
import { warnOnce } from '../internal/logging';
import { Dropzone, useDropzoneVisible } from './dropzone';
import FileInput from './file-input';
import TokenList from '../internal/components/token-list';
import { Token } from '../token-group/token';
import { FormFieldError } from '../form-field/internal';

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
    constraintText,
    errorText: explicitErrorText,
    fileErrors: explicitFileErrors,
    isValueValid,
    ...restProps
  }: InternalFileUploadProps,
  ref: ForwardedRef<ButtonProps.Ref>
) {
  const baseProps = getBaseProps(restProps);
  const metadata = { showFileType, showFileSize, showFileLastModified, showFileThumbnail };

  checkControlled('FileUpload', 'value', value, 'onChange', onChange);

  if (!multiple && value.length > 1) {
    warnOnce('FileUpload', 'Value must be an array of size 0 or 1 when `multiple=false`.');
  }

  const handleFilesChange = (newFiles: File[]) => {
    const currentFiles = [...value];
    const newValue = multiple ? [...currentFiles, ...newFiles] : newFiles[0] ? newFiles : currentFiles;
    fireNonCancelableEvent(onChange, {
      value: newValue,
      valid: isValueValid?.(newValue)?.valid ?? true,
    });
  };

  const onFileRemove = (removeFileIndex: number) => {
    const newValue = value.filter((_, fileIndex) => fileIndex !== removeFileIndex);
    fireNonCancelableEvent(onChange, {
      value: newValue,
      valid: isValueValid?.(newValue)?.valid ?? true,
    });
  };

  const isDropzoneVisible = useDropzoneVisible();

  const validationResult = isValueValid?.(value) ?? { valid: true };
  const errorText = explicitErrorText ?? (!validationResult.valid ? validationResult.errorText : null);
  const fileErrors = explicitFileErrors ?? (!validationResult.valid ? validationResult.fileErrors : null);

  return (
    <InternalSpaceBetween
      {...baseProps}
      size="xs"
      className={clsx(baseProps.className, styles.root)}
      __internalRootRef={__internalRootRef}
    >
      {isDropzoneVisible ? (
        <Dropzone onChange={handleFilesChange}>{i18nStrings.dropzoneText(multiple)}</Dropzone>
      ) : (
        <FileInput
          ref={ref}
          accept={accept}
          ariaRequired={ariaRequired}
          multiple={multiple}
          onChange={handleFilesChange}
          value={value}
          {...restProps}
        >
          {i18nStrings.uploadButtonText(multiple)}
        </FileInput>
      )}

      {(constraintText || errorText) && (
        <div>
          {errorText && (
            <FormFieldError id="TODO: error id" errorIconAriaLabel={i18nStrings?.errorIconAriaLabel}>
              {errorText}
            </FormFieldError>
          )}
          {constraintText && (
            <div
              id="TODO: constraint id"
              className={clsx(formFieldStyles.constraint, errorText && formFieldStyles['constraint-has-error'])}
            >
              {constraintText}
            </div>
          )}
        </div>
      )}

      {/* TODO: different handling for multiple=false */}
      {value.length > 0 ? (
        <TokenList
          alignment="vertical"
          items={value}
          itemAttributes={file => ({ 'aria-label': file.name })}
          renderItem={(file, fileIndex) => (
            <Token
              dismissLabel={i18nStrings.removeFileAriaLabel(file, fileIndex)}
              onDismiss={() => onFileRemove(fileIndex)}
              errorText={fileErrors?.find(([fileWithError]) => fileWithError === file)?.[1]}
            >
              <FileOption file={file} metadata={metadata} i18nStrings={i18nStrings} />
            </Token>
          )}
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
