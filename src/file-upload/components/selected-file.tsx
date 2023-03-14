// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { LegacyRef, useEffect, useRef } from 'react';

import { FileMetadata, FileUploadProps } from '../interfaces';
import InternalBox from '../../box/internal';
import InternalSpaceBetween from '../../space-between/internal';
import InternalIcon from '../../icon/internal';
import styles from '../styles.css.js';
import { formatFileLastModified, formatFileSize } from '../formatters';

interface SelectedFileProps {
  metadata: FileMetadata;
  file: File;
  multiple: boolean;
  i18nStrings: FileUploadProps.I18nStrings;
}

export const SelectedFile: React.FC<SelectedFileProps> = ({
  metadata,
  file,
  multiple,
  i18nStrings,
}: SelectedFileProps) => {
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
    <InternalBox className={styles['selected-file-file']}>
      <InternalIcon variant="success" name="status-positive" />
      {metadata.showFileThumbnail && multiple && isImage && (
        <InternalBox className={styles['selected-file-file-thumb']}>
          <img className={styles['selected-file-file-thumb-img']} alt={file.name} ref={thumbnail} src="" />
        </InternalBox>
      )}
      <InternalBox className={styles['selected-file-file-metadata']}>
        <InternalSpaceBetween direction="vertical" size="xxxs">
          {
            <InternalBox className={styles['selected-file-file-name']}>
              <span title={file.name}>{file.name}</span>
            </InternalBox>
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
      </InternalBox>
    </InternalBox>
  );
};
