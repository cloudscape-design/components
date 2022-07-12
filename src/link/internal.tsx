// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import InternalIcon from '../icon/internal';
import styles from './styles.css.js';
import useFocusVisible from '../internal/hooks/focus-visible';
import { getBaseProps } from '../internal/base-component';
import { fireCancelableEvent, isPlainLeftClick } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { KeyCode } from '../internal/keycode';
import { LinkProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { checkSafeUrl } from '../internal/utils/check-safe-url';

type InternalLinkProps = InternalBaseComponentProps &
  Omit<LinkProps, 'variant'> & {
    variant?: LinkProps['variant'] | 'top-navigation' | 'link' | 'recovery';
  };

const InternalLink = React.forwardRef(
  (
    {
      variant = 'secondary',
      fontSize = 'body-m',
      color = 'normal',
      external = false,
      target,
      href,
      rel,
      ariaLabel,
      externalIconAriaLabel,
      onFollow,
      children,
      __internalRootRef = null,
      ...props
    }: InternalLinkProps,
    ref: React.Ref<LinkProps.Ref>
  ) => {
    checkSafeUrl('Link', href);
    const isButton = !href;
    const specialStyles = ['top-navigation', 'link', 'recovery'];
    const hasSpecialStyle = specialStyles.indexOf(variant) > -1;

    const focusVisible = useFocusVisible();
    const baseProps = getBaseProps(props);
    const anchorTarget = target ?? (external ? '_blank' : undefined);
    const anchorRel = rel ?? (anchorTarget === '_blank' ? 'noopener noreferrer' : undefined);

    const fireFollowEvent = (event: React.SyntheticEvent) => {
      fireCancelableEvent(onFollow, { href, external, target: anchorTarget }, event);
    };

    const handleLinkClick = (event: React.MouseEvent) => {
      if (isPlainLeftClick(event)) {
        fireFollowEvent(event);
      }
    };

    const handleButtonClick = (event: React.MouseEvent) => {
      fireFollowEvent(event);
    };

    const handleButtonKeyDown = (event: React.KeyboardEvent) => {
      // Prevent the page from scrolling down when spacebar is pressed.
      if (event.keyCode === KeyCode.space) {
        event.preventDefault();
      }
    };

    const handleButtonKeyUp = (event: React.KeyboardEvent) => {
      if (event.keyCode === KeyCode.space || event.keyCode === KeyCode.enter) {
        fireFollowEvent(event);
      }
    };

    const linkRef = useRef<HTMLElement>(null);
    const isVisualRefresh = useVisualRefresh();
    useForwardFocus(ref, linkRef);

    // Visual refresh should only add styles to buttons that don't already have unique styles (e.g. primary/secondary variants)
    const applyButtonStyles = isButton && isVisualRefresh && !hasSpecialStyle;

    const sharedProps = {
      ...focusVisible,
      ...baseProps,
      // https://github.com/microsoft/TypeScript/issues/36659
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref: useMergeRefs(linkRef as any, __internalRootRef),
      className: clsx(
        styles.link,
        baseProps.className,
        applyButtonStyles ? styles.button : null,
        styles[getVariantStyle(variant)],
        styles[getFontSizeStyle(variant, fontSize)],
        styles[getColorStyle(variant, color)]
      ),
      'aria-label': ariaLabel,
    };

    const content = (
      <>
        {children}
        {external && (
          <>
            {' '}
            <span
              className={styles.icon}
              aria-label={externalIconAriaLabel}
              role={externalIconAriaLabel ? 'img' : undefined}
            >
              <InternalIcon name="external" size="inherit" />
            </span>
          </>
        )}
      </>
    );

    if (isButton) {
      return (
        <a
          {...sharedProps}
          role="button"
          tabIndex={0}
          onKeyDown={handleButtonKeyDown}
          onKeyUp={handleButtonKeyUp}
          onClick={handleButtonClick}
        >
          {content}
        </a>
      );
    }

    return (
      // we dynamically set proper rel in the code above
      // eslint-disable-next-line react/jsx-no-target-blank
      <a {...sharedProps} target={anchorTarget} rel={anchorRel} href={href} onClick={handleLinkClick}>
        {content}
      </a>
    );
  }
);

function getVariantStyle(variant: Exclude<InternalLinkProps['variant'], undefined>) {
  return `variant-${variant.replace(/^awsui-/, '')}`;
}

function getFontSizeStyle(variant: InternalLinkProps['variant'], fontSize: InternalLinkProps['fontSize']) {
  switch (variant) {
    case 'info':
      return 'font-size-body-s';
    case 'awsui-value-large':
      return 'font-size-display-l';
    default:
      return `font-size-${fontSize}`;
  }
}

function getColorStyle(variant: InternalLinkProps['variant'], color: InternalLinkProps['color']) {
  return `color-${variant === 'info' ? 'normal' : color}`;
}

export default InternalLink;
