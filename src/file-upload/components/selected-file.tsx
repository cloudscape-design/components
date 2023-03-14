// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { LegacyRef, useEffect, useMemo, useRef } from 'react';

import { formatFileSize, formatFileLastModified, getBaseMetadata, isImageFile } from '../utils';
import { FileUploadProps } from '../interfaces';
import InternalBox from '../../box/internal';
import InternalSpaceBetween from '../../space-between/internal';
import InternalIcon from '../../icon/internal';
import styles from '../styles.css.js';

interface SelectedFileProps {
  metadata?: FileUploadProps.FileMetadata;
  file: File;
  className?: string;
  multiple?: boolean;
}

export const SelectedFile: React.FC<SelectedFileProps> = ({ metadata, file, multiple = false }: SelectedFileProps) => {
  const thumbnail: LegacyRef<HTMLImageElement> = useRef(null);
  const baseMetadata = getBaseMetadata(metadata);

  const isImg = useMemo(() => isImageFile(file), [file]);

  useEffect(() => {
    if (multiple && baseMetadata.thumbnail && isImg) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (thumbnail.current && thumbnail.current.src) {
          thumbnail.current.src = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }, [multiple, file, baseMetadata.thumbnail, isImg]);

  return (
    <InternalBox className={styles['selected-file-file']}>
      <InternalIcon variant="success" name="status-positive" />
      {baseMetadata.thumbnail && multiple && isImg && (
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
          {baseMetadata.type && file.type && (
            <InternalBox fontSize="body-s" color="text-body-secondary">
              {file.type}
            </InternalBox>
          )}
          {baseMetadata.size && file.size && (
            <InternalBox fontSize="body-s" color="text-body-secondary">
              {formatFileSize(file.size, baseMetadata)}
            </InternalBox>
          )}
          {baseMetadata.lastModified && file.lastModified && (
            <InternalBox fontSize="body-s" color="text-body-secondary">
              {formatFileLastModified(file.lastModified, baseMetadata)}
            </InternalBox>
          )}
        </InternalSpaceBetween>
      </InternalBox>
    </InternalBox>
  );
};
