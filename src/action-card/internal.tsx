// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component';
import InternalStructuredItem from '../internal/components/structured-item';
import { fireCancelableEvent, isPlainLeftClick } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import WithNativeAttributes from '../internal/utils/with-native-attributes';
import { ActionCardProps } from './interfaces';

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
      onFollow,
      href,
      target,
      rel,
      download,
      ariaLabel,
      ariaDescribedby,
      disabled,
      disableHeaderPaddings,
      disableContentPaddings,
      icon,
      iconVerticalAlignment,
      variant,
      nativeButtonAttributes,
      nativeAnchorAttributes,
      __internalRootRef,
      ...rest
    }: InternalActionCardProps,
    ref: React.Ref<ActionCardProps.Ref>
  ) => {
    const baseProps = getBaseProps(rest);
    const buttonRef = useRef<HTMLElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    const headerId = useUniqueId('action-card-header-');
    const standaloneButtonId = useUniqueId('action-card-button-');
    const descriptionId = useUniqueId('action-card-description-');
    const bodyId = useUniqueId('action-card-body-');

    useForwardFocus(ref, buttonRef);

    checkSafeUrl('ActionCard', href);
    const isAnchor = Boolean(href);

    if (!header && !ariaLabel) {
      warnOnce(
        'ActionCard',
        'An accessible name is required. Provide either a `header` or an `ariaLabel` prop so the action card has a meaningful label for screen reader users.'
      );
    }

    const handleButtonClick = (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        return event.preventDefault();
      }
      if (isAnchor && isPlainLeftClick(event)) {
        fireCancelableEvent(onFollow, { href, target }, event);
      }
      fireCancelableEvent(onClick, {}, event);
    };

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

    // Shared props between <a>-tag and <button>-tag
    const interactiveProps = {
      className: clsx(
        styles['header-button'],
        testStyles.button,
        disabled && styles.disabled,
        variant && styles[`variant-${variant}`]
      ),
      onClick: handleButtonClick,
      'aria-describedby': ariaDescribedby,
      'aria-disabled': disabled || undefined,
    };

    // <a>-tag specific props
    const anchorProps = {
      href: disabled ? undefined : href,
      role: disabled ? 'link' : undefined,
      tabIndex: disabled ? 0 : undefined,
      target,
      // security recommendation: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
      rel: rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined),
      download,
    };

    const headerSection = !headerRowEmpty ? (
      <div className={clsx(styles.header, disableHeaderPaddings && styles['no-padding'])}>
        <InternalStructuredItem
          content={
            header && (
              <div className={clsx(styles['header-inner'], testStyles.header, disabled && styles.disabled)}>
                {isAnchor ? (
                  <WithNativeAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
                    {...interactiveProps}
                    {...anchorProps}
                    tag="a"
                    componentName="ActionCard"
                    nativeAttributes={nativeAnchorAttributes}
                    ref={buttonRef as React.Ref<HTMLAnchorElement>}
                    id={headerId}
                  >
                    {header}
                  </WithNativeAttributes>
                ) : (
                  <WithNativeAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
                    {...interactiveProps}
                    type="button"
                    tag="button"
                    componentName="ActionCard"
                    nativeAttributes={nativeButtonAttributes}
                    ref={buttonRef as React.Ref<HTMLButtonElement>}
                    id={headerId}
                  >
                    {header}
                  </WithNativeAttributes>
                )}
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

    const standaloneOverlayProps = {
      ...interactiveProps,
      id: standaloneButtonId,
      className: clsx(
        styles['overlay-button'],
        testStyles.button,
        disabled && styles.disabled,
        variant && styles[`variant-${variant}`]
      ),
      'aria-label': ariaLabel || undefined,
      'aria-labelledby': standaloneButtonLabelledBy,
    };

    const standaloneButton = !header ? (
      isAnchor ? (
        <WithNativeAttributes<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>
          {...standaloneOverlayProps}
          {...anchorProps}
          tag="a"
          componentName="ActionCard"
          nativeAttributes={nativeAnchorAttributes}
          ref={buttonRef as React.Ref<HTMLAnchorElement>}
        />
      ) : (
        <WithNativeAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>
          {...standaloneOverlayProps}
          type="button"
          tag="button"
          componentName="ActionCard"
          nativeAttributes={nativeButtonAttributes}
          ref={buttonRef as React.Ref<HTMLButtonElement>}
        />
      )
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
