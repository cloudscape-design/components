// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizeObserver, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import InternalBox from '../box/internal.js';
import { FormFieldError, FormFieldWarning } from '../form-field/internal';
import { BaseComponentProps } from '../internal/base-component/index.js';
import InternalSpaceBetween from '../space-between/internal.js';
import InternalSpinner from '../spinner/internal.js';
import InternalToken from '../token/internal.js';
import { TokenGroupProps } from '../token-group/interfaces.js';
import Tooltip from '../tooltip/internal.js';
import * as defaultFormatters from './default-formatters.js';
import { FileOptionThumbnail } from './thumbnail.js';

import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export namespace FileTokenProps {
  export interface I18nStrings {
    removeFileAriaLabel?: (fileIndex: number, fileName: string) => string;
    errorIconAriaLabel?: string;
    warningIconAriaLabel?: string;
    formatFileSize?: (sizeInBytes: number) => string;
    formatFileLastModified?: (date: Date) => string;
  }
}

interface FileTokenProps extends BaseComponentProps {
  file: File;
  onDismiss: () => void;
  showFileSize?: boolean;
  showFileLastModified?: boolean;
  showFileThumbnail?: boolean;
  errorText?: React.ReactNode;
  warningText?: React.ReactNode;
  loading?: boolean;
  readOnly?: boolean;
  i18nStrings?: FileTokenProps.I18nStrings;
  dismissLabel?: string;
  alignment?: TokenGroupProps.Alignment;
  groupContainsImage?: boolean;
  isImage: boolean;
  index: number;
}

function InternalFileToken({
  file,
  showFileLastModified,
  showFileSize,
  showFileThumbnail,
  i18nStrings,
  onDismiss,
  errorText,
  warningText,
  readOnly,
  loading,
  alignment,
  groupContainsImage,
  isImage,
  index,
}: FileTokenProps) {
  const formatFileSize = i18nStrings?.formatFileSize ?? defaultFormatters.formatFileSize;
  const formatFileLastModified = i18nStrings?.formatFileLastModified ?? defaultFormatters.formatFileLastModified;

  const errorId = useUniqueId('error');
  const warningId = useUniqueId('warning');

  const showWarning = warningText && !errorText;
  const containerRef = useRef<HTMLDivElement>(null);
  const fileNameRef = useRef<HTMLSpanElement>(null);
  const fileNameContainerRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const getDismissLabel = (fileIndex: number) => {
    return i18nStrings?.removeFileAriaLabel?.(fileIndex, file.name);
  };

  function isEllipsisActive() {
    const span = fileNameRef.current;
    const container = fileNameContainerRef.current;

    if (span && container) {
      return span.offsetWidth >= container.offsetWidth;
    }
    return false;
  }

  useResizeObserver(
    () => fileNameContainerRef.current,
    () => setIsTruncated(isEllipsisActive())
  );

  const fileIsSingleRow =
    !showFileLastModified && !showFileSize && (!groupContainsImage || (groupContainsImage && !showFileThumbnail));

  // File name wrapped in a keyboard-focusable container that drives the custom Tooltip below.
  const fileNameLabel = (
    <div
      className={styles['file-name-container']}
      onMouseOver={() => setShowTooltip(true)}
      onMouseOut={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      role={isTruncated ? 'button' : undefined}
      aria-expanded={isTruncated ? showTooltip : undefined}
      tabIndex={isTruncated ? 0 : -1}
      ref={fileNameContainerRef}
    >
      <InternalBox
        fontWeight="normal"
        className={clsx(styles['file-option-name'], testUtilStyles['file-option-name'], {
          [testUtilStyles['ellipsis-active']]: isTruncated,
        })}
      >
        <span ref={fileNameRef}>{file.name}</span>
      </InternalBox>
    </div>
  );

  const fileMetadataRows =
    (showFileSize && file.size) || (showFileLastModified && file.lastModified) ? (
      <InternalSpaceBetween direction="vertical" size="xxxs">
        {showFileSize && file.size ? (
          <InternalBox
            fontSize="body-s"
            color={'text-body-secondary'}
            className={clsx(styles['file-option-size'], testUtilStyles['file-option-size'])}
          >
            {formatFileSize(file.size)}
          </InternalBox>
        ) : null}

        {showFileLastModified && file.lastModified ? (
          <InternalBox
            fontSize="body-s"
            color={'text-body-secondary'}
            className={clsx(styles['file-option-last-modified'], testUtilStyles['file-option-last-modified'])}
          >
            {formatFileLastModified(new Date(file.lastModified))}
          </InternalBox>
        ) : null}
      </InternalSpaceBetween>
    ) : null;

  const loadingOverlay = loading ? (
    <div
      className={clsx(styles['file-loading-overlay'], {
        [styles['file-loading-overlay-single-row']]: loading && fileIsSingleRow,
      })}
    >
      <InternalSpinner variant="disabled" size="normal" />
    </div>
  ) : null;

  return (
    <div
      ref={containerRef}
      className={clsx(styles.token, {
        [styles['token-grid']]: alignment === 'horizontal',
        [styles['token-contains-image']]: groupContainsImage && showFileThumbnail,
      })}
      role="group"
      aria-label={file.name}
      aria-describedby={errorText ? errorId : warningText ? warningId : undefined}
      aria-disabled={loading || undefined}
      data-index={index}
    >
      <InternalToken
        // Outer div already provides role="group" + aria-label; InternalToken's root is presentation-only.
        role="presentation"
        label={fileNameLabel}
        icon={showFileThumbnail && isImage ? <FileOptionThumbnail file={file} /> : undefined}
        additionalContent={fileMetadataRows}
        tokenBoxContent={loadingOverlay}
        // Dismiss button always rendered (matches TokenGroup); disabled while loading.
        onDismiss={onDismiss}
        dismissLabel={getDismissLabel(index)}
        readOnly={readOnly || loading}
        tokenBoxClassName={clsx(styles['token-box'], {
          [styles.loading]: loading,
          [styles.error]: errorText,
          [styles.warning]: showWarning,
          [styles.horizontal]: alignment === 'horizontal',
          [styles['read-only']]: readOnly,
        })}
      />
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
      {showTooltip && isTruncated && (
        <Tooltip
          getTrack={() => containerRef.current}
          content={<InternalBox fontWeight="normal">{file.name}</InternalBox>}
          onEscape={() => setShowTooltip(false)}
        />
      )}
    </div>
  );
}

export default InternalFileToken;
