// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ExpandableSectionProps } from './interfaces';
import React, { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import useFocusVisible from '../internal/hooks/focus-visible';
import InternalIcon from '../icon/internal';
import clsx from 'clsx';
import styles from './styles.css.js';
import InternalHeader from '../header/internal';
import ScreenreaderOnly from '../internal/components/screenreader-only';
import { generateUniqueId } from '../internal/hooks/use-unique-id';
import { isDevelopment } from '../internal/is-development';
import { warnOnce } from '../internal/logging';

interface ExpandableDefaultHeaderProps {
  id: string;
  className?: string;
  children?: ReactNode;
  expanded: boolean;
  ariaControls: string;
  ariaLabel?: string;
  onKeyUp: KeyboardEventHandler;
  onKeyDown: KeyboardEventHandler;
  onClick: MouseEventHandler;
  icon: JSX.Element;
}

interface ExpandableNavigationHeaderProps extends Omit<ExpandableDefaultHeaderProps, 'onKeyUp' | 'onKeyDown'> {
  ariaLabelledBy?: string;
}

interface ExpandableContainerHeaderProps extends ExpandableDefaultHeaderProps {
  headerDescription?: ReactNode;
  headerCounter?: string;
  headingTagOverride?: ExpandableSectionProps.HeadingTag;
}

interface ExpandableSectionHeaderProps extends Omit<ExpandableDefaultHeaderProps, 'children' | 'icon'> {
  variant: ExpandableSectionProps.Variant;
  header?: ReactNode;
  headerText?: ReactNode;
  headerDescription?: ReactNode;
  headerCounter?: string;
  headingTagOverride?: ExpandableSectionProps.HeadingTag;
  ariaLabelledBy?: string;
}

const ExpandableDefaultHeader = ({
  id,
  className,
  onClick,
  ariaLabel,
  ariaControls,
  expanded,
  children,
  icon,
  onKeyUp,
  onKeyDown,
}: ExpandableDefaultHeaderProps) => {
  const focusVisible = useFocusVisible();
  return (
    <div
      id={id}
      role="button"
      className={className}
      tabIndex={0}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-expanded={expanded}
      {...focusVisible}
    >
      <div className={styles['icon-container']}>{icon}</div>
      {children}
    </div>
  );
};

const ExpandableNavigationHeader = ({
  id,
  className,
  onClick,
  ariaLabelledBy,
  ariaLabel,
  ariaControls,
  expanded,
  children,
  icon,
}: ExpandableNavigationHeaderProps) => {
  const focusVisible = useFocusVisible();
  return (
    <div id={id} className={className} onClick={onClick}>
      <button
        className={styles['icon-container']}
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
        aria-controls={ariaControls}
        aria-expanded={expanded}
        {...focusVisible}
      >
        {icon}
      </button>
      {children}
    </div>
  );
};

const ExpandableContainerHeader = ({
  id,
  className,
  onClick,
  ariaLabel,
  ariaControls,
  expanded,
  children,
  icon,
  headerDescription,
  headerCounter,
  headingTagOverride,
  onKeyUp,
  onKeyDown,
}: ExpandableContainerHeaderProps) => {
  const focusVisible = useFocusVisible();
  const screenreaderContentId = generateUniqueId('expandable-section-header-content-');
  return (
    <div id={id} className={className} onClick={onClick} {...focusVisible}>
      <InternalHeader
        variant={'h2'}
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
          aria-label={ariaLabel}
          // Do not use aria-labelledby={id} but ScreenreaderOnly because safari+VO does not read headerText in this case.
          aria-labelledby={ariaLabel ? undefined : screenreaderContentId}
          aria-controls={ariaControls}
          aria-expanded={expanded}
        >
          <span className={styles['icon-container']}>{icon}</span>
          <span>{children}</span>
        </span>
      </InternalHeader>
      <ScreenreaderOnly id={screenreaderContentId}>
        {children} {headerCounter} {headerDescription}
      </ScreenreaderOnly>
    </div>
  );
};

export const ExpandableSectionHeader = ({
  id,
  className,
  variant,
  header,
  headerText,
  headerDescription,
  headerCounter,
  headingTagOverride,
  expanded,
  ariaControls,
  ariaLabel,
  ariaLabelledBy,
  onKeyUp,
  onKeyDown,
  onClick,
}: ExpandableSectionHeaderProps) => {
  const icon = (
    <InternalIcon
      size={variant === 'container' ? 'medium' : 'normal'}
      className={clsx(styles.icon, expanded && styles.expanded)}
      name="caret-down-filled"
    />
  );
  const defaultHeaderProps = {
    id: id,
    icon: icon,
    expanded: expanded,
    ariaControls: ariaControls,
    ariaLabel: ariaLabel,
    onClick: onClick,
  };

  const triggerClassName = clsx(styles.trigger, styles[`trigger-${variant}`], expanded && styles['trigger-expanded']);
  if (variant === 'navigation') {
    return (
      <ExpandableNavigationHeader
        className={clsx(className, triggerClassName)}
        ariaLabelledBy={ariaLabelledBy}
        {...defaultHeaderProps}
      >
        {headerText ?? header}
      </ExpandableNavigationHeader>
    );
  }

  if (variant === 'container' && headerText) {
    return (
      <ExpandableContainerHeader
        className={clsx(className, triggerClassName, expanded && styles.expanded)}
        headerDescription={headerDescription}
        headerCounter={headerCounter}
        headingTagOverride={headingTagOverride}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        {...defaultHeaderProps}
      >
        {headerText}
      </ExpandableContainerHeader>
    );
  }

  if (variant === 'container' && header && isDevelopment) {
    warnOnce(
      'ExpandableSection',
      'Do not use <Header> in header, use headerText instead. For a11y, provide the button within the heading.'
    );
  }

  return (
    <ExpandableDefaultHeader
      className={clsx(className, triggerClassName, styles.focusable, expanded && styles.expanded)}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      {...defaultHeaderProps}
    >
      {headerText ?? header}
    </ExpandableDefaultHeader>
  );
};
