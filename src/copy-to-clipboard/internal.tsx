// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import InternalButton from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import InternalPopover from '../popover/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import { CopyToClipboardProps } from './interfaces';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

export interface InternalCopyToClipboardProps extends CopyToClipboardProps, InternalBaseComponentProps {}

export default function InternalCopyToClipboard({
  variant = 'button',
  copyButtonAriaLabel,
  copyButtonText,
  copySuccessText,
  copyErrorText,
  textToCopy,
  popoverRenderWithPortal,
  __internalRootRef = null,
  ...restProps
}: InternalCopyToClipboardProps) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [statusText, setStatusText] = useState('');

  const baseProps = getBaseProps(restProps);
  const onClick = () => {
    if (!navigator.clipboard) {
      // The clipboard API is not available in insecure contexts.
      setStatus('error');
      setStatusText(copyErrorText);
      return;
    }

    setStatus('pending');
    setStatusText('');
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setStatus('success');
        setStatusText(copySuccessText);
      })
      .catch(() => {
        setStatus('error');
        setStatusText(copyErrorText);
      });
  };

  const triggerVariant = (
    {
      button: 'normal',
      icon: 'icon',
      inline: 'inline-icon',
    } as const
  )[variant];

  const trigger = (
    <InternalPopover
      size="medium"
      position="top"
      triggerType="custom"
      dismissButton={false}
      renderWithPortal={popoverRenderWithPortal}
      content={<InternalStatusIndicator type={status}>{statusText}</InternalStatusIndicator>}
    >
      <InternalButton
        ariaLabel={copyButtonAriaLabel ?? copyButtonText}
        iconName="copy"
        onClick={onClick}
        variant={triggerVariant}
        wrapText={false}
        formAction="none"
      >
        {copyButtonText}
      </InternalButton>
    </InternalPopover>
  );

  return (
    <span {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root, testStyles.root)}>
      {variant === 'inline' ? (
        <span className={styles['inline-container']}>
          <span className={styles['inline-container-trigger']}>{trigger}</span>
          <span className={testStyles['text-to-copy']}>{textToCopy}</span>
        </span>
      ) : (
        trigger
      )}
    </span>
  );
}
