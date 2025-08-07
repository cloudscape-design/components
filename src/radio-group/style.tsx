// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { getComputedAbstractSwitchState } from '../internal/utils/style';
import { RadioGroupProps } from './interfaces';

export function getOuterCircleStyle(
  style: RadioGroupProps.Style | undefined,
  checked: boolean | undefined,
  disabled: boolean | undefined,
  readOnly: boolean | undefined
) {
  let properties;

  const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly);

  if (SYSTEM === 'core' && style?.input) {
    properties = {
      fill: style.input?.fill && style.input.fill[computedState],
      stroke: style.input?.stroke && style.input.stroke[computedState as keyof typeof style.input.stroke],
    };
  }

  return properties;
}

export function getInnerCircleStyle(
  style: RadioGroupProps.Style | undefined,
  checked: boolean | undefined,
  disabled: boolean | undefined,
  readOnly: boolean | undefined
) {
  let properties;

  const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly);

  if (SYSTEM === 'core' && style?.input) {
    properties = {
      fill: style.input?.circle?.fill && style.input.circle.fill[computedState as keyof typeof style.input.circle.fill],
      stroke: style.input?.fill && style.input.fill[computedState],
    };
  }

  return properties;
}

export function getAbstractSwitchStyles(
  style: RadioGroupProps.Style | undefined,
  checked: boolean | undefined,
  disabled: boolean | undefined,
  readOnly: boolean | undefined
) {
  let properties = {};

  const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly);

  if (SYSTEM === 'core' && (style?.label || style?.description || style?.input)) {
    properties = {
      label: {
        color: style?.label?.color && style.label.color[computedState],
      },
      description: {
        color: style?.description?.color && style.description.color[computedState],
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
