// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { fireCancelableEvent, isPlainLeftClick } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import styles from './styles.css.js';
import { ButtonIconProps, LeftIcon, RightIcon } from './icon-helper';
import { ButtonProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import LiveRegion from '../internal/components/live-region';
import { useButtonContext } from '../internal/context/button-context';
import { useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import {
  DATA_ATTR_FUNNEL_VALUE,
  getFunnelValueSelector,
  getNameFromSelector,
  getSubStepAllSelector,
} from '../internal/analytics/selectors';
import { FunnelMetrics } from '../internal/analytics';
import { useUniqueId } from '../internal/hooks/use-unique-id';

export type InternalButtonProps = Omit<ButtonProps, 'variant'> & {
  variant?: ButtonProps['variant'] | 'flashbar-icon' | 'breadcrumb-group' | 'menu-trigger' | 'modal-dismiss';
  __nativeAttributes?: Record<string, any>;
  __iconClass?: string;
  __activated?: boolean;
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
      ariaDescribedby,
      ariaExpanded,
      fullWidth,
      __nativeAttributes,
      __internalRootRef = null,
      __activated = false,
      ...props
    }: InternalButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    checkSafeUrl('Button', href);
    const isAnchor = Boolean(href);
    const isNotInteractive = loading || disabled;
    const shouldHaveContent =
      children && ['icon', 'inline-icon', 'flashbar-icon', 'modal-dismiss'].indexOf(variant) === -1;

    const buttonRef = useRef<HTMLElement>(null);
    useForwardFocus(ref, buttonRef);

    const buttonContext = useButtonContext();

    const uniqueId = useUniqueId('button');
    const { funnelInteractionId } = useFunnel();
    const { stepNumber, stepNameSelector } = useFunnelStep();
    const { subStepSelector, subStepNameSelector } = useFunnelSubStep();

    const handleClick = (event: React.MouseEvent) => {
      if (isNotInteractive) {
        return event.preventDefault();
      }

      if (isAnchor && isPlainLeftClick(event)) {
        fireCancelableEvent(onFollow, { href, target }, event);

        if ((iconName === 'external' || target === '_blank') && funnelInteractionId) {
          const stepName = getNameFromSelector(stepNameSelector);
          const subStepName = getNameFromSelector(subStepNameSelector);

          FunnelMetrics.externalLinkInteracted({
            funnelInteractionId,
            stepNumber,
            stepName,
            stepNameSelector,
            subStepSelector,
            subStepName,
            subStepNameSelector,
            elementSelector: getFunnelValueSelector(uniqueId),
            subStepAllSelector: getSubStepAllSelector(),
          });
        }
      }

      const { altKey, button, ctrlKey, metaKey, shiftKey } = event;
      fireCancelableEvent(onClick, { altKey, button, ctrlKey, metaKey, shiftKey }, event);
      buttonContext.onClick({ variant });
    };

    const buttonClass = clsx(props.className, styles.button, styles[`variant-${variant}`], {
      [styles.disabled]: isNotInteractive,
      [styles['button-no-wrap']]: !wrapText,
      [styles['button-no-text']]: !shouldHaveContent,
      [styles['is-activated']]: __activated,
      [styles['full-width']]: shouldHaveContent && fullWidth,
    });

    const buttonProps = {
      ...props,
      ...__nativeAttributes,
      // https://github.com/microsoft/TypeScript/issues/36659
      ref: useMergeRefs(buttonRef, __internalRootRef),
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-expanded': ariaExpanded,
      // add ariaLabel as `title` as visible hint text
      title: ariaLabel,
      className: buttonClass,
      onClick: handleClick,
      [DATA_ATTR_FUNNEL_VALUE]: uniqueId,
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

    const { loadingButtonCount } = useFunnel();
    useEffect(() => {
      if (loading) {
        loadingButtonCount.current++;
        return () => {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          loadingButtonCount.current--;
        };
      }
    }, [loading, loadingButtonCount]);

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
            tabIndex={isNotInteractive ? -1 : undefined}
            aria-disabled={isNotInteractive ? true : undefined}
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
        <button
          {...buttonProps}
          type={formAction === 'none' ? 'button' : 'submit'}
          disabled={disabled}
          aria-disabled={loading && !disabled ? true : undefined}
        >
          {buttonContent}
        </button>
        {loading && loadingText && <LiveRegion>{loadingText}</LiveRegion>}
      </>
    );
  }
);

export default InternalButton;
