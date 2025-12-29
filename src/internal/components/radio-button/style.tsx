// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { RadioGroupProps } from '../../../radio-group/interfaces';
import { SYSTEM } from '../../environment';
import { getComputedAbstractSwitchState } from '../../utils/style';

export function getOuterCircleStyle(
  style: RadioGroupProps.Style | undefined,
  checked: boolean | undefined,
  disabled: boolean | undefined,
  readOnly: boolean | undefined
) {
  let properties;

  if (SYSTEM === 'core' && style?.input) {
    const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly, undefined);

    properties = {
      fill: style.input?.fill && style.input.fill[computedState as keyof typeof style.input.fill],
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

  if (SYSTEM === 'core' && style?.input) {
    const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly, undefined);

    properties = {
      fill: style.input?.circle?.fill && style.input.circle.fill[computedState as keyof typeof style.input.circle.fill],
      stroke: style.input?.fill && style.input.fill[computedState as keyof typeof style.input.fill],
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

  if (SYSTEM === 'core' && (style?.label || style?.description || style?.input)) {
    const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly, undefined);

    properties = {
      label: {
        color: style?.label?.color && style.label.color[computedState as keyof typeof style.label.color],
      },
      description: {
        color:
          style?.description?.color && style.description.color[computedState as keyof typeof style.description.color],
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
