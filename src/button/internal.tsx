// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId, warnOnce } from '@cloudscape-design/component-toolkit/internal';
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
import { SYSTEM } from '../internal/environment';
import { fireCancelableEvent, isPlainLeftClick } from '../internal/events';
import customCssProps from '../internal/generated/custom-css-properties';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import useHiddenDescription from '../internal/hooks/use-hidden-description';
import { useModalContextLoadingButtonComponent } from '../internal/hooks/use-modal-component-analytics';
import { usePerformanceMarks } from '../internal/hooks/use-performance-marks';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import InternalLiveRegion from '../live-region/internal';
import { GeneratedAnalyticsMetadataButtonFragment } from './analytics-metadata/interfaces';
import { ButtonIconProps, LeftIcon, RightIcon } from './icon-helper';
import { ButtonProps } from './interfaces';

import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

export type InternalButtonProps = Omit<ButtonProps, 'variant'> & {
  variant?:
    | ButtonProps['variant']
    | 'flashbar-icon'
    | 'breadcrumb-group'
    | 'menu-trigger'
    | 'modal-dismiss'
    | 'inline-icon-pointer-target';
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
      style,
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
    const isDisabledWithReason =
      (variant === 'normal' || variant === 'primary' || variant === 'icon') && !!disabledReason && disabled;

    const hasAriaDisabled = (loading && !disabled) || (disabled && __focusable) || isDisabledWithReason;
    const shouldHaveContent =
      children &&
      ['icon', 'inline-icon', 'flashbar-icon', 'modal-dismiss', 'inline-icon-pointer-target'].indexOf(variant) === -1;

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
      ...getAnalyticsLabelAttribute(shouldHaveContent ? `.${analyticsSelectors.label}` : ''),
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
                <Icon
                  name="external"
                  className={testUtilStyles['external-icon']}
                  ariaLabel={i18n('i18nStrings.externalIconAriaLabel', i18nStrings?.externalIconAriaLabel)}
                />
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
          <Tooltip
            className={testUtilStyles['disabled-reason-tooltip']}
            trackRef={buttonRef}
            value={disabledReason!}
            onDismiss={() => setShowTooltip(false)}
          />
        )}
      </>
    );

    const stylePropertiesAndVariables =
      SYSTEM === 'core'
        ? {
            borderRadius: style?.root?.borderRadius,
            borderWidth: style?.root?.borderWidth,
            paddingBlock: style?.root?.paddingBlock,
            paddingInline: style?.root?.paddingInline,
            ...(style?.root?.background && {
              [customCssProps.styleBackgroundActive]: style.root.background?.active,
              [customCssProps.styleBackgroundDefault]: style.root.background?.default,
              [customCssProps.styleBackgroundDisabled]: style.root.background?.disabled,
              [customCssProps.styleBackgroundHover]: style.root.background?.hover,
            }),
            ...(style?.root?.borderColor && {
              [customCssProps.styleBorderColorActive]: style.root.borderColor?.active,
              [customCssProps.styleBorderColorDefault]: style.root.borderColor?.default,
              [customCssProps.styleBorderColorDisabled]: style.root.borderColor?.disabled,
              [customCssProps.styleBorderColorHover]: style.root.borderColor?.hover,
            }),
            ...(style?.root?.color && {
              [customCssProps.styleColorActive]: style.root.color?.active,
              [customCssProps.styleColorDefault]: style.root.color?.default,
              [customCssProps.styleColorDisabled]: style.root.color?.disabled,
              [customCssProps.styleColorHover]: style.root.color?.hover,
            }),
            ...(style?.root?.focusRing && {
              [customCssProps.styleFocusRingBorderColor]: style.root.focusRing?.borderColor,
              [customCssProps.styleFocusRingBorderRadius]: style.root.focusRing?.borderRadius,
              [customCssProps.styleFocusRingBorderWidth]: style.root.focusRing?.borderWidth,
            }),
            ...(style?.root?.focusRing?.borderRadius && {
              [customCssProps.styleFocusRingBorderRadius]: style.root.focusRing.borderRadius,
            }),
          }
        : undefined;

    if (isAnchor) {
      const getAnchorTabIndex = () => {
        if (isNotInteractive) {
          // If disabled with a reason, make it focusable so users can access the tooltip
          // Otherwise, resolve to the default button props tabIndex.
          return disabledReason ? 0 : buttonProps.tabIndex;
        }
        return buttonProps.tabIndex;
      };

      return (
        <>
          <a
            {...buttonProps}
            href={isNotInteractive ? undefined : href}
            role={isNotInteractive ? 'link' : undefined}
            tabIndex={getAnchorTabIndex()}
            target={target}
            // security recommendation: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#target
            rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
            aria-disabled={isNotInteractive ? true : undefined}
            download={download}
            {...disabledReasonProps}
            style={stylePropertiesAndVariables}
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
          style={stylePropertiesAndVariables}
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
