// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import InternalButton from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
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
      fireNonCancelableEvent(onCopyFailure, { text: textToCopy });
      return;
    }

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setStatus('success');
        setStatusText(copySuccessText);
        fireNonCancelableEvent(onCopySuccess, { text: textToCopy });
      })
      .catch(() => {
        setStatus('error');
        setStatusText(copyErrorText);
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

  const button = (
    <InternalButton
      ariaLabel={copyButtonAriaLabel ?? copyButtonText}
      iconName="copy"
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
      content={<InternalStatusIndicator type={status}>{statusText}</InternalStatusIndicator>}
      __onOpen={onClick}
    >
      {button}
    </InternalPopover>
  );

  return (
    <span {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root, testStyles.root)}>
      {isInline ? (
        <span className={styles['inline-container']}>
          <span className={styles['inline-container-trigger']}>{trigger}</span>
          <span className={clsx(testStyles['text-to-display'], testStyles['text-to-copy'])}>
            {textToDisplay ?? textToCopy}
          </span>
        </span>
      ) : (
        trigger
      )}
    </span>
  );
}
