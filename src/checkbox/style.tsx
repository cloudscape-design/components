// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { SYSTEM } from '../internal/environment';
import { getComputedAbstractSwitchState } from '../internal/utils/style';
import { CheckboxProps } from './interfaces';

export function getAbstractSwitchStyles(
  style: CheckboxProps.Style | undefined,
  checked?: boolean,
  disabled?: boolean,
  readOnly?: boolean,
  indeterminate?: boolean
) {
  let properties = {};

  const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly, indeterminate);

  if (SYSTEM === 'core' && (style?.label || style?.input)) {
    properties = {
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

export function getCheckboxIconStyles(
  style: CheckboxProps.Style | undefined,
  checked?: boolean,
  disabled?: boolean,
  readOnly?: boolean,
  indeterminate?: boolean
) {
  let properties = {};

  const computedState = getComputedAbstractSwitchState(checked, disabled, readOnly, indeterminate);

  if (SYSTEM === 'core' && style?.input) {
    properties = {
      box: {
        fill: style.input?.fill && style.input.fill[computedState],
        stroke: style.input?.stroke && style.input.stroke[computedState],
      },
      line: {
        stroke:
          style.input?.check?.stroke &&
          style.input.check.stroke[computedState as keyof typeof style.input.check.stroke],
      },
    };
  }

  return properties;
}
