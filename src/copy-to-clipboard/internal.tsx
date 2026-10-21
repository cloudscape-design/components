// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import InternalButton from '../button/internal';
import InternalIcon from '../icon/internal';
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

type CopyStatus = 'success' | 'error';

const STATUS_ICON_VISIBLE_MS = 1500;

function useTransientFlag(durationMs: number) {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const clear = useCallback(() => {
    clearTimeout(timerRef.current);
    setActive(false);
  }, []);

  const trigger = useCallback(() => {
    clearTimeout(timerRef.current);
    setActive(true);
    timerRef.current = setTimeout(() => setActive(false), durationMs);
  }, [durationMs]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { active, trigger, clear };
}

/**
 * Copy glyph and result glyph stacked in one icon slot so the swap can be animated
 */
function IconSwap({ status, showResult }: { status: CopyStatus; showResult: boolean }) {
  return (
    <span className={clsx(styles['icon-swap'], showResult && styles['icon-swap-copied'])}>
      <InternalIcon name="copy" className={styles['icon-swap-copy']} />
      <InternalIcon
        name={status === 'error' ? 'status-negative' : 'status-positive'}
        variant={status === 'error' ? 'error' : 'success'}
        className={styles['icon-swap-result']}
      />
    </span>
  );
}

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
  const [status, setStatus] = useState<CopyStatus>('success');
  const [statusText, setStatusText] = useState(copySuccessText);
  const isOneTheme = useOneTheme();
  const result = useTransientFlag(STATUS_ICON_VISIBLE_MS);

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

  const reportResult = (nextStatus: CopyStatus) => {
    setStatus(nextStatus);
    setStatusText(nextStatus === 'success' ? copySuccessText : copyErrorText);
    if (isOneTheme) {
      result.trigger();
    }
    fireNonCancelableEvent(nextStatus === 'success' ? onCopySuccess : onCopyFailure, { text: textToCopy });
  };

  const onClick = () => {
    if (!navigator.clipboard) {
      // The clipboard API is not available in insecure contexts.
      reportResult('error');
      return;
    }
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => reportResult('success'))
      .catch(() => reportResult('error'));
  };

  const triggerVariant = (
    {
      button: 'normal',
      icon: 'icon',
      inline: 'inline-icon',
    } as const
  )[variant];

  const isInline = variant === 'inline';

  const button = (
    <InternalButton
      ariaLabel={copyButtonAriaLabel ?? copyButtonText}
      iconName={isOneTheme ? undefined : 'copy'}
      iconSvg={isOneTheme ? <IconSwap status={status} showResult={result.active} /> : undefined}
      variant={triggerVariant}
      wrapText={false}
      formAction="none"
      disabled={disabled}
      disabledReason={disabledReason}
    >
      {copyButtonText}
    </InternalButton>
  );

  const oneThemePopoverProps = isOneTheme
    ? {
        __visible: result.active,
        __onVisibleChange: ({ detail }: { detail: { visible: boolean } }) => {
          if (!detail.visible) {
            result.clear();
          }
        },
      }
    : {};

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
      {...oneThemePopoverProps}
      content={
        isOneTheme ? (
          <span className={styles['popover-message']}>{statusText}</span>
        ) : (
          <InternalStatusIndicator type={status}>{statusText}</InternalStatusIndicator>
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
