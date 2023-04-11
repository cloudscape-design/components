// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef, useEffect, useRef, useState } from 'react';
import { FileUploadProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import { FileOption } from './file-option';
import { ButtonProps } from '../button/interfaces';
import InternalSpaceBetween from '../space-between/internal';
import styles from './styles.css.js';
import tokenListStyles from '../internal/components/token-list/styles.css.js';
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
import { ConstraintText, FormFieldError } from '../form-field/internal';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { joinStrings } from '../internal/utils/strings';

type InternalFileUploadProps = SomeRequired<
  FileUploadProps,
  'multiple' | 'showFileSize' | 'showFileLastModified' | 'showFileThumbnail'
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
  externalRef: ForwardedRef<ButtonProps.Ref>
) {
  const baseProps = getBaseProps(restProps);
  const metadata = { showFileSize, showFileLastModified, showFileThumbnail };

  const errorId = useUniqueId('error-');
  const fileErrorId = useUniqueId('file-error-');
  const constraintTextId = useUniqueId('constraint-text-');

  const fileInputRef = useRef<ButtonProps.Ref>(null);
  const ref = useMergeRefs(fileInputRef, externalRef);

  const [removedFileIndex, setRemovedFileIndex] = useState<null | number>(null);
  const [removedLastFile, setRemovedLastFile] = useState(false);

  checkControlled('FileUpload', 'value', value, 'onChange', onChange);

  if (!multiple && value.length > 1) {
    warnOnce('FileUpload', 'Value must be an array of size 0 or 1 when `multiple=false`.');
  }

  const handleFilesChange = (newFiles: File[]) => {
    const newValue = multiple ? [...value, ...newFiles] : newFiles[0] ? newFiles : [...value];
    fireNonCancelableEvent(onChange, { value: newValue });
  };

  const onFileRemove = (removeFileIndex: number) => {
    const newValue = value.filter((_, fileIndex) => fileIndex !== removeFileIndex);
    fireNonCancelableEvent(onChange, { value: newValue });
    setRemovedFileIndex(removeFileIndex);
    setRemovedLastFile(value.length === 1);
  };

  useEffect(() => {
    if (removedLastFile) {
      fileInputRef.current?.focus();
    }
  }, [removedLastFile]);

  const isDropzoneVisible = useDropzoneVisible();

  const ariaDescribedBy = joinStrings(
    restProps.ariaDescribedby,
    errorText ? errorId : undefined,
    constraintText ? constraintTextId : undefined
  );

  const hasError = !!errorText ?? (fileErrors && fileErrors.filter(Boolean).length > 0);
  const invalid = restProps.invalid ?? hasError;

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
          ariaDescribedby={ariaDescribedBy}
          invalid={invalid}
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
            <ConstraintText id={constraintTextId} hasError={!!errorText}>
              {constraintText}
            </ConstraintText>
          )}
        </div>
      )}

      {/* When multiple=`false` the component can have at most one file selected. Using a list representation is unnecessary in that case. */}
      {!multiple && value.length === 1 ? (
        <div
          role="group"
          aria-label={value[0].name}
          aria-describedby={fileErrors?.[0] ? fileErrorId : undefined}
          // Adding the 'list-item' class for test-utils method to find the item w/o the need in providing `multiple` argument.
          className={tokenListStyles['list-item']}
        >
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
            'aria-describedby': fileErrors?.[fileIndex] ? `${fileErrorId}-${fileIndex}` : undefined,
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
          limit={tokenLimit}
          i18nStrings={{
            limitShowFewer: i18nStrings.limitShowFewer,
            limitShowMore: i18nStrings.limitShowMore,
          }}
          removedItemIndex={removedFileIndex}
        />
      ) : null}
    </InternalSpaceBetween>
  );
}
