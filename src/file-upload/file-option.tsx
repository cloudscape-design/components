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

interface FileOptionProps {
  metadata: FileMetadata;
  file: File;
  multiple: boolean;
  i18nStrings: FileUploadProps.I18nStrings;
}

export const FileOption: React.FC<FileOptionProps> = ({ metadata, file, multiple, i18nStrings }: FileOptionProps) => {
  const thumbnail: LegacyRef<HTMLImageElement> = useRef(null);

  const isImage = !!file.type && file.type.split('/')[0] === 'image';

  useEffect(() => {
    if (multiple && metadata.showFileThumbnail && isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (thumbnail.current && thumbnail.current.src) {
          thumbnail.current.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }, [multiple, file, metadata.showFileThumbnail, isImage]);

  return (
    <InternalBox className={styles['file-option']}>
      <InternalIcon variant="success" name="status-positive" />

      {metadata.showFileThumbnail && multiple && isImage && (
        <div className={styles['file-option-thumbnail']}>
          <img className={styles['file-option-thumbnail-image']} alt={file.name} ref={thumbnail} src="" />
        </div>
      )}

      <div className={styles['file-option-metadata']}>
        <InternalSpaceBetween direction="vertical" size="xxxs">
          {
            <div className={styles['file-option-name']}>
              <div className={styles['file-option-name-label']} title={file.name}>
                {file.name}
              </div>
              <div className={styles['file-option-name-edit']}>
                <InternalButton __hideFocusOutline={true} formAction="none" iconName="edit" variant="inline-icon" />
              </div>
            </div>
          }
          {metadata.showFileType && file.type && (
            <InternalBox fontSize="body-s" color="text-body-secondary">
              {file.type}
            </InternalBox>
          )}
          {metadata.showFileSize && file.size && (
            <InternalBox fontSize="body-s" color="text-body-secondary">
              {formatFileSize(file.size, i18nStrings)}
            </InternalBox>
          )}
          {metadata.showFileLastModified && file.lastModified && (
            <InternalBox fontSize="body-s" color="text-body-secondary">
              {formatFileLastModified(new Date(file.lastModified), i18nStrings)}
            </InternalBox>
          )}
        </InternalSpaceBetween>
      </div>
    </InternalBox>
  );
};
