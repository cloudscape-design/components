// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { forwardRef } from 'react';
import styles from './styles.css.js';
import clsx from 'clsx';
import { SplitButtonProps } from './interfaces.js';
import InternalButtonDropdown from '../button-dropdown/internal.js';
import InternalButton from '../button/internal.js';

export const ButtonItem = forwardRef(
  (
    {
      external,
      id,
      text,
      href,
      target,
      rel,
      download,
      onClick,
      onFollow,
      iconAlt,
      iconName,
      iconUrl,
      iconSvg,
      ariaLabel,
      disabled,
      loading,
      loadingText,
      variant,
    }: SplitButtonProps.ButtonItem & { variant: SplitButtonProps.Variant },
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const isExternalLink = href !== undefined && external;
    return (
      <div className={clsx(styles['item-wrapper'], styles['button-item'])} data-testid={id}>
        <InternalButton
          ref={ref}
          href={href}
          target={target}
          rel={rel}
          download={download}
          onClick={onClick}
          onFollow={onFollow}
          iconAlign={isExternalLink ? 'right' : 'left'}
          iconName={isExternalLink ? 'external' : iconName}
          iconAlt={iconAlt}
          iconUrl={iconUrl}
          iconSvg={iconSvg}
          ariaLabel={ariaLabel}
          disabled={disabled}
          loading={loading}
          loadingText={loadingText}
          variant={variant}
          className={styles.button}
        >
          {text}
        </InternalButton>
      </div>
    );
  }
);

export const ButtonDropdownItem = forwardRef(
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
      <div className={styles['item-wrapper']} data-testid={id}>
        <InternalButtonDropdown
          ref={ref}
          items={items}
          loading={loading}
          expandToViewport={expandToViewport}
          expandableGroups={expandableGroups}
          stretchTriggerHeight={true}
          onItemClick={onItemClick}
          onItemFollow={onItemFollow}
          customTriggerBuilder={(clickHandler, ref, _isDisabled, isExpanded) => (
            <div className={styles['button-dropdown-item']}>
              <InternalButton
                ref={ref}
                variant={variant}
                disabled={disabled}
                loading={loading}
                loadingText={loadingText}
                onClick={clickHandler}
                ariaLabel={ariaLabel}
                ariaExpanded={isExpanded}
                __nativeAttributes={{ 'aria-haspopup': true }}
                iconName="caret-down-filled"
                __iconClass={isExpanded ? styles['rotate-up'] : styles['rotate-down']}
                className={styles.button}
              />
            </div>
          )}
        />
      </div>
    );
  }
);
