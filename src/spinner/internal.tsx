// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { getBaseProps } from '../internal/base-component';
import styles from './styles.css.js';
import { SpinnerProps } from './interfaces';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import LiveRegion from '../internal/components/live-region';

interface InternalSpinnerProps extends SpinnerProps, InternalBaseComponentProps {}

export default function InternalSpinner({
  ariaLiveAnnounce,
  size = 'normal',
  variant = 'normal',
  i18nStrings,
  __internalRootRef,
  ...props
}: InternalSpinnerProps) {
  const baseProps = getBaseProps(props);

  const [liveRegionText, setliveRegionText] = useState('');

  useEffect(() => {
    if (ariaLiveAnnounce && i18nStrings?.loadingAltText) {
      const loadingText = i18nStrings?.loadingAltText || '';
      setliveRegionText(loadingText);

      const updateAnnouncer = () => {
        setliveRegionText('');
        setliveRegionText(loadingText);
      };

      const announceTimer = setInterval(updateAnnouncer, 3000);

      return () => {
        clearInterval(announceTimer);
      };
    }
  }, [ariaLiveAnnounce, i18nStrings?.loadingAltText]);

  return (
    <span
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles[`size-${size}`], styles[`variant-${variant}`])}
      ref={__internalRootRef}
    >
      <LiveRegion delay={0}>{liveRegionText}</LiveRegion>
      <span className={clsx(styles.circle, styles['circle-left'])} />
      <span className={clsx(styles.circle, styles['circle-right'])} />
    </span>
  );
}
