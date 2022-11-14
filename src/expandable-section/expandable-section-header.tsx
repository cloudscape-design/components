// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ExpandableSectionProps } from './interfaces';
import React, { KeyboardEventHandler, MouseEventHandler, ReactNode, useState } from 'react';
import useFocusVisible from '../internal/hooks/focus-visible';
import InternalIcon from '../icon/internal';
import clsx from 'clsx';
import styles from './styles.css.js';
import InternalHeader from '../header/internal';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { generateUniqueId } from '../internal/hooks/use-unique-id';

interface ExpandableSectionHeaderProps {
  id: string;
  className?: string;
  variant: ExpandableSectionProps.Variant;
  children?: ReactNode;
  headerText?: ReactNode;
  headerDescription?: ReactNode;
  headerCounter?: string;
  headingTagVariant: ExpandableSectionProps.HeadingVariant;
  headingTagOverride?: ExpandableSectionProps.HeadingTag;
  expanded: boolean;
  ariaControls: string;
  ariaLabelledBy?: string;
  ariaLabel?: string;
  onKeyUp: KeyboardEventHandler;
  onKeyDown: KeyboardEventHandler;
  onClick: MouseEventHandler;
}

export const ExpandableSectionHeader = ({
  id,
  className,
  variant,
  children,
  headerText,
  headerDescription,
  headerCounter,
  headingTagOverride,
  headingTagVariant,
  expanded,
  ariaControls,
  ariaLabel,
  ariaLabelledBy,
  onKeyUp,
  onKeyDown,
  onClick,
}: ExpandableSectionHeaderProps) => {
  const focusVisible = useFocusVisible();
  const [focused, setFocus] = useState(false);
  const screenreaderContentId = generateUniqueId('expandable-section-header-content-');

  const icon = (
    <InternalIcon
      size={variant === 'container' ? 'medium' : 'normal'}
      className={clsx(styles.icon, expanded && styles.expanded)}
      name="caret-down-filled"
    />
  );
  const ariaAttributes = {
    'aria-controls': ariaControls,
    'aria-expanded': expanded,
  };

  const triggerClassName = clsx(styles.trigger, styles[`trigger-${variant}`], expanded && styles['trigger-expanded']);
  if (variant === 'navigation') {
    return (
      <div id={id} className={clsx(className, triggerClassName)} onClick={onClick}>
        <button
          className={styles['icon-container']}
          type="button"
          aria-labelledby={ariaLabelledBy}
          aria-label={ariaLabel}
          {...focusVisible}
          {...ariaAttributes}
        >
          {icon}
        </button>
        {children}
      </div>
    );
  }

  if (variant === 'container' && headerText) {
    return (
      <div
        id={id}
        className={clsx(className, triggerClassName, focused && styles['header-focused'], expanded && styles.expanded)}
        onClick={onClick}
        {...focusVisible}
      >
        <InternalHeader
          variant={headingTagVariant}
          description={headerDescription}
          counter={headerCounter}
          headingTagOverride={headingTagOverride}
        >
          <span
            className={styles['header-container-button']}
            role="button"
            tabIndex={0}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            aria-label={ariaLabel}
            // Do not use aria-labelledby={id} but ScreenreaderOnly because safari+VO does not read headerText in this case.
            aria-labelledby={ariaLabel ? undefined : screenreaderContentId}
            {...ariaAttributes}
          >
            <span className={styles['icon-container']}>{icon}</span>
            <span>{headerText}</span>
          </span>
        </InternalHeader>
        <ScreenreaderOnly id={screenreaderContentId}>
          {headerText} {headerCounter} {headerDescription}
        </ScreenreaderOnly>
      </div>
    );
  }

  return (
    <div
      id={id}
      role="button"
      className={clsx(className, triggerClassName, styles.focusable, expanded && styles.expanded)}
      tabIndex={0}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onClick={onClick}
      aria-label={ariaLabel}
      {...focusVisible}
      {...ariaAttributes}
    >
      <div className={styles['icon-container']}>{icon}</div>
      {children}
    </div>
  );
};
