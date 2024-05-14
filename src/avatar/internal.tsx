// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
// import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import { getBaseProps } from '../internal/base-component/index.js';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import Tooltip from '../internal/components/tooltip';
import { useInternalI18n } from '../i18n/context';

import LoadingDots from './loading-dots';
import InternalIcon from '../icon/internal.js';
import { AvatarProps } from './interfaces.js';
import styles from './styles.css.js';

export interface InternalAvatarProps extends AvatarProps, InternalBaseComponentProps {}

const AvatarIcon = ({ variant, loading, userName = '', i18nStrings }: AvatarProps) => {
  const i18n = useInternalI18n('avatar');

  if (loading) {
    return <LoadingDots ariaLabel={i18n('i18nStrings.loading', i18nStrings?.loading)} />;
  }

  if (userName?.length > 0) {
    return (
      <span className={styles.letter} aria-label={userName}>
        {userName[0]}
      </span>
    );
  }

  return (
    <div
      role="img"
      aria-label={
        variant === 'assistant'
          ? i18n('i18nStrings.assistantIconAriaLabel', i18nStrings?.assistantIconAriaLabel)
          : i18n('i18nStrings.userIconAriaLabel', i18nStrings?.userIconAriaLabel)
      }
    >
      <InternalIcon name={variant === 'assistant' ? 'gen-ai' : 'user-profile'} />
    </div>
  );
};

export default function InternalAvatar({
  variant,
  userName = '',
  loading = false,
  //   size,
  i18nStrings,
  __internalRootRef = null,
  ...rest
}: InternalAvatarProps) {
  const baseProps = getBaseProps(rest);

  const handleRef = useRef<HTMLDivElement>(null);
  const [showTooltip, _setShowTooltip] = useState(false);

  const firstLetter = userName ? userName[0] : '';

  const setShowTooltip = (value: boolean) => {
    if (firstLetter?.length > 0) {
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

  return (
    <span {...baseProps} ref={__internalRootRef} className={clsx(baseProps.className, styles.root)}>
      {showTooltip && <Tooltip value={userName} trackRef={handleRef} />}

      <div
        ref={handleRef}
        tabIndex={0}
        className={clsx(styles.avatar, {
          [styles.assistant]: variant === 'assistant',
        })}
        {...tooltipAttributes}
      >
        {/* {loading && <LoadingDots />}

        {!loading && firstLetter.length > 0 && (
          <div style={{ fontFamily: 'AmazonEmber-Regular, Amazon Ember' }}>{firstLetter}</div>
        )}

        {!loading && firstLetter.length === 0 && <InternalIcon name={variant === 'user' ? 'user-profile' : 'gen-ai'} />} */}

        <AvatarIcon variant={variant} userName={userName} loading={loading} i18nStrings={i18nStrings} />
      </div>
    </span>
  );
}
