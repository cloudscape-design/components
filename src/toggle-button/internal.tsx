// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import { warnOnce } from '@cloudscape-design/component-toolkit/internal';

import InternalButton from '../button/internal';
import { fireNonCancelableEvent } from '../internal/events';
import { isDevelopment } from '../internal/is-development';
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
    if (isDevelopment) {
      if (defaultIconName && !pressedIconName) {
        warnOnce('ToggleButton', '`pressedIconName` must be provided for `pressed` state.');
      }

      if (defaultIconSvg && !pressedIconSvg) {
        warnOnce('ToggleButton', '`pressedIconSvg` must be provided for `pressed` state.');
      }

      if (defaultIconUrl && !pressedIconUrl) {
        warnOnce('ToggleButton', '`pressedIconUrl` must be provided for `pressed` state.');
      }
    }

    return (
      <InternalButton
        className={clsx(className, styles[`variant-${variant}`], { [styles.pressed]: pressed })}
        variant={variant}
        iconName={getToggleIcon(pressed, defaultIconName, pressedIconName)}
        iconUrl={getToggleIcon(pressed, defaultIconUrl, pressedIconUrl)}
        iconSvg={getToggleIcon(pressed, defaultIconSvg, pressedIconSvg)}
        aria-pressed={pressed}
        onClick={event => {
          event.preventDefault();

          fireNonCancelableEvent(onChange, { pressed: !pressed });
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);

export default InternalToggleButton;
