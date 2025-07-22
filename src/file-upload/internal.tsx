// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ForwardedRef, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import InternalBox from '../box/internal';
import { ButtonProps } from '../button/interfaces';
import { useFormFieldContext } from '../contexts/form-field';
import InternalFileDropzone from '../file-dropzone/internal';
import { useFilesDragging } from '../file-dropzone/use-files-dragging';
import InternalFileInput from '../file-input/internal';
import InternalFileTokenGroup from '../file-token-group/internal';
import { ConstraintText, FormFieldError, FormFieldWarning } from '../form-field/internal';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller';
import { joinStrings } from '../internal/utils/strings';
import InternalSpaceBetween from '../space-between/internal';
import { FileUploadProps } from './interfaces';

import fileInputStyles from '../file-input/styles.css.js';
import tokenListStyles from '../internal/components/token-list/styles.css.js';
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
    fileTokenAlignment = 'vertical',
    ...restProps
  }: InternalFileUploadProps,
  externalRef: ForwardedRef<ButtonProps.Ref>
) {
  const [nextFocusIndex, setNextFocusIndex] = useState<null | number>(null);
  const tokenListRef = useListFocusController({
    nextFocusIndex,
    onFocusMoved: target => {
      target.focus();
      setNextFocusIndex(null);
    },
    listItemSelector: `.${tokenListStyles['list-item']}`,
    showMoreSelector: `.${tokenListStyles.toggle}`,
    fallbackSelector: `.${fileInputStyles['file-input']}`,
  });

  const i18n = useInternalI18n('file-upload');
  const baseProps = getBaseProps(restProps);
  const metadata = { showFileSize, showFileLastModified, showFileThumbnail };

  const errorId = useUniqueId('error-');
  const warningId = useUniqueId('warning-');
  const constraintTextId = useUniqueId('constraint-text-');

  const fileInputRef = useRef<ButtonProps.Ref>(null);
  const ref = useMergeRefs(fileInputRef, externalRef);

  checkControlled('FileUpload', 'value', value, 'onChange', onChange);

  if (!multiple && value.length > 1) {
    warnOnce('FileUpload', 'Value must be an array of size 0 or 1 when `multiple=false`.');
  }

  const handleFilesChange = (newFiles: File[]) => {
    const newValue = multiple ? [...value, ...newFiles] : newFiles[0] ? newFiles.slice(0, 1) : [...value];
    fireNonCancelableEvent(onChange, { value: newValue });
  };

  const onFileRemove = (removeFileIndex: number) => {
    const newValue = value.filter((_, fileIndex) => fileIndex !== removeFileIndex);
    fireNonCancelableEvent(onChange, { value: newValue });
    setNextFocusIndex(removeFileIndex);
  };

  const { areFilesDragging } = useFilesDragging();

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
      ref={tokenListRef}
    >
      <InternalBox>
        {areFilesDragging ? (
          <InternalFileDropzone onChange={event => handleFilesChange(event.detail.value)}>
            {i18n('i18nStrings.dropzoneText', i18nStrings?.dropzoneText?.(multiple), format =>
              format({ multiple: `${multiple}` })
            )}
          </InternalFileDropzone>
        ) : (
          <InternalFileInput
            ref={ref}
            accept={accept}
            ariaRequired={ariaRequired}
            multiple={multiple}
            onChange={event => handleFilesChange(event.detail.value)}
            value={value}
            ariaLabelledby={restProps.ariaLabelledby}
            controlId={restProps.controlId}
            ariaDescribedby={ariaDescribedBy}
            invalid={invalid}
          >
            {i18n('i18nStrings.uploadButtonText', i18nStrings?.uploadButtonText?.(multiple), format =>
              format({ multiple: `${multiple}` })
            )}
          </InternalFileInput>
        )}

        {(constraintText || errorText || warningText) && (
          <div className={styles.hints}>
            {errorText && (
              <FormFieldError
                id={errorId}
                errorIconAriaLabel={i18n('i18nStrings.errorIconAriaLabel', i18nStrings?.errorIconAriaLabel)}
              >
                {errorText}
              </FormFieldError>
            )}
            {showWarning && (
              <FormFieldWarning
                id={warningId}
                warningIconAriaLabel={i18n('i18nStrings.warningIconAriaLabel', i18nStrings?.warningIconAriaLabel)}
              >
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

      {value.length > 0 ? (
        <InternalFileTokenGroup
          limit={tokenLimit}
          alignment={fileTokenAlignment}
          items={value.map((file, fileIndex) => ({
            file,
            errorText: fileErrors?.[fileIndex],
            warningText: fileWarnings?.[fileIndex],
          }))}
          showFileLastModified={metadata.showFileLastModified}
          showFileSize={metadata.showFileSize}
          showFileThumbnail={metadata.showFileThumbnail}
          i18nStrings={{
            removeFileAriaLabel: i18n(
              'i18nStrings.removeFileAriaLabel',
              i18nStrings?.removeFileAriaLabel,
              format => fileIndex => format({ fileIndex: fileIndex + 1 })
            ),
            limitShowFewer: i18n('i18nStrings.limitShowFewer', i18nStrings?.limitShowFewer),
            limitShowMore: i18n('i18nStrings.limitShowMore', i18nStrings?.limitShowMore),
            formatFileSize: i18nStrings?.formatFileSize,
            formatFileLastModified: i18nStrings?.formatFileLastModified,
            errorIconAriaLabel: i18n('i18nStrings.errorIconAriaLabel', i18nStrings?.errorIconAriaLabel),
            warningIconAriaLabel: i18n('i18nStrings.warningIconAriaLabel', i18nStrings?.warningIconAriaLabel),
          }}
          onDismiss={event => onFileRemove(event.detail.fileIndex)}
        />
      ) : null}
    </InternalSpaceBetween>
  );
}
