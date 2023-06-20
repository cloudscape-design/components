// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ExpandableSectionProps } from './interfaces';
import React, { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import InternalIcon from '../icon/internal';
import clsx from 'clsx';
import styles from './styles.css.js';
import InternalHeader from '../header/internal';
import { isDevelopment } from '../internal/is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

export const componentName = 'ExpandableSection';

interface ExpandableDefaultHeaderProps {
  id: string;
  descriptionId?: string;
  className?: string;
  children?: ReactNode;
  expanded: boolean;
  ariaControls: string;
  ariaLabel?: string;
  onKeyUp: KeyboardEventHandler;
  onKeyDown: KeyboardEventHandler;
  onClick: MouseEventHandler;
  icon: JSX.Element;
  variant: ExpandableSectionProps.Variant;
}

interface ExpandableNavigationHeaderProps extends Omit<ExpandableDefaultHeaderProps, 'onKeyUp' | 'onKeyDown'> {
  ariaLabelledBy?: string;
}

interface ExpandableHeaderTextWrapperProps extends ExpandableDefaultHeaderProps {
  headerDescription?: ReactNode;
  headerCounter?: string;
  headerInfo?: ReactNode;
  headerActions?: ReactNode;
  headingTagOverride?: ExpandableSectionProps.HeadingTag;
}

interface ExpandableSectionHeaderProps extends Omit<ExpandableDefaultHeaderProps, 'children' | 'icon'> {
  variant: ExpandableSectionProps.Variant;
  header?: ReactNode;
  headerText?: ReactNode;
  headerDescription?: ReactNode;
  headerCounter?: string;
  headerInfo?: ReactNode;
  headerActions?: ReactNode;
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
  variant,
}: ExpandableDefaultHeaderProps) => {
  return (
    <div
      id={id}
      role="button"
      className={clsx(className, styles['expand-button'])}
      tabIndex={0}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-expanded={expanded}
    >
      <div className={clsx(styles['icon-container'], styles[`icon-container-${variant}`])}>{icon}</div>
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
  return (
    <div id={id} className={className} onClick={onClick}>
      <button
        className={clsx(styles['icon-container'], styles['expand-button'])}
        aria-labelledby={ariaLabelledBy}
        aria-label={ariaLabel}
        aria-controls={ariaControls}
        aria-expanded={expanded}
        type="button"
      >
        {icon}
      </button>
      {children}
    </div>
  );
};

const ExpandableHeaderTextWrapper = ({
  id,
  descriptionId,
  className,
  onClick,
  ariaLabel,
  ariaControls,
  expanded,
  children,
  icon,
  headerDescription,
  headerCounter,
  headerInfo,
  headerActions,
  variant,
  headingTagOverride,
  onKeyUp,
  onKeyDown,
}: ExpandableHeaderTextWrapperProps) => {
  const isContainer = variant === 'container';
  const HeadingTag = headingTagOverride || 'div';
  const hasInteractiveElements = isContainer && (headerInfo || headerActions);
  const listeners = { onClick, onKeyDown, onKeyUp };
  const wrapperListeners = hasInteractiveElements ? undefined : listeners;
  const headerButtonListeners = hasInteractiveElements ? listeners : undefined;
  const headerButton = (
    <span
      className={clsx(
        styles['expand-button'],
        isContainer ? styles['header-container-button'] : styles['header-button']
      )}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-labelledby={!ariaLabel && isContainer ? id : undefined}
      aria-describedby={isContainer && headerDescription ? descriptionId : undefined}
      aria-controls={ariaControls}
      aria-expanded={expanded}
      {...headerButtonListeners}
    >
      <span className={clsx(styles['icon-container'], styles[`icon-container-${variant}`])}>{icon}</span>
      <span id={id}>{children}</span>
    </span>
  );

  return (
    <div
      className={clsx(className, hasInteractiveElements && styles['with-interactive-elements'])}
      {...wrapperListeners}
    >
      {isContainer ? (
        <InternalHeader
          variant="h2"
          description={headerDescription && <span id={descriptionId}>{headerDescription}</span>}
          counter={headerCounter}
          info={headerInfo}
          actions={headerActions}
          headingTagOverride={headingTagOverride}
        >
          {headerButton}
        </InternalHeader>
      ) : (
        <HeadingTag className={styles['header-wrapper']}>{headerButton}</HeadingTag>
      )}
    </div>
  );
};

export const ExpandableSectionHeader = ({
  id,
  descriptionId,
  className,
  variant,
  header,
  headerText,
  headerDescription,
  headerCounter,
  headerInfo,
  headerActions,
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
    variant,
  };

  if ((headerDescription || headerCounter || headerInfo || headerActions) && variant !== 'container' && isDevelopment) {
    warnOnce(
      componentName,
      'The `headerCounter`, `headerDescription`, `headerInfo` and `headerActions` props are only supported for the "container" variant.'
    );
  }

  const wrapperClassName = clsx(styles.wrapper, styles[`wrapper-${variant}`], expanded && styles['wrapper-expanded']);
  if (variant === 'navigation') {
    return (
      <ExpandableNavigationHeader
        className={clsx(className, wrapperClassName)}
        ariaLabelledBy={ariaLabelledBy}
        {...defaultHeaderProps}
      >
        {headerText ?? header}
      </ExpandableNavigationHeader>
    );
  }

  if (headerText) {
    return (
      <ExpandableHeaderTextWrapper
        className={clsx(className, wrapperClassName, expanded && styles.expanded)}
        descriptionId={descriptionId}
        headerDescription={headerDescription}
        headerCounter={headerCounter}
        headerInfo={headerInfo}
        headerActions={headerActions}
        headingTagOverride={headingTagOverride}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        {...defaultHeaderProps}
      >
        {headerText}
      </ExpandableHeaderTextWrapper>
    );
  }

  if (variant === 'container' && header && isDevelopment) {
    warnOnce(componentName, 'Use `headerText` instead of `header` to provide the button within the heading for a11y.');
  }

  return (
    <ExpandableDefaultHeader
      className={clsx(className, wrapperClassName, styles.focusable, expanded && styles.expanded)}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      {...defaultHeaderProps}
    >
      {header}
    </ExpandableDefaultHeader>
  );
};
