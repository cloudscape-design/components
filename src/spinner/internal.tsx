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
  size = 'normal',
  variant = 'normal',
  loadingAriaLiveText,
  __internalRootRef,
  ...props
}: InternalSpinnerProps) {
  const baseProps = getBaseProps(props);

  const [liveRegionText, setliveRegionText] = useState('');
  /* Results in the message repeating at twice the value of messageToggleTiming.
   * In this case 4 seconds was the interval that "felt right" to the a11y team
   */
  const messageToggleTiming = 2000;

  useEffect(() => {
    if (loadingAriaLiveText) {
      let nextText = loadingAriaLiveText;
      setliveRegionText(nextText);

      const toggleAnnouncer = () => {
        nextText = nextText === loadingAriaLiveText ? '' : loadingAriaLiveText;
        setliveRegionText(nextText);
      };

      const announceTimer = setInterval(toggleAnnouncer, messageToggleTiming);

      return () => {
        clearInterval(announceTimer);
      };
    }
  }, [loadingAriaLiveText]);

  return (
    <span
      {...baseProps}
      className={clsx(baseProps.className, styles.root, styles[`size-${size}`], styles[`variant-${variant}`])}
      ref={__internalRootRef}
    >
      <LiveRegion>{liveRegionText}</LiveRegion>
      <span className={clsx(styles.circle, styles['circle-left'])} />
      <span className={clsx(styles.circle, styles['circle-right'])} />
    </span>
  );
}
