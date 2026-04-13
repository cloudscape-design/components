// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import InternalStructuredItem from '../internal/components/structured-item';
import { fireCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { type ActionCardProps } from './interfaces';
import { getContentStyles, getHeaderStyles, getRootStyles } from './style';

import styles from './styles.css.js';
import testStyles from './test-classes/styles.css.js';

export type InternalActionCardProps = ActionCardProps & InternalBaseComponentProps;

const InternalActionCard = React.forwardRef(
  (
    {
      header,
      description,
      children,
      onClick,
      ariaLabel,
      ariaDescribedby,
      disabled,
      disableHeaderPaddings,
      disableContentPaddings,
      icon,
      iconVerticalAlignment,
      variant,
      style,
      nativeButtonAttributes,
      __internalRootRef,
      ...rest
    }: InternalActionCardProps,
    ref: React.Ref<ActionCardProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const headerId = useUniqueId('action-card-header-');
    const standaloneButtonId = useUniqueId('action-card-button-');
    const descriptionId = useUniqueId('action-card-description-');
    const bodyId = useUniqueId('action-card-body-');

    useForwardFocus(ref, buttonRef);

    if (!header && !ariaLabel) {
      warnOnce(
        'ActionCard',
        'An accessible name is required. Provide either a `header` or an `ariaLabel` prop so the action card has a meaningful label for screen reader users.'
      );
    }

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        return event.preventDefault();
      }
      fireCancelableEvent(onClick, {}, event);
    };

    const rootStyleProps = getRootStyles(style);
    const headerStyleProps = getHeaderStyles(style);
    const contentStyleProps = getContentStyles(style);

    const headerRowEmpty = !header && !description;

    const iconWrapper = icon && (
      <div className={clsx(styles.icon, testStyles.icon)} aria-hidden="true">
        {icon}
      </div>
    );
    const iconInHeaderRow = icon && iconVerticalAlignment === 'top' && !!header;

    const mergedRootRef = useMergeRefs(rootRef, __internalRootRef);

    // Link the description element as the button's accessible description
    // when the button already has a name (via header text or ariaLabel).
    if (!ariaDescribedby && description && (ariaLabel || header)) {
      ariaDescribedby = descriptionId;
    }

    const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
      ...nativeButtonAttributes,
      type: 'button',
      className: clsx(
        styles['header-button'],
        testStyles.button,
        disabled && styles.disabled,
        variant && styles[`variant-${variant}`],
        nativeButtonAttributes?.className
      ),
      onClick: handleButtonClick,
      'aria-describedby': ariaDescribedby,
      'aria-disabled': disabled || undefined,
    };

    const headerSection = !headerRowEmpty ? (
      <div className={clsx(styles.header, disableHeaderPaddings && styles['no-padding'])} style={headerStyleProps}>
        <InternalStructuredItem
          content={
            header && (
              <div className={clsx(styles['header-inner'], testStyles.header, disabled && styles.disabled)}>
                <button {...buttonProps} ref={buttonRef} id={headerId}>
                  {header}
                </button>
              </div>
            )
          }
          secondaryContent={
            description && (
              <div
                id={descriptionId}
                className={clsx(
                  styles.description,
                  testStyles.description,
                  disabled && styles.disabled,
                  header && styles['has-header']
                )}
              >
                {description}
              </div>
            )
          }
          disablePaddings={disableHeaderPaddings}
        />
      </div>
    ) : null;

    // When there's no header, a standalone overlay button is rendered.
    // If ariaLabel is provided, it's used directly. Otherwise, derive the button's
    // accessible name from the first available content: description or children.
    let standaloneButtonLabelledBy: string | undefined;
    if (!ariaLabel) {
      if (description) {
        standaloneButtonLabelledBy = descriptionId;
      } else if (children) {
        standaloneButtonLabelledBy = bodyId;
      }
    }

    const standaloneButton = !header ? (
      <button
        {...buttonProps}
        ref={buttonRef}
        id={standaloneButtonId}
        className={clsx(
          styles['overlay-button'],
          testStyles.button,
          disabled && styles.disabled,
          variant && styles[`variant-${variant}`],
          nativeButtonAttributes?.className
        )}
        aria-label={ariaLabel || undefined}
        aria-labelledby={standaloneButtonLabelledBy}
      />
    ) : null;

    const contentElement = (
      <div className={styles['inner-card']}>
        {iconInHeaderRow ? (
          <div className={styles['header-row']}>
            {headerSection}
            {iconWrapper}
          </div>
        ) : (
          headerSection
        )}
        {children && (
          <div
            className={clsx(styles.body, testStyles.body, disableContentPaddings && styles['no-padding'])}
            id={bodyId}
            style={contentStyleProps}
          >
            {children}
          </div>
        )}
      </div>
    );

    return (
      <div
        {...baseProps}
        ref={mergedRootRef}
        role="group"
        aria-labelledby={header ? headerId : standaloneButtonId}
        className={clsx(
          styles.root,
          styles[`variant-${variant}`],
          disabled && styles.disabled,
          disabled && testStyles.disabled,
          !!icon && styles['has-icon'],
          !!icon && styles['icon-align-end'],
          !!icon && styles[`icon-vertical-align-${iconVerticalAlignment}`],
          baseProps.className
        )}
        style={rootStyleProps}
        aria-disabled={disabled || undefined}
      >
        {standaloneButton}
        {contentElement}
        {!iconInHeaderRow && iconWrapper}
      </div>
    );
  }
);

export default InternalActionCard;
