// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';

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
import { ButtonProps } from '../button/interfaces';
import { useEffectOnUpdate } from '../internal/hooks/use-effect-on-update';
import useFocusVisible from '../internal/hooks/focus-visible';
import { FileOptionThumbnail } from './file-option-thumbnail';

interface FileNameEditingProps {
  isEditing: boolean;
  value: string;
  onActivate: () => void;
  onChange: (fileName: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

interface FileOptionProps {
  file: File;
  metadata: FileMetadata;
  nameEditing: FileNameEditingProps;
  i18nStrings: FileUploadProps.I18nStrings;
}

export function FileOption({ file, metadata, nameEditing, i18nStrings }: FileOptionProps) {
  const isImage = !!file.type && file.type.split('/')[0] === 'image';
  const [isNameEditFocused, setNameEditFocused] = useState(false);
  const isFocusVisible = !!useFocusVisible()['data-awsui-focus-visible'];
  const fileOptionNameRef = useRef<HTMLDivElement>(null);
  const fileNameEditActivateButtonRef = useRef<ButtonProps.Ref>(null);

  // Focus on name editing activate button when existing name editing mode.
  useEffectOnUpdate(() => {
    if (!nameEditing.isEditing) {
      fileNameEditActivateButtonRef.current?.focus();
    }
  }, [nameEditing.isEditing]);

  const onFileNameEditInputKeyDown = (event: CustomEvent<BaseKeyDetail>) => {
    if (event.detail.keyCode === KeyCode.escape) {
      event.preventDefault();
      nameEditing.onCancel();
    }
  };

  const onFileNameEditActivate = () => {
    if (!nameEditing.isEditing) {
      nameEditing.onActivate();
    }
  };

  const formatFileSize = i18nStrings.formatFileSize ?? defaultFileSizeFormat;
  const formatFileLastModified = i18nStrings.formatFileLastModified ?? defaultLastModifiedFormat;

  return (
    <InternalBox className={styles['file-option']}>
      <InternalIcon variant="success" name="status-positive" />

      {metadata.showFileThumbnail && isImage && <FileOptionThumbnail file={file} />}

      <div className={styles['file-option-metadata']}>
        <InternalSpaceBetween direction="vertical" size="xxxs">
          {
            <div
              ref={fileOptionNameRef}
              className={clsx(
                styles['file-option-name'],
                nameEditing.isEditing && styles['file-name-edit-active'],
                isNameEditFocused && isFocusVisible && styles['file-name-edit-focused']
              )}
              onClick={onFileNameEditActivate}
              onFocus={() => setNameEditFocused(true)}
              onBlur={event => {
                setNameEditFocused(false);

                if (nameEditing.isEditing && !fileOptionNameRef.current!.contains(event.relatedTarget)) {
                  nameEditing.onCancel();
                }
              }}
            >
              {nameEditing.isEditing ? (
                <div className={styles['file-option-name-input-container']}>
                  <InternalInput
                    autoFocus={true}
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

              {nameEditing.isEditing ? (
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
                  ref={fileNameEditActivateButtonRef}
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
}
