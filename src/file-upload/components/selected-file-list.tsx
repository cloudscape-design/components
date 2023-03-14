// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { SelectedFile } from './selected-file';
import { FileUploadProps, FileMetadata } from '../interfaces';
import InternalBox from '../../box/internal';
import InternalButton from '../../button/internal';
import InternalSpaceBetween from '../../space-between/internal';
import styles from '../styles.css.js';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../../internal/events';

interface SelectedFileListProps {
  metadata: FileMetadata;
  fileList: File[];
  onDismiss: NonCancelableEventHandler<FileUploadProps.DismissDetail>;
  i18nStrings: FileUploadProps.I18nStrings;
}

export const SelectedFileList: React.FC<SelectedFileListProps> = ({
  metadata,
  fileList,
  onDismiss,
  i18nStrings,
}: SelectedFileListProps) => {
  const handleClick = (index: number, file: File) => () =>
    onDismiss && fireNonCancelableEvent(onDismiss, { index, file });

  const items = fileList.map((file: File, idx: number) => {
    return (
      <InternalBox className={styles['selected-file-list-token']} key={idx}>
        <SelectedFile key={idx} file={file} metadata={metadata} multiple={true} i18nStrings={i18nStrings} />
        <InternalButton
          variant="icon"
          iconName="close"
          className={styles['selected-file-list-dismiss-button']}
          onClick={handleClick(idx, file)}
        />
      </InternalBox>
    );
  });

  return (
    <InternalSpaceBetween direction="vertical" size="xs">
      {items}
    </InternalSpaceBetween>
  );
};
