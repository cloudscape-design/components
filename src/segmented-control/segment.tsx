// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import InternalIcon from '../icon/internal';
import Tooltip from '../internal/components/tooltip';
import useHiddenDescription from '../internal/hooks/use-hidden-description';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { SegmentedControlProps } from './interfaces';

import styles from './styles.css.js';

export interface SegmentProps extends SegmentedControlProps.Option {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  isActive: boolean;
  tabIndex: number;
}

export const Segment = React.forwardRef(
  (
    {
      disabled,
      disabledReason,
      text,
      iconName,
      iconAlt,
      iconUrl,
      iconSvg,
      isActive,
      onClick,
      onKeyDown,
      tabIndex,
      id,
    }: SegmentProps,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const buttonRef = useRef<HTMLElement>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const isDisabledWithReason = disabled && !!disabledReason;

    const { targetProps, descriptionEl } = useHiddenDescription(disabledReason);

    return (
      <button
        className={clsx(styles.segment, { [styles.disabled]: !!disabled }, { [styles.selected]: isActive })}
        ref={useMergeRefs(ref, buttonRef)}
        onClick={onClick}
        onKeyDown={onKeyDown}
        disabled={disabled && !disabledReason}
        aria-disabled={isDisabledWithReason ? 'true' : undefined}
        type="button"
        tabIndex={tabIndex}
        aria-pressed={isActive ? 'true' : 'false'}
        aria-label={!text ? iconAlt : undefined}
        onFocus={isDisabledWithReason ? () => setShowTooltip(true) : undefined}
        onBlur={isDisabledWithReason ? () => setShowTooltip(false) : undefined}
        onMouseEnter={isDisabledWithReason ? () => setShowTooltip(true) : undefined}
        onMouseLeave={isDisabledWithReason ? () => setShowTooltip(false) : undefined}
        {...(isDisabledWithReason ? targetProps : {})}
        data-testid={id}
      >
        {(iconName || iconUrl || iconSvg) && (
          <InternalIcon
            className={clsx(styles.icon, text ? styles['with-text'] : styles['with-no-text'])}
            name={iconName}
            url={iconUrl}
            svg={iconSvg}
            alt={iconAlt}
            variant={disabled ? 'disabled' : 'normal'}
          />
        )}
        <span>{text}</span>

        {isDisabledWithReason && (
          <>
            {descriptionEl}
            {showTooltip && (
              <Tooltip className={styles['disabled-reason-tooltip']} trackRef={buttonRef} value={disabledReason!} />
            )}
          </>
        )}
      </button>
    );
  }
);
