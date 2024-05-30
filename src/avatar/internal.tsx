// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import Tooltip from '../internal/components/tooltip';

import LoadingDots from './loading-dots';
import InternalIcon from '../icon/internal.js';
import { AvatarProps } from './interfaces.js';
import styles from './styles.css.js';

export interface InternalAvatarProps extends AvatarProps, InternalBaseComponentProps {}

const AvatarContent = ({ color, loading, initials, iconName, iconSvg, iconUrl, ariaLabel }: AvatarProps) => {
  if (loading) {
    // TODO: check spinner tests
    return <LoadingDots color={color} />;
  }

  if (initials) {
    const letters = initials.length > 2 ? initials.slice(0, 2) : initials;

    if (initials.length > 2) {
      warnOnce('Avatar', `"initials" is longer than 2 letters. Only the first two letters are added to the component.`);
    }

    return <span className={styles.letter}>{letters}</span>;
  }

  return (
    <div>
      <InternalIcon name={iconName || 'user-profile'} svg={iconSvg} url={iconUrl} alt={ariaLabel} />
    </div>
  );
};

export default function InternalAvatar({
  color = 'default',
  tooltipText,
  initials,
  loading = false,
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

  const setShowTooltip = (value: boolean) => {
    if (tooltipText) {
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
    ariaLabel && ariaLabel.length > 0 && tooltipText && tooltipText.length > 0
      ? [ariaLabel, tooltipText].join(' ')
      : ariaLabel || tooltipText;

  return (
    <span {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
      {showTooltip && tooltipText && <Tooltip value={tooltipText} trackRef={handleRef} />}

      <div
        ref={handleRef}
        tabIndex={0}
        className={clsx(styles.avatar, {
          [styles['gen-ai']]: color === 'gen-ai',
          [styles.loading]: loading,
          [styles.initials]: initials,
        })}
        role="img"
        aria-label={avatarAriaLabel}
        {...tooltipAttributes}
      >
        <AvatarContent
          color={color}
          ariaLabel={avatarAriaLabel}
          initials={initials}
          loading={loading}
          iconName={iconName}
          iconSvg={iconSvg}
          iconUrl={iconUrl}
        />
      </div>
    </span>
  );
}
