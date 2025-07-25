// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef } from 'react';
import clsx from 'clsx';

import { useMergeRefs, useUniqueId } from '@cloudscape-design/component-toolkit/internal';

import { useInternalI18n } from '../i18n/context';
import InternalIcon from '../icon/internal';
import { FunnelMetrics } from '../internal/analytics';
import { useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import {
  DATA_ATTR_FUNNEL_VALUE,
  getFunnelValueSelector,
  getSubStepAllSelector,
  getTextFromSelector,
} from '../internal/analytics/selectors';
import { getBaseProps } from '../internal/base-component';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import { useSingleTabStopNavigation } from '../internal/context/single-tab-stop-navigation-context';
import { fireCancelableEvent, fireNonCancelableEvent, isPlainLeftClick } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { KeyCode } from '../internal/keycode';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { LinkProps } from './interfaces';

import styles from './styles.css.js';

type InternalLinkProps = InternalBaseComponentProps<HTMLAnchorElement> &
  Omit<LinkProps, 'variant'> & {
    variant?: LinkProps['variant'] | 'top-navigation' | 'link' | 'recovery';
  };

const InternalLink = React.forwardRef(
  (
    {
      variant: providedVariant,
      fontSize = 'body-m',
      color = 'normal',
      external = false,
      target,
      href,
      rel,
      ariaLabel,
      externalIconAriaLabel,
      onFollow,
      onClick,
      children,
      __internalRootRef = null,
      ...props
    }: InternalLinkProps,
    ref: React.Ref<LinkProps.Ref>
  ) => {
    checkSafeUrl('Link', href);
    const isButton = !href;
    const { defaultVariant } = useContext(LinkDefaultVariantContext);
    const variant = providedVariant || defaultVariant;
    const specialStyles = ['top-navigation', 'link', 'recovery'];
    const hasSpecialStyle = specialStyles.indexOf(variant) > -1;

    const i18n = useInternalI18n('link');
    const baseProps = getBaseProps(props);
    const anchorTarget = target ?? (external ? '_blank' : undefined);
    const anchorRel = rel ?? (anchorTarget === '_blank' ? 'noopener noreferrer' : undefined);
    const uniqueId = useUniqueId('link');
    const linkId = useUniqueId('link-self');
    const infoId = useUniqueId('link-info');

    const infoLinkLabelFromContext = useContext(InfoLinkLabelContext);

    const { funnelIdentifier, funnelInteractionId } = useFunnel();
    const { stepIdentifier, stepNumber, stepNameSelector } = useFunnelStep();
    const { subStepIdentifier, subStepSelector, subStepNameSelector } = useFunnelSubStep();

    const fireFunnelEvent = (funnelInteractionId: string) => {
      if (variant === 'info') {
        const stepName = getTextFromSelector(stepNameSelector);
        const subStepName = getTextFromSelector(subStepNameSelector);

        FunnelMetrics.helpPanelInteracted({
          funnelIdentifier,
          funnelInteractionId,
          stepIdentifier,
          stepNumber,
          stepName,
          subStepIdentifier,
          stepNameSelector,
          subStepSelector,
          subStepName,
          subStepNameSelector,
          elementSelector: getFunnelValueSelector(uniqueId),
          subStepAllSelector: getSubStepAllSelector(),
        });
      } else if (external) {
        const stepName = getTextFromSelector(stepNameSelector);
        const subStepName = getTextFromSelector(subStepNameSelector);

        FunnelMetrics.externalLinkInteracted({
          funnelIdentifier,
          funnelInteractionId,
          stepIdentifier,
          stepNumber,
          stepName,
          stepNameSelector,
          subStepIdentifier,
          subStepSelector,
          subStepName,
          subStepNameSelector,
          elementSelector: getFunnelValueSelector(uniqueId),
          subStepAllSelector: getSubStepAllSelector(),
        });
      }
    };

    const fireFollowEvent = (event: React.SyntheticEvent) => {
      if (funnelInteractionId) {
        fireFunnelEvent(funnelInteractionId);
      }

      fireCancelableEvent(onFollow, { href, external, target: anchorTarget }, event);
    };

    const fireClickEvent = (event: React.MouseEvent | React.KeyboardEvent) => {
      const { altKey, ctrlKey, metaKey, shiftKey } = event;
      const button = 'button' in event ? event.button : 0;
      // make onClick non-cancelable to prevent it from being used to block full page reload
      // for navigation use `onFollow` event instead
      fireNonCancelableEvent(onClick, { altKey, button, ctrlKey, metaKey, shiftKey });
    };

    const handleLinkClick = (event: React.MouseEvent) => {
      if (isPlainLeftClick(event)) {
        fireFollowEvent(event);
      }
      fireClickEvent(event);
    };

    const handleButtonClick = (event: React.MouseEvent) => {
      fireFollowEvent(event);
      fireClickEvent(event);
    };

    const handleButtonKeyDown = (event: React.KeyboardEvent) => {
      if (event.keyCode === KeyCode.space || event.keyCode === KeyCode.enter) {
        event.preventDefault();
        fireFollowEvent(event);
        fireClickEvent(event);
      }
    };

    const linkRef = useRef<HTMLElement>(null);
    const isVisualRefresh = useVisualRefresh();
    useForwardFocus(ref, linkRef);

    // Visual refresh should only add styles to buttons that don't already have unique styles (e.g. primary/secondary variants)
    const applyButtonStyles = isButton && isVisualRefresh && !hasSpecialStyle;

    const sharedProps = {
      id: linkId,
      ...baseProps,
      // https://github.com/microsoft/TypeScript/issues/36659
      ref: useMergeRefs(linkRef, __internalRootRef),
      className: clsx(
        styles.link,
        baseProps.className,
        applyButtonStyles ? styles.button : null,
        styles[getVariantStyle(variant)],
        styles[getFontSizeStyle(variant, fontSize)],
        styles[getColorStyle(variant, color)]
      ),
      'aria-label': ariaLabel,
      'aria-labelledby': undefined as string | undefined,
      [DATA_ATTR_FUNNEL_VALUE]: uniqueId,
    };

    if (variant === 'info' && infoLinkLabelFromContext && !ariaLabel) {
      sharedProps['aria-labelledby'] = `${sharedProps.id} ${infoId} ${infoLinkLabelFromContext}`;
    }

    const renderedExternalIconAriaLabel = i18n('externalIconAriaLabel', externalIconAriaLabel);
    const content = (
      <>
        {children}
        {external && (
          <span className={styles['icon-wrapper']}>
            &nbsp;
            <span
              className={styles.icon}
              aria-label={renderedExternalIconAriaLabel}
              role={renderedExternalIconAriaLabel ? 'img' : undefined}
            >
              <InternalIcon name="external" size="inherit" />
            </span>
          </span>
        )}
        {variant === 'info' && (
          <span hidden={true} id={infoId}>
            :
          </span>
        )}
      </>
    );

    const { tabIndex } = useSingleTabStopNavigation(linkRef, { tabIndex: isButton ? 0 : undefined });

    if (isButton) {
      return (
        <a
          {...sharedProps}
          role="button"
          tabIndex={tabIndex}
          onKeyDown={handleButtonKeyDown}
          onClick={handleButtonClick}
        >
          {content}
        </a>
      );
    }

    return (
      <a
        {...sharedProps}
        tabIndex={tabIndex}
        target={anchorTarget}
        rel={anchorRel}
        href={href}
        onClick={handleLinkClick}
      >
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
