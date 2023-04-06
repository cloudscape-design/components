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
import { useUniqueId } from '../internal/hooks/use-unique-id';

type InternalFileUploadProps = SomeRequired<
  FileUploadProps,
  'multiple' | 'showFileSize' | 'showFileLastModified' | 'showFileThumbnail' | 'i18nStrings'
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
    tokenLimit,
    showFileSize,
    showFileLastModified,
    showFileThumbnail,
    i18nStrings,
    __internalRootRef = null,
    constraintText,
    errorText,
    fileErrors,
    ...restProps
  }: InternalFileUploadProps,
  ref: ForwardedRef<ButtonProps.Ref>
) {
  const baseProps = getBaseProps(restProps);
  const metadata = { showFileSize, showFileLastModified, showFileThumbnail };

  checkControlled('FileUpload', 'value', value, 'onChange', onChange);

  if (!multiple && value.length > 1) {
    warnOnce('FileUpload', 'Value must be an array of size 0 or 1 when `multiple=false`.');
  }

  const handleFilesChange = (newFiles: File[]) => {
    const currentFiles = [...value];
    const newValue = multiple ? [...currentFiles, ...newFiles] : newFiles[0] ? newFiles : currentFiles;
    fireNonCancelableEvent(onChange, {
      value: newValue,
    });
  };

  const onFileRemove = (removeFileIndex: number) => {
    const newValue = value.filter((_, fileIndex) => fileIndex !== removeFileIndex);
    fireNonCancelableEvent(onChange, {
      value: newValue,
    });
  };

  const isDropzoneVisible = useDropzoneVisible();

  const errorId = useUniqueId('error-');
  const fileErrorId = useUniqueId('file-error-');
  const constraintTextId = useUniqueId('constraint-text-');

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
          errorId={errorId}
          constraintTextId={constraintTextId}
        >
          {i18nStrings.uploadButtonText(multiple)}
        </FileInput>
      )}

      {(constraintText || errorText) && (
        <div>
          {errorText && (
            <FormFieldError id={errorId} errorIconAriaLabel={i18nStrings?.errorIconAriaLabel}>
              {errorText}
            </FormFieldError>
          )}
          {constraintText && (
            <div
              id={constraintTextId}
              className={clsx(formFieldStyles.constraint, errorText && formFieldStyles['constraint-has-error'])}
            >
              {constraintText}
            </div>
          )}
        </div>
      )}

      {!multiple && value.length === 1 ? (
        <div role="group" aria-label={value[0].name} aria-describedby={fileErrorId}>
          <Token
            dismissLabel={i18nStrings.removeFileAriaLabel(value[0], 0)}
            onDismiss={() => onFileRemove(0)}
            errorText={fileErrors?.[0]}
            errorId={fileErrorId}
          >
            <FileOption file={value[0]} metadata={metadata} i18nStrings={i18nStrings} />
          </Token>
        </div>
      ) : null}

      {(multiple && value.length > 0) || value.length > 1 ? (
        <TokenList
          alignment="vertical"
          items={value}
          itemAttributes={(file, fileIndex) => ({
            'aria-label': file.name,
            'aria-describedby': `${fileErrorId}-${fileIndex}`,
          })}
          renderItem={(file, fileIndex) => (
            <Token
              dismissLabel={i18nStrings.removeFileAriaLabel(file, fileIndex)}
              onDismiss={() => onFileRemove(fileIndex)}
              errorText={fileErrors?.[fileIndex]}
              errorId={`${fileErrorId}-${fileIndex}`}
            >
              <FileOption file={file} metadata={metadata} i18nStrings={i18nStrings} />
            </Token>
          )}
          tokenLimit={tokenLimit}
          i18nStrings={{
            limitShowFewer: i18nStrings.limitShowFewer,
            limitShowMore: i18nStrings.limitShowMore,
          }}
        />
      ) : null}
    </InternalSpaceBetween>
  );
}
