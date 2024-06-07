// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import Tooltip from '../internal/components/tooltip';

import LoadingDots from './loading-dots';
import InternalIcon from '../icon/internal.js';
import { AvatarProps } from './interfaces.js';
import styles from './styles.css.js';

export interface InternalAvatarProps extends AvatarProps, InternalBaseComponentProps {}

const AvatarContent = ({ color, loading, initials, iconName, iconSvg, iconUrl, ariaLabel }: AvatarProps) => {
  if (loading) {
    return <LoadingDots color={color} />;
  }

  if (initials) {
    const letters = initials.length > 2 ? initials.slice(0, 2) : initials;

    if (initials.length > 2) {
      warnOnce('Avatar', `"initials" is longer than 2 characters. Only the first two characters are shown.`);
    }

    return <span>{letters}</span>;
  }

  return <InternalIcon name={iconName || 'user-profile'} svg={iconSvg} url={iconUrl} alt={ariaLabel} />;
};

export default function InternalAvatar({
  color,
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
  const [showTooltip, setShowTooltip] = useState(false);

  const mergedRef = useMergeRefs(handleRef, __internalRootRef);

  const tooltipAttributes = {
    onFocus: () => {
      setShowTooltip(true);
    },
    onBlur: () => {
      setShowTooltip(false);
    },
    onMouseEnter: () => {
      setShowTooltip(true);
    },
    onMouseLeave: () => {
      setShowTooltip(false);
    },
    onTouchStart: () => {
      setShowTooltip(true);
    },
    onTouchEnd: () => {
      setShowTooltip(false);
    },
  };

  return (
    <div
      {...baseProps}
      ref={mergedRef}
      tabIndex={0}
      className={clsx(baseProps.className, styles.root, styles[`avatar-color-${color}`], {
        [styles.initials]: initials,
      })}
      role="img"
      aria-label={ariaLabel}
      {...tooltipAttributes}
    >
      {showTooltip && tooltipText && <Tooltip value={tooltipText} trackRef={handleRef} />}

      <AvatarContent
        color={color}
        ariaLabel={ariaLabel}
        initials={initials}
        loading={loading}
        iconName={iconName}
        iconSvg={iconSvg}
        iconUrl={iconUrl}
      />
    </div>
  );
}
