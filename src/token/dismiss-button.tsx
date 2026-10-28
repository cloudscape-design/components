// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { isThemeActive, Theme } from '@cloudscape-design/component-toolkit/internal';

import { InternalButton } from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { NonCancelableEventHandler } from '../types/events';
import { TokenProps } from './interfaces';
import { getDismissButtonStyles } from './styles';

import legacyTestingStyles from '../token-group/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

interface DismissButtonProps {
  disabled?: boolean;
  readOnly?: boolean;
  onDismiss?: NonCancelableEventHandler;
  dismissLabel?: string;
  inline?: boolean;
  style?: TokenProps['style'];
}

export default function DismissButton({
  disabled,
  dismissLabel,
  onDismiss,
  readOnly,
  inline,
  style,
}: DismissButtonProps) {
  const isOneTheme = isThemeActive(Theme.OneTheme);
  return (
    <InternalButton
      variant="inline-icon"
      iconName="close"
      __iconSize={isOneTheme ? 'x-small' : undefined}
      formAction="none"
      ariaLabel={dismissLabel}
      __title=""
      disabled={disabled || readOnly}
      __focusable={true}
      analyticsAction="dismiss"
      className={clsx(
        styles['dismiss-button'],
        legacyTestingStyles['dismiss-button'],
        testUtilStyles['dismiss-button'],
        inline && styles['dismiss-button-inline']
      )}
      style={getDismissButtonStyles(style, { disabled, readOnly })}
      onClick={() => fireNonCancelableEvent(onDismiss)}
    />
  );
}
