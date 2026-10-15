// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import InternalButton from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useOneTheme } from '../internal/hooks/use-visual-mode';
import InternalPopover from '../popover/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import { CopyToClipboardProps } from './interfaces';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

interface InternalCopyToClipboardProps extends CopyToClipboardProps, InternalBaseComponentProps {}

export default function InternalCopyToClipboard({
  variant = 'button',
  copyButtonAriaLabel,
  copyButtonText,
  copySuccessText,
  copyErrorText,
  textToCopy,
  textToDisplay,
  wrapText = true,
  popoverRenderWithPortal,
  disabled,
  disabledReason,
  onCopySuccess,
  onCopyFailure,
  __internalRootRef,
  ...restProps
}: InternalCopyToClipboardProps) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('success');
  const [statusText, setStatusText] = useState(copySuccessText);
  const isOneTheme = useOneTheme();

  const COPY_RESULT_DWELL_MS = 1500;
  const [showResult, setShowResult] = useState(false);
  const resultTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const flashResult = () => {
    setShowResult(true);
    clearTimeout(resultTimerRef.current);
    resultTimerRef.current = setTimeout(() => setShowResult(false), COPY_RESULT_DWELL_MS);
  };
  useEffect(() => () => clearTimeout(resultTimerRef.current), []);

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'clipboard-write' as PermissionName })
        .then(result => {
          if (result.state === 'denied') {
            setStatus('error');
            setStatusText(copyErrorText);
          }
        })
        .catch(() => {
          // Permissions API not supported or failed.
        });
    }
  }, [copyErrorText]);

  const baseProps = getBaseProps(restProps);
  const onClick = () => {
    if (!navigator.clipboard) {
      // The clipboard API is not available in insecure contexts.
      setStatus('error');
      setStatusText(copyErrorText);
      flashResult();
      fireNonCancelableEvent(onCopyFailure, { text: textToCopy });
      return;
    }

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setStatus('success');
        setStatusText(copySuccessText);
        flashResult();
        fireNonCancelableEvent(onCopySuccess, { text: textToCopy });
      })
      .catch(() => {
        setStatus('error');
        setStatusText(copyErrorText);
        flashResult();
        fireNonCancelableEvent(onCopyFailure, { text: textToCopy });
      });
  };

  const triggerVariant = (
    {
      button: 'normal',
      icon: 'icon',
      inline: 'inline-icon',
    } as const
  )[variant];

  const isInline = variant === 'inline';

  const resultIconName = status === 'error' ? 'status-negative' : 'status-positive';
  const triggerIconName = isOneTheme && showResult ? resultIconName : 'copy';
  const resultColorClass =
    isOneTheme && showResult
      ? status === 'error'
        ? styles['one-theme-trigger-error']
        : styles['one-theme-trigger-success']
      : undefined;

  const button = (
    <InternalButton
      ariaLabel={copyButtonAriaLabel ?? copyButtonText}
      iconName={triggerIconName}
      className={clsx(isOneTheme && styles['one-theme-trigger'], resultColorClass)}
      variant={triggerVariant}
      wrapText={false}
      formAction="none"
      disabled={disabled}
      disabledReason={disabledReason}
    >
      {copyButtonText}
    </InternalButton>
  );

  const trigger = disabled ? (
    button
  ) : (
    <InternalPopover
      isInline={isInline}
      size="medium"
      position="top"
      triggerType="custom"
      dismissButton={false}
      renderWithPortal={popoverRenderWithPortal}
      {...(isOneTheme
        ? {
            __visible: showResult,
            __onVisibleChange: ({ detail }: { detail: { visible: boolean } }) => {
              if (!detail.visible) {
                clearTimeout(resultTimerRef.current);
                setShowResult(false);
              }
            },
          }
        : {})}
      content={
        isOneTheme ? (
          <span className={styles['popover-message']}>{statusText}</span>
        ) : (
          <InternalStatusIndicator type={status} __embedded={isOneTheme}>
            {statusText}
          </InternalStatusIndicator>
        )
      }
      __onOpen={onClick}
    >
      {button}
    </InternalPopover>
  );

  return (
    <span {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root, testStyles.root)}>
      {isInline ? (
        <span className={clsx(styles['inline-container'], !wrapText && styles['inline-container-no-wrap'])}>
          <span className={styles['inline-container-trigger']}>{trigger}</span>
          <span className={clsx(testStyles['text-to-display'], testStyles['text-to-copy'], styles['text-to-display'])}>
            {textToDisplay !== undefined ? textToDisplay : textToCopy}
          </span>
        </span>
      ) : (
        trigger
      )}
    </span>
  );
}
