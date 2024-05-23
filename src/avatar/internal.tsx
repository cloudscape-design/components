// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
// import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import Tooltip from '../internal/components/tooltip';

import LoadingDots from './loading-dots';
import InternalIcon from '../icon/internal.js';
import { AvatarProps } from './interfaces.js';
import styles from './styles.css.js';

export interface InternalAvatarProps extends AvatarProps, InternalBaseComponentProps {}

const AvatarContent = ({ type, loading, initials = '', iconName, iconSvg, iconUrl }: AvatarProps) => {
  if (type === 'gen-ai' && loading) {
    // TODO: check spinner tests
    return <LoadingDots />;
  }

  if (type === 'user' && initials?.length > 0) {
    //  TODO: should it allow one letter or two letters or both?
    const letters = initials.length > 2 ? initials.slice(0, 2) : initials;

    return <span className={styles.letter}>{letters}</span>;
  }

  const iconNameWithDefault = type === 'user' ? 'user-profile' : iconName || 'gen-ai';

  return (
    <div>
      {type === 'gen-ai' ? (
        <InternalIcon name={iconNameWithDefault} svg={iconSvg} url={iconUrl} />
      ) : (
        <InternalIcon name={iconNameWithDefault} />
      )}
    </div>
  );
};

export default function InternalAvatar({
  type,
  fullName = '',
  initials = '',
  loading = false,
  loadingText = '',
  altText = '',
  iconName,
  iconSvg,
  iconUrl,
  __internalRootRef = null,
  ...rest
}: InternalAvatarProps) {
  const baseProps = getBaseProps(rest);
  const handleRef = useRef<HTMLDivElement>(null);
  const [showTooltip, _setShowTooltip] = useState(false);

  const showLoadingText = type === 'gen-ai' && loading && loadingText?.length > 0;
  // When loading, loadingText takes precedence over fullName
  const tooltipContent = showLoadingText ? loadingText : fullName;

  const setShowTooltip = (value: boolean) => {
    if (fullName?.length > 0 || showLoadingText) {
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

  const getAriaLabel = () => {
    let ariaLabel = '';

    // TODO: Should it concatenate avatar and tooltip content into a single aria label?
    if (initials?.length > 0) {
      ariaLabel += initials.length > 2 ? initials.slice(0, 2) : initials;
    } else if (altText?.length > 0) {
      ariaLabel += altText;
    }

    if (tooltipContent?.length > 0) {
      ariaLabel += ` ${tooltipContent}`;
    }

    return ariaLabel;
  };

  return (
    <span {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
      {showTooltip && <Tooltip value={tooltipContent} trackRef={handleRef} />}

      {/* TODO: Any meaningful roles this div can have? */}
      {/* TODO: The default popover aria live may cause double announcement, add test and check if it needs to be disabled */}

      <div
        ref={handleRef}
        tabIndex={0}
        className={clsx(styles.avatar, {
          [styles['gen-ai']]: type === 'gen-ai',
          [styles.loading]: type === 'gen-ai' && loading,
        })}
        aria-label={getAriaLabel()}
        // TODO: To be discussed with a11y
        aria-roledescription="avatar"
        {...tooltipAttributes}
      >
        <AvatarContent
          type={type}
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
