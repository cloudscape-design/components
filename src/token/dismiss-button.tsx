// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, Ref } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalIcon from '../icon/internal';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { GeneratedAnalyticsMetadataTokenGroupDismiss } from '../token-group/analytics-metadata/interfaces';

import styles from './styles.css.js';

interface DismissButtonProps {
  disabled?: boolean;
  readOnly?: boolean;
  onDismiss?: NonCancelableEventHandler;
  dismissLabel?: string;
  inline?: boolean;
}

export default forwardRef(DismissButton);

function DismissButton(
  { disabled, dismissLabel, onDismiss, readOnly, inline }: DismissButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const analyticsMetadata: GeneratedAnalyticsMetadataTokenGroupDismiss = {
    action: 'dismiss',
    detail: {
      label: { root: 'self' },
    },
  };
  return (
    <button
      ref={ref}
      type="button"
      className={clsx(styles[`dismiss-button`], inline && styles['dismiss-button-inline'])}
      aria-disabled={disabled || readOnly ? true : undefined}
      onClick={() => {
        if (disabled || readOnly || !onDismiss) {
          return;
        }

        fireNonCancelableEvent(onDismiss);
      }}
      aria-label={dismissLabel}
      {...(disabled || readOnly ? {} : getAnalyticsMetadataAttribute(analyticsMetadata))}
    >
      <InternalIcon className={clsx(inline && styles['dismiss-icon-inline'])} name="close" />
    </button>
  );
}
