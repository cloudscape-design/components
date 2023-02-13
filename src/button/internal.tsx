// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useCallback, useRef } from 'react';
import { fireCancelableEvent, isPlainLeftClick } from '../internal/events';
import useFocusVisible from '../internal/hooks/focus-visible';
import useForwardFocus from '../internal/hooks/forward-focus';
import styles from './styles.css.js';
import { ButtonIconProps, LeftIcon, RightIcon } from './icon-helper';
import { ButtonProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import LiveRegion from '../internal/components/live-region';

type InternalButtonProps = Omit<ButtonProps, 'variant'> & {
  variant?: ButtonProps['variant'] | 'flashbar-icon' | 'breadcrumb-group' | 'menu-trigger' | 'modal-dismiss';
  __nativeAttributes?: Record<string, any>;
  __iconClass?: string;
  __activated?: boolean;
  __hideFocusOutline?: boolean;
} & InternalBaseComponentProps;

export const InternalButton = React.forwardRef(
  (
    {
      children,
      iconName,
      __iconClass,
      onClick,
      onFollow,
      iconAlign = 'left',
      iconUrl,
      iconSvg,
      iconAlt,
      variant = 'normal',
      loading = false,
      loadingText,
      disabled = false,
      wrapText = true,
      href,
      target,
      rel,
      download,
      formAction = 'submit',
      ariaLabel,
      ariaExpanded,
      __hideFocusOutline = false,
      __nativeAttributes,
      __internalRootRef = null,
      __activated = false,
      ...props
    }: InternalButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    checkSafeUrl('Button', href);
    const focusVisible = useFocusVisible();
    const isAnchor = Boolean(href);
    const isDisabled = loading || disabled;
    const shouldHaveContent =
      children && ['icon', 'inline-icon', 'flashbar-icon', 'modal-dismiss'].indexOf(variant) === -1;

    const buttonRef = useRef<HTMLElement>(null);
    useForwardFocus(ref, buttonRef);

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        if (isAnchor && isDisabled) {
          return event.preventDefault();
        }

        if (isAnchor && isPlainLeftClick(event)) {
          fireCancelableEvent(onFollow, null, event);
        }

        const { altKey, button, ctrlKey, metaKey, shiftKey } = event;
        fireCancelableEvent(onClick, { altKey, button, ctrlKey, metaKey, shiftKey }, event);
      },
      [isAnchor, isDisabled, onClick, onFollow]
    );

    const buttonClass = clsx(props.className, styles.button, styles[`variant-${variant}`], {
      [styles.disabled]: isDisabled,
      [styles['button-no-wrap']]: !wrapText,
      [styles['button-no-text']]: !shouldHaveContent,
      [styles['is-activated']]: __activated,
    });

    const buttonProps = {
      ...props,
      ...(__hideFocusOutline ? undefined : focusVisible),
      ...__nativeAttributes,
      // https://github.com/microsoft/TypeScript/issues/36659
      ref: useMergeRefs(buttonRef as any, __internalRootRef),
      'aria-label': ariaLabel,
      'aria-expanded': ariaExpanded,
      className: buttonClass,
      onClick: handleClick,
    } as const;
    const iconProps: ButtonIconProps = {
      loading,
      iconName,
      iconAlign,
      iconUrl,
      iconSvg,
      iconAlt,
      variant,
      iconClass: __iconClass,
      iconSize: variant === 'modal-dismiss' ? 'medium' : 'normal',
    };
    const buttonContent = (
      <>
        <LeftIcon {...iconProps} />
        {shouldHaveContent && <span className={styles.content}>{children}</span>}
        <RightIcon {...iconProps} />
      </>
    );

    if (isAnchor) {
      return (
        // https://github.com/yannickcr/eslint-plugin-react/issues/2962
        // eslint-disable-next-line react/jsx-no-target-blank
        <>
          <a
            {...buttonProps}
            href={href}
            target={target}
            // security recommendation: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
            rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
            tabIndex={isDisabled ? -1 : undefined}
            aria-disabled={isDisabled ? true : undefined}
            download={download}
          >
            {buttonContent}
          </a>
          {loading && loadingText && <LiveRegion>{loadingText}</LiveRegion>}
        </>
      );
    }
    return (
      <>
        <button {...buttonProps} type={formAction === 'none' ? 'button' : 'submit'} disabled={isDisabled}>
          {buttonContent}
        </button>
        {loading && loadingText && <LiveRegion>{loadingText}</LiveRegion>}
      </>
    );
  }
);

export default InternalButton;
