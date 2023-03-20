// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { ChangeEvent, ForwardedRef, useEffect, useRef, useState } from 'react';
import { FileUploadProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';

import { FileOption } from './file-option';
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
import GenericTokenGroup from '../token-group/generic-token-group';
import { warnOnce } from '../internal/logging';
import InternalIcon from '../icon/internal';
import InternalBox from '../box/internal';

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
    fileProps,
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
  const baseProps = getBaseProps(restProps);
  const metadata = { showFileType, showFileSize, showFileLastModified, showFileThumbnail };
  const selfControlId = useUniqueId('input');
  const formFieldContext = useFormFieldContext(restProps);
  const controlId = formFieldContext.controlId ?? selfControlId;

  checkControlled('FileUpload', 'value', value, 'onChange', onChange);

  if (!multiple && value.length > 1) {
    warnOnce('FileUpload', 'Value must be an array of size 0 or 1 when `multiple=false`.');
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onUploadButtonClick = () => fileInputRef.current?.click();

  const onFileInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const currentFiles = [...value];
    const newFiles = target.files ? Array.from(target.files) : [];
    const newValue = multiple ? [...currentFiles, ...newFiles] : newFiles[0] ? newFiles : currentFiles;
    fireNonCancelableEvent(onChange, { value: newValue });
  };

  const onFileRemove = (removeFileIndex: number) => {
    fireNonCancelableEvent(onChange, { value: value.filter((_, fileIndex) => fileIndex !== removeFileIndex) });
  };

  const onFileNameUpdate = (fileIndex: number, fileName: string) => {
    if (value[fileIndex].name === fileName) {
      return;
    }
    const files = [...value];
    const updated = new File([files[fileIndex]], fileName);
    files.splice(fileIndex, 1, updated);
    fireNonCancelableEvent(onChange, { value: files });
  };

  const [fileNameEditing, setFileNameEditing] = useState(new Map<number, string>());

  const getFileAttributes = (fileIndex: number) => {
    return !fileNameEditing.has(fileIndex)
      ? {
          dismiss: {
            label: i18nStrings.removeFileAriaLabel,
            onDismiss: () => onFileRemove(fileIndex),
          },
        }
      : {};
  };

  const getFileNameEditingProps = (fileIndex: number) => {
    const fileName = fileNameEditing.get(fileIndex) ?? value[fileIndex].name;
    return {
      isEditing: fileNameEditing.has(fileIndex),
      value: fileName,
      onActivate: () => setFileNameEditing(new Map([[fileIndex, value[fileIndex].name]])),
      onChange: (fileName: string) => setFileNameEditing(new Map([[fileIndex, fileName]])),
      onSubmit: () => {
        onFileNameUpdate(fileIndex, fileName);
        setFileNameEditing(new Map());
      },
      onCancel: () => setFileNameEditing(new Map()),
    };
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

  const [isDropzoneShown, setDropzoneShown] = useState(false);
  const [isDropzoneHovered, setDropzoneHovered] = useState(false);

  useEffect(() => {
    let dragTimer: any = null;

    const onDragOver = (event: DragEvent) => {
      const dt = event.dataTransfer;
      if (dt && dt.types && dt.types.indexOf('Files') !== -1) {
        setDropzoneShown(true);
        window.clearTimeout(dragTimer);
      }
    };

    const onDragLeave = () => {
      dragTimer = setTimeout(() => {
        setDropzoneShown(false);
      }, 25);
    };

    document.addEventListener('dragover', onDragOver);
    document.addEventListener('dragleave', onDragLeave);
    document.addEventListener('drop', onDragLeave);

    return () => {
      clearTimeout(dragTimer);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('dragleave', onDragLeave);
      document.removeEventListener('drop', onDragLeave);
    };
  }, []);

  return (
    <InternalSpaceBetween
      {...baseProps}
      size="xs"
      className={clsx(baseProps.className, styles.root)}
      __internalRootRef={__internalRootRef}
    >
      <div>
        <input
          ref={fileInputRef}
          type="file"
          hidden={true}
          multiple={multiple}
          accept={accept}
          onChange={onFileInputChange}
          className={styles['upload-input']}
        />

        {isDropzoneShown ? (
          <div
            className={clsx(styles.dropzone, isDropzoneHovered && styles['dropzone-hovered'])}
            onDragOver={event => {
              setDropzoneHovered(true);
              event.preventDefault();
            }}
            onDragLeave={() => setDropzoneHovered(false)}
            onDrop={event => {
              // Prevent default behavior (Prevent file from being opened)
              event.preventDefault();

              const newFiles: File[] = [];

              if (event.dataTransfer.items) {
                // Use DataTransferItemList interface to access the file(s)
                [...(event.dataTransfer.items as any)].forEach(item => {
                  // If dropped items aren't files, reject them
                  if (item.kind === 'file') {
                    newFiles.push(item.getAsFile());
                  }
                });
              } else {
                // Use DataTransfer interface to access the file(s)
                [...(event.dataTransfer.files as any)].forEach(file => {
                  newFiles.push(file);
                });
              }

              const currentFiles = [...value];
              const newValue = multiple ? [...currentFiles, ...newFiles] : newFiles[0] ? newFiles : currentFiles;
              fireNonCancelableEvent(onChange, { value: newValue });

              setDropzoneHovered(false);
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <InternalBox color={isDropzoneHovered ? 'text-status-info' : 'text-body-secondary'}>
                <InternalIcon name="file" />
              </InternalBox>
              <InternalBox color={isDropzoneHovered ? 'text-status-info' : 'text-body-secondary'}>
                Drop files to upload
              </InternalBox>
            </div>
          </div>
        ) : (
          <InternalButton
            ref={ref}
            id={controlId}
            iconName="upload"
            formAction="none"
            onClick={onUploadButtonClick}
            className={styles['upload-button']}
            __nativeAttributes={nativeAttributes}
          >
            {i18nStrings.uploadButtonText(multiple)}
          </InternalButton>
        )}
      </div>

      {value.length > 0 ? (
        <GenericTokenGroup
          alignment="vertical"
          items={value}
          getItemAttributes={(_, fileIndex) => getFileAttributes(fileIndex)}
          renderItem={(file, fileIndex) => (
            <FileOption
              file={file}
              metadata={metadata}
              fileProps={fileProps?.[fileIndex]}
              i18nStrings={i18nStrings}
              nameEditing={getFileNameEditingProps(fileIndex)}
            />
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
