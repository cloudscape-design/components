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

  if (SYSTEM === 'core' && (style?.root || style?.label)) {
    properties = {
      control: {
        background: style?.root?.background && style.root.background[computedState],
      },
      label: {
        color: style?.label?.color && style.label.color[computedState],
      },
      focusRing: {
        borderColor: style?.root?.focusRing?.borderColor,
        borderRadius: style?.root?.focusRing?.borderRadius,
        borderWidth: style?.root?.focusRing?.borderWidth,
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

  if (SYSTEM === 'core' && style?.handle) {
    properties = {
      background: style?.handle?.background && style?.handle?.background[computedState],
    };
  }

  return properties;
}
