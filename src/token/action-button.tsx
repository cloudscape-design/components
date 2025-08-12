// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef, Ref } from 'react';
import clsx from 'clsx';

import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { IconProps } from '../icon/interfaces';
import InternalIcon from '../icon/internal';
import { fireNonCancelableEvent, NonCancelableEventHandler } from '../internal/events';
import { GeneratedAnalyticsMetadataTokenActionButton } from './analytics-metadata/interfaces';

import styles from './styles.css.js';

interface ActionButtonProps {
  isCustom?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onClick?: NonCancelableEventHandler;
  ariaLabel?: string;
  inline?: boolean;
  iconAlt?: string;
  iconName?: IconProps.Name;
  iconUrl?: string;
  iconSvg?: React.ReactNode;
}

export default forwardRef(ActionButton);

function ActionButton(
  {
    isCustom,
    disabled,
    ariaLabel,
    onClick,
    readOnly,
    inline,
    iconAlt,
    iconName = 'close',
    iconUrl,
    iconSvg,
  }: ActionButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const analyticsMetadata: GeneratedAnalyticsMetadataTokenActionButton = {
    action: isCustom ? 'custom' : 'dismiss',
    detail: {
      label: { root: 'self' },
    },
  };
  return (
    <button
      ref={ref}
      type="button"
      className={clsx(styles[`action-button`], inline && styles['action-button-inline'])}
      aria-disabled={disabled || readOnly ? true : undefined}
      onClick={() => {
        if (disabled || readOnly || !onClick) {
          return;
        }

        fireNonCancelableEvent(onClick);
      }}
      aria-label={ariaLabel}
      {...(disabled || readOnly ? {} : getAnalyticsMetadataAttribute(analyticsMetadata))}
    >
      <InternalIcon
        className={clsx(inline && styles['action-icon-inline'])}
        ariaLabel={iconAlt}
        name={iconName}
        url={iconUrl}
        svg={iconSvg}
      />
    </button>
  );
}
