// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef } from 'react';
import clsx from 'clsx';
import InternalIcon from '../icon/internal';
import styles from './styles.css.js';
import { getBaseProps } from '../internal/base-component';
import { fireCancelableEvent, isPlainLeftClick } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { KeyCode } from '../internal/keycode';
import { LinkProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { checkSafeUrl } from '../internal/utils/check-safe-url';
import { useInternalI18n } from '../i18n/context';
import { InfoLinkLabelContext } from '../internal/context/info-link-label-context';
import { useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';

import { FunnelMetrics } from '../internal/analytics';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import {
  DATA_ATTR_FUNNEL_VALUE,
  getFunnelValueSelector,
  getNameFromSelector,
  getSubStepAllSelector,
} from '../internal/analytics/selectors';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import { useGridNavigationFocusable } from '../table/table-role';

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

    const { funnelInteractionId } = useFunnel();
    const { stepNumber, stepNameSelector } = useFunnelStep();
    const { subStepSelector, subStepNameSelector } = useFunnelSubStep();

    const fireFunnelEvent = (funnelInteractionId: string) => {
      if (variant === 'info') {
        const stepName = getNameFromSelector(stepNameSelector);
        const subStepName = getNameFromSelector(subStepNameSelector);

        FunnelMetrics.helpPanelInteracted({
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
      } else if (external) {
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
    };

    const fireFollowEvent = (event: React.SyntheticEvent) => {
      if (funnelInteractionId) {
        fireFunnelEvent(funnelInteractionId);
      }

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
      if (event.keyCode === KeyCode.space || event.keyCode === KeyCode.enter) {
        event.preventDefault();
        fireFollowEvent(event);
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
      'aria-labelledby': '',
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

    const { shouldMuteUserFocus } = useGridNavigationFocusable(linkRef);

    if (isButton) {
      return (
        <a
          {...sharedProps}
          role="button"
          tabIndex={shouldMuteUserFocus ? -1 : 0}
          onKeyDown={handleButtonKeyDown}
          onClick={handleButtonClick}
        >
          {content}
        </a>
      );
    }

    return (
      // we dynamically set proper rel in the code above
      // eslint-disable-next-line react/jsx-no-target-blank
      <a
        {...sharedProps}
        tabIndex={shouldMuteUserFocus ? -1 : undefined}
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
