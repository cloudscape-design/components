// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import InternalButton from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { ToggleButtonProps } from './interfaces';
import { getToggleIcon } from './util';

import styles from './styles.css.js';

export const InternalToggleButton = React.forwardRef(
  (
    {
      pressed,
      iconName: defaultIconName,
      pressedIconName,
      iconSvg: defaultIconSvg,
      pressedIconSvg,
      iconUrl: defaultIconUrl,
      pressedIconUrl,
      variant,
      onChange,
      className,
      ...rest
    }: ToggleButtonProps,
    ref: React.Ref<ToggleButtonProps.Ref>
  ) => {
    return (
      <InternalButton
        className={clsx(className, styles[`variant-${variant}`], { [styles.pressed]: pressed })}
        variant={variant}
        iconName={getToggleIcon(pressed, defaultIconName, pressedIconName)}
        iconUrl={getToggleIcon(pressed, defaultIconUrl, pressedIconUrl)}
        iconSvg={getToggleIcon(pressed, defaultIconSvg, pressedIconSvg)}
        aria-pressed={pressed}
        onClick={() => {
          fireNonCancelableEvent(onChange, { pressed: !pressed });
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);

export default InternalToggleButton;
