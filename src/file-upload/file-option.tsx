// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { LegacyRef, useEffect, useRef, useState } from 'react';

import { FileMetadata, FileUploadProps } from './interfaces';
import InternalBox from '../box/internal';
import InternalSpaceBetween from '../space-between/internal';
import InternalIcon from '../icon/internal';
import styles from './styles.css.js';
import { defaultFileSizeFormat, defaultLastModifiedFormat } from './formatters';
import InternalButton from '../button/internal';
import InternalInput from '../input/internal';
import clsx from 'clsx';
import { KeyCode } from '../internal/keycode';
import { BaseKeyDetail } from '../internal/events';

interface FileNameEditingProps {
  value: string;
  onChange: (fileName: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

interface FileOptionProps {
  metadata: FileMetadata;
  file: File;
  i18nStrings: FileUploadProps.I18nStrings;
  nameEditing?: FileNameEditingProps;
  onNameEditStart: () => void;
}

export const FileOption: React.FC<FileOptionProps> = ({
  metadata,
  file,
  i18nStrings,
  nameEditing,
  onNameEditStart,
}: FileOptionProps) => {
  const thumbnail: LegacyRef<HTMLImageElement> = useRef(null);
  const [isNameEditFocused, setNameEditFocused] = useState(false);
  const fileOptionRef = useRef<HTMLDivElement>(null);

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
      nameEditing?.onCancel();
    }
  };

  const formatFileSize = i18nStrings.formatFileSize ?? defaultFileSizeFormat;
  const formatFileLastModified = i18nStrings.formatFileLastModified ?? defaultLastModifiedFormat;

  return (
    <InternalBox className={styles['file-option']} __internalRootRef={fileOptionRef}>
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
              className={clsx(
                styles['file-option-name'],
                nameEditing && styles['file-name-edit-active'],
                isNameEditFocused && styles['file-name-edit-focused']
              )}
              onClick={() => !nameEditing && onNameEditStart()}
              onFocus={() => setNameEditFocused(true)}
              onBlur={event => {
                setNameEditFocused(false);

                if (nameEditing && !fileOptionRef.current!.contains(event.relatedTarget)) {
                  nameEditing.onCancel();
                }
              }}
            >
              {nameEditing ? (
                <div className={styles['file-option-name-input-container']}>
                  <InternalInput
                    value={nameEditing.value}
                    onChange={event => nameEditing.onChange(event.detail.value)}
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

              {nameEditing ? (
                <InternalSpaceBetween size="xxs" direction="horizontal">
                  <InternalButton
                    formAction="none"
                    iconName="close"
                    variant="inline-icon"
                    className={styles['file-option-name-edit-cancel']}
                    onClick={nameEditing.onCancel}
                    ariaLabel={i18nStrings.cancelFileNameEditAriaLabel}
                  />
                  <InternalButton
                    formAction="none"
                    iconName="check"
                    variant="inline-icon"
                    className={styles['file-option-name-edit-submit']}
                    onClick={nameEditing.onSubmit}
                    ariaLabel={i18nStrings.submitFileNameEditAriaLabel}
                  />
                </InternalSpaceBetween>
              ) : (
                <InternalButton
                  __hideFocusOutline={true}
                  formAction="none"
                  iconName="edit"
                  variant="inline-icon"
                  className={styles['file-option-name-edit-activate']}
                  ariaLabel={i18nStrings.activateFileNameEditAriaLabel}
                />
              )}
            </div>
          }
          {metadata.showFileType && file.type ? (
            <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-type']}>
              {file.type}
            </InternalBox>
          ) : null}

          {metadata.showFileSize && file.size ? (
            <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-size']}>
              {formatFileSize(file.size)}
            </InternalBox>
          ) : null}

          {metadata.showFileLastModified && file.lastModified ? (
            <InternalBox fontSize="body-s" color="text-body-secondary" className={styles['file-option-last-modified']}>
              {formatFileLastModified(new Date(file.lastModified))}
            </InternalBox>
          ) : null}
        </InternalSpaceBetween>
      </div>
    </InternalBox>
  );
};
