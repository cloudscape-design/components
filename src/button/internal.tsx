// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import {
  getAnalyticsLabelAttribute,
  getAnalyticsMetadataAttribute,
} from '@cloudscape-design/component-toolkit/internal/analytics-metadata';

import { useInternalI18n } from '../i18n/context';
import Icon from '../icon/internal';
import { FunnelMetrics } from '../internal/analytics';
import { useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import {
  DATA_ATTR_FUNNEL_VALUE,
  getFunnelValueSelector,
  getSubStepAllSelector,
  getTextFromSelector,
} from '../internal/analytics/selectors';
import Tooltip from '../internal/components/tooltip/index.js';
import { useButtonContext } from '../internal/context/button-context';
import { useSingleTabStopNavigation } from '../internal/context/single-tab-stop-navigation-context';
import { fireCancelableEvent, isPlainLeftClick } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import useHiddenDescription from '../internal/hooks/use-hidden-description';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useModalContextLoadingButtonComponent } from '../internal/hooks/use-modal-component-analytics';
import { usePerformanceMarks } from '../internal/hooks/use-performance-marks';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import InternalLiveRegion from '../live-region/internal';
import { GeneratedAnalyticsMetadataButtonFragment } from './analytics-metadata/interfaces';
import { ButtonIconProps, LeftIcon, RightIcon } from './icon-helper';
import { ButtonProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export type InternalButtonProps = Omit<ButtonProps, 'variant'> & {
  variant?: ButtonProps['variant'] | 'flashbar-icon' | 'breadcrumb-group' | 'menu-trigger' | 'modal-dismiss';
  badge?: boolean;
  analyticsAction?: string;
  __nativeAttributes?:
    | (React.HTMLAttributes<HTMLAnchorElement> & React.HTMLAttributes<HTMLButtonElement>)
    | Record<`data-${string}`, string>;
  __iconClass?: string;
  __focusable?: boolean;
  __injectAnalyticsComponentMetadata?: boolean;
  __title?: string;
  __emitPerformanceMarks?: boolean;
} & InternalBaseComponentProps<HTMLAnchorElement | HTMLButtonElement>;

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
      disabledReason,
      wrapText = true,
      href,
      external,
      target: targetOverride,
      rel,
      download,
      formAction = 'submit',
      ariaLabel,
      ariaDescribedby,
      ariaExpanded,
      ariaControls,
      fullWidth,
      badge,
      i18nStrings,
      __nativeAttributes,
      __internalRootRef = null,
      __focusable = false,
      __injectAnalyticsComponentMetadata = false,
      __title,
      __emitPerformanceMarks = true,
      analyticsAction = 'click',
      ...props
    }: InternalButtonProps,
    ref: React.Ref<ButtonProps.Ref>
  ) => {
    const [showTooltip, setShowTooltip] = useState(false);

    checkSafeUrl('Button', href);
    const isAnchor = Boolean(href);
    const target = targetOverride ?? (external ? '_blank' : undefined);
    const isNotInteractive = loading || disabled;
    const isDisabledWithReason = (variant === 'normal' || variant === 'primary') && !!disabledReason && disabled;
    const hasAriaDisabled = (loading && !disabled) || (disabled && __focusable) || isDisabledWithReason;
    const shouldHaveContent =
      children && ['icon', 'inline-icon', 'flashbar-icon', 'modal-dismiss'].indexOf(variant) === -1;

    if ((iconName || iconUrl || iconSvg) && iconAlign === 'right' && external) {
      warnOnce('Button', 'A right-aligned icon should not be combined with an external icon.');
    }

    const buttonRef = useRef<HTMLElement>(null);
    useForwardFocus(ref, buttonRef);

    const buttonContext = useButtonContext();
    const i18n = useInternalI18n('button');

    const uniqueId = useUniqueId('button');
    const { funnelInteractionId } = useFunnel();
    const { stepNumber, stepNameSelector } = useFunnelStep();
    const { subStepSelector, subStepNameSelector } = useFunnelSubStep();

    const performanceMarkAttributes = usePerformanceMarks(
      'primaryButton',
      () => variant === 'primary' && __emitPerformanceMarks && !loading && !disabled,
      buttonRef,
      () => ({
        loading,
        disabled,
        text: buttonRef.current?.innerText,
      }),
      [loading, disabled]
    );
    useModalContextLoadingButtonComponent(variant === 'primary', loading);

    const { targetProps, descriptionEl } = useHiddenDescription(disabledReason);

    const handleClick = (event: React.MouseEvent) => {
      if (isNotInteractive) {
        return event.preventDefault();
      }

      if (isAnchor && isPlainLeftClick(event)) {
        fireCancelableEvent(onFollow, { href, target }, event);

        if ((iconName === 'external' || target === '_blank') && funnelInteractionId) {
          const stepName = getTextFromSelector(stepNameSelector);
          const subStepName = getTextFromSelector(subStepNameSelector);

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
      [styles['disabled-with-reason']]: isDisabledWithReason,
      [styles['button-no-wrap']]: !wrapText,
      [styles['button-no-text']]: !shouldHaveContent,
      [styles['full-width']]: shouldHaveContent && fullWidth,
      [styles.link]: isAnchor,
    });

    const explicitTabIndex =
      __nativeAttributes && 'tabIndex' in __nativeAttributes ? __nativeAttributes.tabIndex : undefined;
    const { tabIndex } = useSingleTabStopNavigation(buttonRef, {
      tabIndex: isAnchor && isNotInteractive && !isDisabledWithReason ? -1 : explicitTabIndex,
    });

    const analyticsMetadata: GeneratedAnalyticsMetadataButtonFragment = disabled
      ? {}
      : {
          action: analyticsAction,
          detail: { label: { root: 'self' } },
        };
    if (__injectAnalyticsComponentMetadata) {
      analyticsMetadata.component = {
        name: 'awsui.Button',
        label: { root: 'self' },
        properties: { variant, disabled: `${disabled}` },
      };
    }

    const buttonProps = {
      ...props,
      ...__nativeAttributes,
      ...performanceMarkAttributes,
      tabIndex,
      // https://github.com/microsoft/TypeScript/issues/36659
      ref: useMergeRefs(buttonRef, __internalRootRef),
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedby,
      'aria-expanded': ariaExpanded,
      'aria-controls': ariaControls,
      // add ariaLabel as `title` as visible hint text
      title: __title ?? ariaLabel,
      className: buttonClass,
      onClick: handleClick,
      [DATA_ATTR_FUNNEL_VALUE]: uniqueId,
      ...getAnalyticsMetadataAttribute(analyticsMetadata),
      ...getAnalyticsLabelAttribute(children ? `.${analyticsSelectors.label}` : ''),
    } as const;

    const iconProps: ButtonIconProps = {
      loading,
      iconName,
      iconAlign,
      iconUrl,
      iconSvg,
      iconAlt,
      variant,
      badge,
      iconClass: __iconClass,
      iconSize: variant === 'modal-dismiss' ? 'medium' : 'normal',
    };
    const buttonContent = (
      <>
        <LeftIcon {...iconProps} />
        {shouldHaveContent && (
          <>
            <span className={clsx(styles.content, analyticsSelectors.label)}>{children}</span>
            {external && (
              <>
                &nbsp;
                <span
                  role="img"
                  aria-label={i18n('i18nStrings.externalIconAriaLabel', i18nStrings?.externalIconAriaLabel)}
                >
                  <Icon name="external" className={testUtilStyles['external-icon']} />
                </span>
              </>
            )}
          </>
        )}
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

    const disabledReasonProps = {
      onFocus: isDisabledWithReason ? () => setShowTooltip(true) : undefined,
      onBlur: isDisabledWithReason ? () => setShowTooltip(false) : undefined,
      onMouseEnter: isDisabledWithReason ? () => setShowTooltip(true) : undefined,
      onMouseLeave: isDisabledWithReason ? () => setShowTooltip(false) : undefined,
      ...(isDisabledWithReason ? targetProps : {}),
    };
    const disabledReasonContent = (
      <>
        {descriptionEl}
        {showTooltip && (
          <Tooltip className={testUtilStyles['disabled-reason-tooltip']} trackRef={buttonRef} value={disabledReason!} />
        )}
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
            aria-disabled={isNotInteractive ? true : undefined}
            download={download}
            {...disabledReasonProps}
          >
            {buttonContent}
            {isDisabledWithReason && disabledReasonContent}
          </a>
          {loading && loadingText && (
            <InternalLiveRegion tagName="span" hidden={true}>
              {loadingText}
            </InternalLiveRegion>
          )}
        </>
      );
    }

    return (
      <>
        <button
          {...buttonProps}
          type={formAction === 'none' ? 'button' : 'submit'}
          disabled={disabled && !__focusable && !isDisabledWithReason}
          aria-disabled={hasAriaDisabled ? true : undefined}
          {...disabledReasonProps}
        >
          {buttonContent}
          {isDisabledWithReason && disabledReasonContent}
        </button>
        {loading && loadingText && (
          <InternalLiveRegion tagName="span" hidden={true}>
            {loadingText}
          </InternalLiveRegion>
        )}
      </>
    );
  }
);

export default InternalButton;
