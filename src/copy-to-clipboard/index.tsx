// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
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
  variant = 'normal',
  ariaLabel,
  messageType = 'success',
  message,
  onClick,
  i18nStrings,
  ...restProps
}: CopyToClipboardProps) {
  const { __internalRootRef } = useBaseComponent('CopyToClipboard');
  const baseProps = getBaseProps(restProps);

  const i18n = useInternalI18n('copy-to-clipboard');
  const copyButtonText = i18n('i18nStrings.copyButtonText', i18nStrings?.copyButtonText);
  const copyButtonProps =
    variant === 'normal' ? { children: copyButtonText, ariaLabel } : { ariaLabel: ariaLabel ?? copyButtonText };

  return (
    <div ref={__internalRootRef} {...baseProps} className={clsx(baseProps.className, styles.root, testStyles.root)}>
      <InternalPopover
        size="medium"
        position="top"
        triggerType="custom"
        dismissButton={false}
        content={<InternalStatusIndicator type={messageType}>{message}</InternalStatusIndicator>}
      >
        <InternalButton
          {...copyButtonProps}
          iconName="copy"
          onClick={onClick}
          variant={variant === 'normal' ? 'normal' : 'inline-icon'}
          wrapText={false}
          formAction="none"
        />
      </InternalPopover>
    </div>
  );
}

applyDisplayName(CopyToClipboard, 'CopyToClipboard');
