// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { Ref } from 'react';
import clsx from 'clsx';

import { ButtonProps } from '../../button/interfaces';
import { InternalButton } from '../../button/internal';
import { IconProps } from '../../icon/interfaces';
import Icon from '../../icon/internal';
import { useAppLayoutInternals } from './context';

import styles from './styles.css.js';

export interface TriggerButtonProps {
  ariaLabel?: string;
  className?: string;
  iconName?: IconProps.Name;
  iconSvg?: React.ReactNode;
  ariaExpanded: boolean | undefined;
  ariaControls?: string;
  disabled?: boolean;
  /**
   * Ovewrwrites any internal testIds when provided
   */
  testId?: string;
  /**
   * If button is selected. Used only for desktop and applies a selected class for desktop. Mobile does not need the class as the trigger buttons are hidden by the open drawer
   */
  selected?: boolean;
  onClick: () => void;
  badge?: boolean;
  highContrastHeader?: boolean;
}

function TriggerButton(
  {
    ariaLabel,
    className,
    iconName,
    iconSvg,
    ariaExpanded,
    ariaControls,
    onClick,
    testId,
    disabled = false,
    badge,
    selected = false,
    highContrastHeader,
  }: TriggerButtonProps,
  ref: React.Ref<ButtonProps.Ref>
) {
  const { isMobile } = useAppLayoutInternals();

  return (
    <div className={clsx(styles['trigger-wrapper'], !highContrastHeader && styles['remove-high-contrast-header'])}>
      {isMobile ? (
        <InternalButton
          ariaExpanded={ariaExpanded}
          ariaLabel={ariaLabel}
          ariaControls={ariaControls}
          className={className}
          disabled={disabled}
          ref={ref}
          formAction="none"
          iconName={iconName}
          iconSvg={iconSvg}
          badge={badge}
          onClick={onClick}
          variant="icon"
          __nativeAttributes={{
            'aria-haspopup': true,
            ...(testId && {
              'data-testid': testId,
            }),
          }}
        />
      ) : (
        <>
          <button
            aria-expanded={ariaExpanded}
            aria-controls={ariaControls}
            aria-haspopup={true}
            aria-label={ariaLabel}
            aria-disabled={disabled}
            disabled={disabled}
            className={clsx(
              styles.trigger,
              {
                [styles.selected]: selected,
                [styles.badge]: badge,
              },
              className
            )}
            onClick={onClick}
            ref={ref as Ref<HTMLButtonElement>}
            type="button"
            data-testid={testId}
          >
            <span className={clsx(badge && styles['trigger-badge-wrapper'])}>
              {(iconName || iconSvg) && <Icon name={iconName} svg={iconSvg} />}
            </span>
          </button>
          {badge && <div className={styles.dot} />}
        </>
      )}
    </div>
  );
}

export default React.forwardRef(TriggerButton);
