// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { getComputedAbstractSwitchState } from '../internal/utils/style';
import { ToggleProps } from './interfaces';

export function getAbstractSwitchStyles(
  style: ToggleProps.Style | undefined,
  checked: boolean | undefined,
  disabled: boolean | undefined,
  readOnly: boolean | undefined
) {
  let properties = {};

  if (SYSTEM === 'core' && (style?.input || style?.label)) {
    const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly, false);

    properties = {
      control: {
        background:
          style?.input?.background && style.input.background[computedState as keyof typeof style.input.background],
      },
      label: {
        color: style?.label?.color && style.label.color[computedState as keyof typeof style.label.color],
      },
      focusRing: {
        borderColor: style?.input?.focusRing?.borderColor,
        borderRadius: style?.input?.focusRing?.borderRadius,
        borderWidth: style?.input?.focusRing?.borderWidth,
      },
    };
  }

  return properties;
}

export function getStyledControlStyle(
  style: ToggleProps.Style | undefined,
  checked: boolean | undefined,
  disabled: boolean | undefined,
  readOnly: boolean | undefined
) {
  let properties = {};

  if (SYSTEM === 'core' && style?.input?.handle?.background) {
    const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly, undefined);

    properties = {
      background: style.input.handle.background[computedState as keyof typeof style.input.handle.background],
    };
  }

  return properties;
}
