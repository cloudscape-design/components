// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
// import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { useUniqueId } from '../internal/hooks/use-unique-id';

import { getBaseProps } from '../internal/base-component/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import Tooltip from '../internal/components/tooltip';

import LoadingDots from './loading-dots';
import InternalIcon from '../icon/internal.js';
import { AvatarProps } from './interfaces.js';
import styles from './styles.css.js';

export interface InternalAvatarProps extends AvatarProps, InternalBaseComponentProps {}

const AvatarContent = ({ type, ariaLabel, loading, initials, iconName, iconSvg, iconUrl }: AvatarProps) => {
  if (type === 'gen-ai' && loading) {
    // TODO: check spinner tests
    return <LoadingDots />;
  }

  if (type === 'user' && initials) {
    //  TODO: should it allow one letter or two letters or both?
    const letters = initials.length > 2 ? initials.slice(0, 2) : initials;

    return <span className={styles.letter}>{letters}</span>;
  }

  const iconNameWithDefault = type === 'user' ? 'user-profile' : iconName || 'gen-ai';

  return (
    <div>
      {type === 'gen-ai' ? (
        <InternalIcon name={iconNameWithDefault} svg={iconSvg} url={iconUrl} alt={ariaLabel} />
      ) : (
        <InternalIcon name={iconNameWithDefault} />
      )}
    </div>
  );
};

export default function InternalAvatar({
  type,
  fullName,
  initials,
  loading = false,
  loadingText,
  ariaLabel,
  iconName,
  iconSvg,
  iconUrl,
  __internalRootRef = null,
  ...rest
}: InternalAvatarProps) {
  const baseProps = getBaseProps(rest);
  const handleRef = useRef<HTMLDivElement>(null);
  const [showTooltip, _setShowTooltip] = useState(false);

  const descriptionId = useUniqueId('avatar__description');

  const showLoadingText = type === 'gen-ai' && loading && loadingText;
  // When loading, loadingText takes precedence over fullName
  const tooltipContent = showLoadingText ? loadingText : fullName;

  const setShowTooltip = (value: boolean) => {
    if (fullName || showLoadingText) {
      return _setShowTooltip(value);
    }
  };

  const tooltipAttributes = {
    onFocus: () => {
      console.log('focused');
      setShowTooltip(true);
    },
    onBlur: () => {
      console.log('blurred');
      setShowTooltip(false);
    },
    onMouseEnter: () => {
      console.log('mouse entered');
      setShowTooltip(true);
    },
    onMouseLeave: () => {
      console.log('mouse left');
      setShowTooltip(false);
    },
    onTouchStart: () => {
      console.log('touch started');
      setShowTooltip(true);
    },
    onTouchEnd: () => {
      console.log('touch ended');
      setShowTooltip(false);
    },
  };

  const avatarAriaLabel =
    ariaLabel && ariaLabel.length > 0 && tooltipContent && tooltipContent.length > 0
      ? [ariaLabel, tooltipContent].join(' ')
      : ariaLabel || tooltipContent;

  return (
    <span {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
      {showTooltip && tooltipContent && <Tooltip value={tooltipContent} trackRef={handleRef} />}

      {/* <div className={styles['aria-description']} id={descriptionId}>
        {tooltipContent || ''}
      </div> */}

      <div
        ref={handleRef}
        tabIndex={0}
        className={clsx(styles.avatar, {
          [styles['gen-ai']]: type === 'gen-ai',
          [styles.loading]: type === 'gen-ai' && loading,
        })}
        role="img"
        aria-label={avatarAriaLabel}
        aria-describedby={descriptionId}
        // TODO: To be discussed with a11y
        // aria-roledescription="avatar" -> a11y sync (is it needed?)
        // tooltip content aria label vs aria describedby -> a11y sync
        //    is there a difference for screen reader users if we use both aria-label and aria-describedby props or
        //    if we simply concatenate both strings?
        // aria-roledescription={i18n('avatarAriaRoleDescription', i18nStrings?.avatarAriaRoleDescription)}
        {...tooltipAttributes}
      >
        <AvatarContent
          type={type}
          initials={initials}
          loading={loading}
          iconName={iconName}
          iconSvg={iconSvg}
          iconUrl={iconUrl}
          ariaLabel={avatarAriaLabel}
        />
      </div>
    </span>
  );
}
