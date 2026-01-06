// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import { useResizeObserver, useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import LiveRegion from '../live-region/internal';
import Tooltip from '../tooltip/internal.js';
import DismissButton from './dismiss-button';
import { TokenProps } from './interfaces';

import legacyTestingStyles from '../token-group/styles.css.js';
import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

type InternalTokenProps = TokenProps &
  InternalBaseComponentProps & {
    role?: string;
    disableInnerPadding?: boolean;
  };

function InternalToken({
  // External
  label,
  ariaLabel,
  labelTag,
  description,
  variant = 'normal',
  disabled,
  readOnly,
  icon,
  tags,
  dismissLabel,
  onDismiss,
  tooltipContent,

  // Internal
  role,
  disableInnerPadding,

  // Base
  __internalRootRef,
  ...restProps
}: InternalTokenProps) {
  const baseProps = getBaseProps(restProps);
  const labelContainerRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const isInline = variant === 'inline';
  const ariaLabelledbyId = useUniqueId();

  const isLabelOverflowing = () => {
    const labelContent = labelRef.current;
    const labelContainer = labelContainerRef.current;

    if (labelContent && labelContainer) {
      return labelContent.offsetWidth > labelContainer.offsetWidth;
    }
  };

  useResizeObserver(labelContainerRef, () => {
    if (isInline) {
      setIsEllipsisActive(isLabelOverflowing() ?? false);
    }
  });

  const buildOptionDefinition = () => {
    const isLabelStringOrNumber = typeof label === 'string' || typeof label === 'number';
    const labelObject = isLabelStringOrNumber ? { label: String(label) } : { labelContent: label };

    if (isInline) {
      if (!isLabelStringOrNumber) {
        warnOnce('Label', `Only plain text (strings or numbers) are supported when variant="inline".`);
      }

      return {
        ...labelObject,
        disabled,
        __customIcon: icon && <span className={clsx(styles.icon, styles['icon-inline'])}>{icon}</span>,
      };
    } else {
      return {
        ...labelObject,
        disabled,
        labelTag,
        description,
        tags,
        __customIcon: icon && <span className={styles.icon}>{icon}</span>,
      };
    }
  };

  return (
    <div
      {...baseProps}
      ref={__internalRootRef}
      className={clsx(
        styles.root,
        legacyTestingStyles.token,
        testUtilStyles.root,
        !isInline ? styles['token-normal'] : styles['token-inline'],
        analyticsSelectors.token,
        baseProps.className
      )}
      aria-label={ariaLabel}
      aria-labelledby={!ariaLabel ? ariaLabelledbyId : undefined}
      aria-disabled={!!disabled}
      role={role ?? 'group'}
      onFocus={e => {
        // Only show tooltip if focus is coming from outside the token
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowTooltip(true);
        }
      }}
      onBlur={e => {
        // Only hide tooltip if focus is moving outside the token
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setShowTooltip(false);
        }
      }}
      onMouseEnter={() => {
        setShowTooltip(true);
      }}
      onMouseLeave={() => {
        setShowTooltip(false);
      }}
      tabIndex={!!tooltipContent && isInline && isEllipsisActive ? 0 : undefined}
    >
      <div
        className={clsx(
          !isInline ? styles['token-box'] : styles['token-box-inline'],
          disabled && styles['token-box-disabled'],
          readOnly && styles['token-box-readonly'],
          !isInline && !onDismiss && styles['token-box-without-dismiss'],
          disableInnerPadding && styles['disable-padding']
        )}
      >
        <Option
          className={clsx(isInline && styles['token-option-inline'])}
          triggerVariant={isInline}
          option={buildOptionDefinition()}
          disableTitleTooltip={!!tooltipContent}
          labelContainerRef={labelContainerRef}
          labelRef={labelRef}
          labelId={ariaLabelledbyId}
        />
        {onDismiss && (
          <DismissButton
            disabled={disabled}
            dismissLabel={dismissLabel}
            onDismiss={onDismiss}
            readOnly={readOnly}
            inline={isInline}
          />
        )}
      </div>
      {!!tooltipContent && isInline && isEllipsisActive && showTooltip && (
        <Tooltip
          data-testid="token-tooltip"
          getTrack={() => labelContainerRef.current}
          content={
            <LiveRegion>
              <span data-testid="tooltip-live-region-content">{tooltipContent}</span>
            </LiveRegion>
          }
          onEscape={() => {
            setShowTooltip(false);
          }}
        />
      )}
    </div>
  );
}

export default InternalToken;
