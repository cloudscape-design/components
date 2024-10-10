// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, Ref } from 'react';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import InternalIcon from '../icon/internal';
import InternalSpinner from '../spinner/internal';
import { GeneratedAnalyticsMetadataTokenGroupDismiss } from './analytics-metadata/interfaces';

import styles from './styles.css.js';

interface DismissButtonProps {
  disabled?: boolean;
  readOnly?: boolean;
  loading?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export default forwardRef(DismissButton);

function DismissButton(
  { disabled, dismissLabel, onDismiss, readOnly, loading }: DismissButtonProps,
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
      className={styles['dismiss-button']}
      aria-disabled={disabled || readOnly ? true : undefined}
      onClick={() => {
        if (disabled || readOnly || !onDismiss) {
          return;
        }

        onDismiss();
      }}
      aria-label={dismissLabel}
      {...(disabled || readOnly ? {} : getAnalyticsMetadataAttribute(analyticsMetadata))}
    >
      {loading ? <InternalSpinner /> : <InternalIcon name="close" />}
    </button>
  );
}
