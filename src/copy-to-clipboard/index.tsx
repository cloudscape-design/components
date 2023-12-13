// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { getBaseProps } from '../internal/base-component';
import { CopyToClipboardProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import useBaseComponent from '../internal/hooks/use-base-component';
import InternalButton from '../button/internal';
import InternalPopover from '../popover/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import { useInternalI18n } from '../i18n/context';
import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';
import clsx from 'clsx';

export { CopyToClipboardProps };

export default function CopyToClipboard({
  variant = 'button',
  copyButtonAriaLabel,
  copyButtonText,
  textToCopy,
  i18nStrings,
  ...restProps
}: CopyToClipboardProps) {
  const { __internalRootRef } = useBaseComponent('CopyToClipboard');
  const baseProps = getBaseProps(restProps);

  const i18n = useInternalI18n('copy-to-clipboard');
  const copyButtonProps =
    variant === 'button'
      ? { children: copyButtonText, ariaLabel: copyButtonAriaLabel }
      : { ariaLabel: copyButtonAriaLabel ?? copyButtonText };

  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [statusText, setStatusText] = useState('');

  const copySuccessText = i18n('i18nStrings.copySuccessText', i18nStrings?.copySuccessText) ?? '';
  const copyErrorText = i18n('i18nStrings.copyErrorText', i18nStrings?.copyErrorText) ?? '';

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
      content={<InternalStatusIndicator type={status}>{statusText}</InternalStatusIndicator>}
      __hidden={status === 'pending'}
    >
      <InternalButton
        {...copyButtonProps}
        iconName="copy"
        onClick={onClick}
        variant={triggerVariant}
        wrapText={false}
        formAction="none"
      />
    </InternalPopover>
  );

  return (
    <div ref={__internalRootRef} {...baseProps} className={clsx(baseProps.className, styles.root, testStyles.root)}>
      {variant === 'inline' ? (
        <div className={styles['inline-container']}>
          <div className={styles['inline-container-trigger']}>{trigger}</div>
          <div className={clsx(styles['inline-container-text'], testStyles['text-to-copy'])}>{textToCopy}</div>
        </div>
      ) : (
        trigger
      )}
    </div>
  );
}

applyDisplayName(CopyToClipboard, 'CopyToClipboard');
