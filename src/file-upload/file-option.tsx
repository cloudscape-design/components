// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { LegacyRef, useEffect, useRef } from 'react';

import { FileMetadata, FileUploadProps } from './interfaces';
import InternalBox from '../box/internal';
import InternalSpaceBetween from '../space-between/internal';
import InternalIcon from '../icon/internal';
import styles from './styles.css.js';
import { formatFileLastModified, formatFileSize } from './formatters';
import InternalButton from '../button/internal';
import InternalInput from '../input/internal';
import clsx from 'clsx';
import { KeyCode } from '../internal/keycode';
import { BaseKeyDetail } from '../internal/events';

export interface FileNameEditingProps {
  editingFileName: null | string;
  onNameChange: (fileName: string) => void;
  onNameEditStart: (file: File) => void;
  onNameEditSubmit: () => void;
  onNameEditCancel: () => void;
}

interface FileOptionProps extends FileNameEditingProps {
  metadata: FileMetadata;
  file: File;
  i18nStrings: FileUploadProps.I18nStrings;
}

export const FileOption: React.FC<FileOptionProps> = ({
  metadata,
  file,
  i18nStrings,
  editingFileName,
  onNameChange,
  onNameEditStart,
  onNameEditSubmit,
  onNameEditCancel,
}: FileOptionProps) => {
  const thumbnail: LegacyRef<HTMLImageElement> = useRef(null);

  const isImage = !!file.type && file.type.split('/')[0] === 'image';

  useEffect(() => {
    if (metadata.showFileThumbnail && isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (thumbnail.current && thumbnail.current.src) {
          thumbnail.current.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }, [file, metadata.showFileThumbnail, isImage]);

  const onFileNameEditInputKeyDown = (event: CustomEvent<BaseKeyDetail>) => {
    if (event.detail.keyCode === KeyCode.escape) {
      event.preventDefault();
      onNameEditCancel();
    }
  };

  const isEditing = editingFileName !== null;

  return (
    <InternalBox className={styles['file-option']}>
      <InternalIcon variant="success" name="status-positive" />

      {metadata.showFileThumbnail && isImage && (
        <div className={styles['file-option-thumbnail']}>
          <img className={styles['file-option-thumbnail-image']} alt={file.name} ref={thumbnail} src="" />
        </div>
      )}

      <div className={styles['file-option-metadata']}>
        <InternalSpaceBetween direction="vertical" size="xxxs">
          {
            <div
              className={clsx(styles['file-option-name'], isEditing && styles['file-name-edit-active'])}
              onClick={() => !isEditing && onNameEditStart(file)}
            >
              {isEditing ? (
                <div className={styles['file-option-name-input-container']}>
                  <InternalInput
                    value={editingFileName}
                    onChange={event => onNameChange(event.detail.value)}
                    spellcheck={false}
                    ariaLabel={i18nStrings.editFileNameInputAriaLabel}
                    className={styles['file-option-name-input']}
                    onKeyDown={onFileNameEditInputKeyDown}
                  />
                </div>
              ) : (
                <div className={styles['file-option-name-label']} title={file.name}>
                  {file.name}
                </div>
              )}

              {isEditing ? (
                <InternalSpaceBetween size="xxs" direction="horizontal">
                  <InternalButton
                    formAction="none"
                    iconName="close"
                    variant="inline-icon"
                    className={styles['file-option-name-edit-cancel']}
                    onClick={onNameEditCancel}
                    ariaLabel={i18nStrings.cancelFileNameEditAriaLabel}
                  />
                  <InternalButton
                    formAction="none"
                    iconName="check"
                    variant="inline-icon"
                    className={styles['file-option-name-edit-submit']}
                    onClick={onNameEditSubmit}
                    ariaLabel={i18nStrings.submitFileNameEditAriaLabel}
                  />
                </InternalSpaceBetween>
              ) : (
                <InternalButton
                  __hideFocusOutline={true}
                  formAction="none"
                  iconName="edit"
                  variant="inline-icon"
                  className={styles['file-option-name-edit']}
                  ariaLabel={i18nStrings.activateFileNameEditAriaLabel}
                />
              )}
            </div>
          }
          {metadata.showFileType && file.type && (
            <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-type']}>
              {file.type}
            </InternalBox>
          )}
          {metadata.showFileSize && file.size && (
            <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-size']}>
              {formatFileSize(file.size, i18nStrings)}
            </InternalBox>
          )}
          {metadata.showFileLastModified && file.lastModified && (
            <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-last-modified']}>
              {formatFileLastModified(new Date(file.lastModified), i18nStrings)}
            </InternalBox>
          )}
        </InternalSpaceBetween>
      </div>
    </InternalBox>
  );
};
