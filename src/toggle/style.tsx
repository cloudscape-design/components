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

  const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly);

  if (SYSTEM === 'core' && (style?.input || style?.label)) {
    properties = {
      control: {
        background: style?.input?.background && style.input.background[computedState],
      },
      label: {
        color: style?.label?.color && style.label.color[computedState],
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

  const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly);

  if (SYSTEM === 'core' && style?.input?.handle?.background) {
    properties = {
      background: style.input.handle.background[computedState],
    };
  }

  return properties;
}
