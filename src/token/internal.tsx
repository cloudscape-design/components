// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useRef, useState } from 'react';
import clsx from 'clsx';

import {
  isThemeActive,
  Theme,
  useResizeObserver,
  useUniqueId,
  warnOnce,
} from '@cloudscape-design/component-toolkit/internal';

import InternalIcon from '../icon/internal';
import { getBaseProps } from '../internal/base-component';
import Option from '../internal/components/option';
import { TokenInlineContext } from '../internal/context/token-inline-context';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import LiveRegion from '../live-region/internal';
import Tooltip from '../tooltip/internal.js';
import DismissButton from './dismiss-button';
import { TokenProps } from './interfaces';
import { getTokenRootStyles } from './styles';

import legacyTestingStyles from '../token-group/styles.css.js';
import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';

type InternalTokenProps = Omit<TokenProps, 'label'> &
  InternalBaseComponentProps & {
    /** Token label. Required unless `__customContent` replaces the option layout entirely. */
    label?: React.ReactNode;
    /**
     * Overrides the default `role="group"` on the token root. Set to `"presentation"` when a
     * parent element provides grouping semantics; this also strips ARIA attributes
     * (aria-label, aria-labelledby, aria-disabled), focus/mouse handlers, and the tab stop so the
     * token doesn't expose a redundant nested group to assistive tech.
     */
    role?: string;
    disableInnerPadding?: boolean;
    /** Extra class on the token-box element */
    __tokenBoxClassName?: string;
    /**
     * Renders content inside the token-box, replacing the standard option layout
     * (label, labelTag, description, tags). The dismiss button is still rendered as a sibling.
     */
    __customContent?: React.ReactNode;
  };

function InternalToken({
  // External
  label,
  ariaLabel,
  labelTag,
  description,
  variant = 'normal',
  disabled,
  readOnly,
  icon,
  tags,
  dismissLabel,
  onDismiss,
  tooltipContent,

  // Internal
  role,
  disableInnerPadding,
  __tokenBoxClassName,
  __customContent,

  // Base
  __internalRootRef,
  ...restProps
}: InternalTokenProps) {
  const baseProps = getBaseProps(restProps);
  const tokenRootStyleProps = getTokenRootStyles(restProps.style);
  const labelContainerRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isEllipsisActive, setIsEllipsisActive] = useState(false);
  const isInline = variant === 'inline';
  const isOneTheme = isThemeActive(Theme.OneTheme);
  // Consumers with their own grouping semantics can pass role="presentation" to treat the root
  // as a pure styling wrapper (strips ARIA and focus/mouse handlers).
  const isPresentation = role === 'presentation';
  const ariaLabelledbyId = useUniqueId();

  const isLabelOverflowing = () => {
    const labelContent = labelRef.current;
    const labelContainer = labelContainerRef.current;

    if (labelContent && labelContainer) {
      return labelContent.offsetWidth > labelContainer.offsetWidth;
    }
  };

  useResizeObserver(labelContainerRef, () => {
    if (isInline) {
      setIsEllipsisActive(isLabelOverflowing() ?? false);
    }
  });

  const sizedIcon = (iconNode: React.ReactNode) => {
    if (isInline && isOneTheme && React.isValidElement(iconNode) && iconNode.type === InternalIcon) {
      return React.cloneElement(iconNode, { size: 'x-small' });
    }
    return iconNode;
  };

  const buildOptionDefinition = () => {
    const isLabelStringOrNumber = typeof label === 'string' || typeof label === 'number';
    const labelObject = isLabelStringOrNumber ? { label: String(label) } : { labelContent: label };

    if (isInline) {
      if (!isLabelStringOrNumber) {
        warnOnce('Label', `Only plain text (strings or numbers) are supported when variant="inline".`);
      }

      return {
        ...labelObject,
        disabled,
        __customIcon: icon && <span className={clsx(styles.icon, styles['icon-inline'])}>{sizedIcon(icon)}</span>,
      };
    } else {
      return {
        ...labelObject,
        disabled,
        labelTag,
        description,
        tags,
        __customIcon: icon && <span className={styles.icon}>{sizedIcon(icon)}</span>,
      };
    }
  };

  // Use span for inline tokens (e.g. inside contentEditable) to avoid block-level elements breaking text flow.
  const SpanOrDivTag = isInline ? 'span' : 'div';

  return (
    <TokenInlineContext.Provider value={{ isInlineToken: isInline }}>
      <SpanOrDivTag
        {...baseProps}
        ref={__internalRootRef}
        className={clsx(
          styles.root,
          legacyTestingStyles.token,
          testUtilStyles.root,
          !isInline ? styles['token-normal'] : styles['token-inline'],
          analyticsSelectors.token,
          baseProps.className
        )}
        aria-label={isPresentation ? undefined : ariaLabel}
        aria-labelledby={isPresentation || ariaLabel ? undefined : ariaLabelledbyId}
        aria-disabled={isPresentation ? undefined : !!disabled}
        role={role ?? 'group'}
        onFocus={() => {
          if (!isPresentation) {
            setShowTooltip(true);
          }
        }}
        onBlur={() => {
          if (!isPresentation) {
            setShowTooltip(false);
          }
        }}
        onMouseEnter={() => {
          if (!isPresentation) {
            setShowTooltip(true);
          }
        }}
        onMouseLeave={() => {
          if (!isPresentation) {
            setShowTooltip(false);
          }
        }}
        tabIndex={!isPresentation && !!tooltipContent && isInline && isEllipsisActive ? 0 : undefined}
      >
        <SpanOrDivTag
          className={clsx(
            !isInline ? styles['token-box'] : styles['token-box-inline'],
            disabled && styles['token-box-disabled'],
            readOnly && styles['token-box-readonly'],
            !isInline && !onDismiss && styles['token-box-without-dismiss'],
            disableInnerPadding && styles['disable-padding'],
            __tokenBoxClassName
          )}
          style={tokenRootStyleProps}
        >
          <Option
            className={clsx(isInline && styles['token-option-inline'])}
            triggerVariant={isInline}
            option={buildOptionDefinition()}
            disableTitleTooltip={!!tooltipContent}
            labelContainerRef={labelContainerRef}
            labelRef={labelRef}
            labelId={ariaLabelledbyId}
            customContent={__customContent}
          />
          {onDismiss && (
            <DismissButton
              disabled={disabled}
              dismissLabel={dismissLabel}
              onDismiss={onDismiss}
              readOnly={readOnly}
              inline={isInline}
            />
          )}
        </SpanOrDivTag>
        {!!tooltipContent && isInline && isEllipsisActive && showTooltip && (
          <Tooltip
            data-testid="token-tooltip"
            getTrack={() => labelContainerRef.current}
            content={
              <LiveRegion>
                <span data-testid="tooltip-live-region-content">{tooltipContent}</span>
              </LiveRegion>
            }
            onEscape={() => {
              setShowTooltip(false);
            }}
          />
        )}
      </SpanOrDivTag>
    </TokenInlineContext.Provider>
  );
}

export default InternalToken;
