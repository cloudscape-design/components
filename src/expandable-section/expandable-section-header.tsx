// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { ExpandableSectionProps } from './interfaces';
import React, { KeyboardEventHandler, MouseEventHandler, ReactNode } from 'react';
import InternalIcon from '../icon/internal';
import clsx from 'clsx';
import styles from './styles.css.js';
import InternalHeader, { Description as HeaderDescription } from '../header/internal';
import { isDevelopment } from '../internal/is-development';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { variantSupportsDescription } from './utils';

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

const ExpandableDeprecatedHeader = ({
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
      className={clsx(className, styles['expand-button'], styles['click-target'], styles['header-deprecated'])}
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
    <div id={id} className={clsx(className, styles['click-target'])} onClick={onClick}>
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

  const description = variantSupportsDescription(variant) && headerDescription && (
    <span id={descriptionId} className={styles[`description-${variant}`]}>
      {headerDescription}
    </span>
  );

  // If interactive elements are present, constrain the clickable area to only the icon and the header text
  // to prevent nesting interactive elements.
  const headerButtonListeners = hasInteractiveElements ? listeners : undefined;
  // For the default and footer variants with description,
  // include also the immediate wrapper around it to include the entire row for backwards compatibility,
  // but exclude the description.
  const headingTagListeners = !headerButtonListeners && !isContainer && description ? listeners : undefined;
  // For all other cases, make the entire header clickable for backwards compatibility.
  const wrapperListeners = !headerButtonListeners && !headingTagListeners ? listeners : undefined;

  const headerButton = (
    <span
      className={clsx(
        styles['expand-button'],
        isContainer ? styles['header-container-button'] : styles['header-button'],
        headerButtonListeners && styles['click-target']
      )}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-labelledby={!ariaLabel && description ? id : undefined}
      aria-describedby={description ? descriptionId : undefined}
      aria-controls={ariaControls}
      aria-expanded={expanded}
      {...headerButtonListeners}
    >
      <span className={clsx(styles['icon-container'], styles[`icon-container-${variant}`])}>{icon}</span>
      <span id={id}>{children}</span>
    </span>
  );

  return (
    <div className={clsx(className, wrapperListeners && styles['click-target'])} {...wrapperListeners}>
      {isContainer ? (
        <InternalHeader
          variant="h2"
          description={description}
          counter={headerCounter}
          info={headerInfo}
          actions={headerActions}
          headingTagOverride={headingTagOverride}
        >
          {headerButton}
        </InternalHeader>
      ) : (
        <>
          <HeadingTag
            className={clsx(styles['header-wrapper'], headingTagListeners && styles['click-target'])}
            {...headingTagListeners}
          >
            {headerButton}
          </HeadingTag>
          {description && <HeaderDescription variantOverride="h3">{description}</HeaderDescription>}
        </>
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

  if ((headerCounter || headerInfo || headerActions) && variant !== 'container' && isDevelopment) {
    warnOnce(
      componentName,
      'The `headerCounter`, `headerInfo` and `headerActions` props are only supported for the "container" variant.'
    );
  }

  if (headerDescription && variant !== 'container' && variant !== 'default' && isDevelopment) {
    warnOnce(
      componentName,
      'The `headerDescription` prop is only supported for the "default" and "container" variants.'
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
    <ExpandableDeprecatedHeader
      className={clsx(className, wrapperClassName, styles.focusable, expanded && styles.expanded)}
      onKeyUp={onKeyUp}
      onKeyDown={onKeyDown}
      {...defaultHeaderProps}
    >
      {header}
    </ExpandableDeprecatedHeader>
  );
};
