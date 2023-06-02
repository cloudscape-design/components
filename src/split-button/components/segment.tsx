// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import buttonStyles from '../../button/styles.css.js';
import styles from './styles.css.js';
import clsx from 'clsx';
import { ButtonIconProps, LeftIcon, RightIcon } from '../../button/icon-helper';
import { SplitButtonProps } from '../interfaces';
import LiveRegion from '../../internal/components/live-region';
import { fireCancelableEvent, isPlainLeftClick } from '../../internal/events';
import InternalButtonDropdown from '../../button-dropdown/internal';

export const ButtonSegment = forwardRef(
  (
    {
      id,
      text,
      ariaLabel,
      disabled,
      loading,
      loadingText,
      iconAlt,
      iconName,
      iconSvg,
      iconUrl,

      onClick,
      variant,
    }: SplitButtonProps.ButtonItem & { variant: SplitButtonProps.Variant },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const handleClick = (event: React.MouseEvent) => {
      if (disabled || loading) {
        return event.preventDefault();
      }
      const { altKey, button, ctrlKey, metaKey, shiftKey } = event;
      fireCancelableEvent(onClick, { altKey, button, ctrlKey, metaKey, shiftKey }, event);
    };

    return (
      <BaseButton
        id={id}
        ref={ref}
        variant={variant}
        disabled={!!disabled}
        loading={!!loading}
        loadingText={loadingText}
        onClick={handleClick}
        className={styles['button-segment']}
        nativeAttributes={{
          'aria-label': ariaLabel,
        }}
      >
        <LeftIcon
          loading={loading}
          iconAlt={iconAlt}
          iconName={iconName}
          iconSvg={iconSvg}
          iconUrl={iconUrl}
          variant="icon"
          iconSize="normal"
          iconAlign="left"
        />
        {text !== undefined && <span className={buttonStyles.content}>{text}</span>}
      </BaseButton>
    );
  }
);

export const LinkSegment = forwardRef(
  (
    {
      id,
      text,
      ariaLabel,
      disabled,
      loading,
      loadingText,
      iconAlt,
      iconName,
      iconSvg,
      iconUrl,
      href,
      target,
      rel,
      download,
      external,
      onFollow,
      variant,
    }: SplitButtonProps.LinkItem & { variant: SplitButtonProps.Variant },
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    const handleClick = (event: React.MouseEvent) => {
      if (disabled || loading) {
        return event.preventDefault();
      }

      if (isPlainLeftClick(event)) {
        fireCancelableEvent(onFollow, { href, target }, event);
      }
    };

    return (
      <BaseLink
        id={id}
        ref={ref}
        variant={variant}
        disabled={!!disabled}
        loading={!!loading}
        loadingText={loadingText}
        onClick={handleClick}
        className={styles['button-segment']}
        nativeAttributes={{
          'aria-label': ariaLabel,
          href,
          target,
          rel,
          download,
        }}
      >
        <LeftIcon
          loading={loading}
          iconAlt={iconAlt}
          iconName={iconName}
          iconSvg={iconSvg}
          iconUrl={iconUrl}
          variant="icon"
          iconSize="normal"
          iconAlign="left"
        />

        {text !== undefined && <span className={buttonStyles.content}>{text}</span>}

        {external && <RightIcon loading={loading} iconName="external" iconSize="normal" iconAlign="right" />}
      </BaseLink>
    );
  }
);

export const ButtonDropdownSegment = forwardRef(
  (
    {
      id,
      ariaLabel,
      disabled,
      loading,
      loadingText,
      items,
      expandableGroups,
      onItemClick,
      onItemFollow,
      variant,
      expandToViewport,
    }: SplitButtonProps.ButtonDropdownItem & {
      variant: SplitButtonProps.Variant;
      expandToViewport?: boolean;
      expandableGroups?: boolean;
    },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    return (
      <InternalButtonDropdown
        ref={ref}
        items={items}
        loading={loading}
        variant="navigation"
        expandToViewport={expandToViewport}
        expandableGroups={expandableGroups}
        onItemClick={onItemClick}
        onItemFollow={onItemFollow}
        customTriggerBuilder={(clickHandler, ref, _isDisabled, isExpanded) => {
          const loadingIconProps: ButtonIconProps = {
            loading: true,
          };

          const dropdownIconProps: ButtonIconProps = {
            loading: false,
            iconName: 'caret-down-filled',
            variant: 'icon',
            iconClass: isExpanded ? styles['rotate-up'] : styles['rotate-down'],
            iconSize: 'normal',
            iconAlign: 'left',
          };

          return (
            <BaseButton
              id={id}
              ref={ref}
              variant={variant}
              disabled={!!disabled}
              loading={!!loading}
              loadingText={loadingText}
              onClick={clickHandler}
              className={styles['button-dropdown-segment']}
              nativeAttributes={{
                'aria-label': ariaLabel,
                'aria-haspopup': true,
                'aria-expanded': isExpanded,
              }}
            >
              {loading ? <LeftIcon {...loadingIconProps} /> : <LeftIcon {...dropdownIconProps} />}
            </BaseButton>
          );
        }}
      />
    );
  }
);

const BaseButton = forwardRef(
  (
    {
      id,
      className,
      disabled,
      loading,
      loadingText,
      variant,
      children,
      onClick,
      nativeAttributes,
    }: {
      id: string;
      className: string;
      disabled: boolean;
      loading: boolean;
      loadingText?: string;
      variant: 'primary' | 'normal';
      children: React.ReactNode;
      onClick: (event: React.MouseEvent) => void;
      nativeAttributes: Record<string, any>;
    },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const inactive = disabled || loading;
    return (
      <div className={clsx(styles['segment-wrapper'], className)} data-testid={id}>
        <button
          ref={ref}
          type="button"
          className={clsx(
            buttonStyles.button,
            buttonStyles[`variant-${variant}`],
            inactive && buttonStyles.disabled,
            styles.button
          )}
          onClick={onClick}
          disabled={inactive}
          {...nativeAttributes}
        >
          {children}
        </button>
        {loading && loadingText && <LiveRegion>{loadingText}</LiveRegion>}
      </div>
    );
  }
);

const BaseLink = forwardRef(
  (
    {
      id,
      className,
      disabled,
      loading,
      loadingText,
      variant,
      children,
      onClick,
      nativeAttributes,
    }: {
      id: string;
      className: string;
      disabled: boolean;
      loading: boolean;
      loadingText?: string;
      variant: 'primary' | 'normal';
      children: React.ReactNode;
      onClick: (event: React.MouseEvent) => void;
      nativeAttributes: Record<string, any>;
    },
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    const inactive = disabled || loading;
    return (
      <div className={clsx(styles['segment-wrapper'], className)} data-testid={id}>
        <a
          ref={ref}
          className={clsx(
            buttonStyles.button,
            buttonStyles[`variant-${variant}`],
            inactive && buttonStyles.disabled,
            styles.button
          )}
          onClick={onClick}
          aria-disabled={inactive}
          tabIndex={inactive ? -1 : undefined}
          {...nativeAttributes}
        >
          {children}
        </a>
        {loading && loadingText && <LiveRegion>{loadingText}</LiveRegion>}
      </div>
    );
  }
);
