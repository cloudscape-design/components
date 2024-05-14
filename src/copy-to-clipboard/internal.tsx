// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { CopyToClipboardProps } from './interfaces';
import InternalButton from '../button/internal';
import InternalPopover from '../popover/internal';
import InternalStatusIndicator from '../status-indicator/internal';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';
import clsx from 'clsx';

export default function InternalCopyToClipboard({
  variant = 'button',
  copyButtonAriaLabel,
  copyButtonText,
  copySuccessText,
  copyErrorText,
  textToCopy,
  className,
  id,
}: CopyToClipboardProps) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [statusText, setStatusText] = useState('');

  const onClick = () => {
    if (navigator.clipboard) {
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
    }
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
      renderWithPortal={true}
      content={<InternalStatusIndicator type={status}>{statusText}</InternalStatusIndicator>}
    >
      <InternalButton
        ariaLabel={copyButtonAriaLabel}
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
    <span id={id} className={clsx(className, styles.root, testStyles.root)}>
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
