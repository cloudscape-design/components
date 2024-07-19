// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { ToggleButtonProps } from './interfaces';
import InternalButton from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';

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
      onClick,
      ...rest
    }: ToggleButtonProps,
    ref: React.Ref<ToggleButtonProps.Ref>
  ) => {
    return (
      <InternalButton
        className={clsx(className, styles[`variant-${variant}`], { [styles.pressed]: pressed })}
        variant={variant}
        iconName={pressed ? pressedIconName : defaultIconName}
        iconUrl={pressed ? pressedIconUrl : defaultIconUrl}
        iconSvg={pressed ? pressedIconSvg : defaultIconSvg}
        aria-pressed={pressed}
        onClick={event => {
          if (onClick) {
            onClick(event);
          }

          fireNonCancelableEvent(onChange, { pressed: !pressed });
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);

export default InternalToggleButton;
