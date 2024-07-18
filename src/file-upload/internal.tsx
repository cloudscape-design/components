// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import InternalBox from '../box/internal';
import { ButtonProps } from '../button/interfaces';
import { useFormFieldContext } from '../contexts/form-field';
import { ConstraintText, FormFieldError, FormFieldWarning } from '../form-field/internal';
import { getBaseProps } from '../internal/base-component';
import TokenList from '../internal/components/token-list';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { joinStrings } from '../internal/utils/strings';
import InternalSpaceBetween from '../space-between/internal';
import { Token } from '../token-group/token';
import { Dropzone, useDropzoneVisible } from './dropzone';
import FileInput from './file-input';
import { FileOption } from './file-option';
import { FileUploadProps } from './interfaces';

import styles from './styles.css.js';

type InternalFileUploadProps = FileUploadProps & InternalBaseComponentProps;

export default React.forwardRef(InternalFileUpload);

function InternalFileUpload(
  {
    accept,
    ariaRequired,
    multiple = false,
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
    warningText,
    fileErrors,
    fileWarnings,
    ...restProps
  }: InternalFileUploadProps,
  externalRef: ForwardedRef<ButtonProps.Ref>
) {
  const baseProps = getBaseProps(restProps);
  const metadata = { showFileSize, showFileLastModified, showFileThumbnail };

  const errorId = useUniqueId('error-');
  const warningId = useUniqueId('warning-');
  const constraintTextId = useUniqueId('constraint-text-');

  const fileInputRef = useRef<ButtonProps.Ref>(null);
  const ref = useMergeRefs(fileInputRef, externalRef);

  const [removedFileIndex, setRemovedFileIndex] = useState<null | number>(null);

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
    if (value.length === 1) {
      fileInputRef.current?.focus();
    }
  };

  const isDropzoneVisible = useDropzoneVisible(multiple);

  const showWarning = warningText && !errorText;

  if (warningText && errorText) {
    warnOnce('FileUpload', 'Both `errorText` and `warningText` exist. `warningText` will not be shown.');
  }

  const formFieldContext = useFormFieldContext(restProps);
  const ariaDescribedBy = joinStrings(
    restProps.ariaDescribedby ?? formFieldContext.ariaDescribedby,
    errorText ? errorId : undefined,
    showWarning ? warningId : undefined,
    constraintText ? constraintTextId : undefined
  );

  const hasError = Boolean(errorText || fileErrors?.filter(Boolean).length);
  const invalid = restProps.invalid || formFieldContext.invalid || hasError;

  return (
    <InternalSpaceBetween
      {...baseProps}
      size="xs"
      className={clsx(baseProps.className, styles.root)}
      __internalRootRef={__internalRootRef}
    >
      <InternalBox>
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

        {(constraintText || errorText || warningText) && (
          <div className={styles.hints}>
            {errorText && (
              <FormFieldError id={errorId} errorIconAriaLabel={i18nStrings?.errorIconAriaLabel}>
                {errorText}
              </FormFieldError>
            )}
            {showWarning && (
              <FormFieldWarning id={warningId} warningIconAriaLabel={i18nStrings?.warningIconAriaLabel}>
                {warningText}
              </FormFieldWarning>
            )}
            {constraintText && (
              <ConstraintText id={constraintTextId} hasValidationText={!!errorText || !!warningText}>
                {constraintText}
              </ConstraintText>
            )}
          </div>
        )}
      </InternalBox>

      {!multiple && value.length > 0 ? (
        <InternalBox>
          <Token
            ariaLabel={value[0].name}
            dismissLabel={i18nStrings.removeFileAriaLabel(0)}
            onDismiss={() => onFileRemove(0)}
            errorText={fileErrors?.[0]}
            warningText={fileWarnings?.[0]}
            errorIconAriaLabel={i18nStrings.errorIconAriaLabel}
            warningIconAriaLabel={i18nStrings.warningIconAriaLabel}
            data-index={0}
          >
            <FileOption file={value[0]} metadata={metadata} i18nStrings={i18nStrings} />
          </Token>
        </InternalBox>
      ) : null}

      {multiple && value.length > 0 ? (
        <InternalBox>
          <TokenList
            alignment="vertical"
            items={value}
            renderItem={(file, fileIndex) => (
              <Token
                ariaLabel={file.name}
                dismissLabel={i18nStrings.removeFileAriaLabel(fileIndex)}
                onDismiss={() => onFileRemove(fileIndex)}
                errorText={fileErrors?.[fileIndex]}
                warningText={fileWarnings?.[fileIndex]}
                errorIconAriaLabel={i18nStrings.errorIconAriaLabel}
                warningIconAriaLabel={i18nStrings.warningIconAriaLabel}
                data-index={fileIndex}
              >
                <FileOption file={file} metadata={metadata} i18nStrings={i18nStrings} />
              </Token>
            )}
            limit={tokenLimit}
            i18nStrings={{
              limitShowFewer: i18nStrings.limitShowFewer,
              limitShowMore: i18nStrings.limitShowMore,
            }}
            moveFocusNextToIndex={removedFileIndex}
          />
        </InternalBox>
      ) : null}
    </InternalSpaceBetween>
  );
}
