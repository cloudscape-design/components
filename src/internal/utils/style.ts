// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function getComputedAbstractSwitchState(
  checked: boolean | undefined,
  disabled: boolean | undefined,
  readOnly: boolean | undefined,
  indeterminate: boolean | undefined,
  defaultValue: string = 'default'
) {
  let computedState;

  if (disabled) {
    computedState = 'disabled';
  } else if (readOnly) {
    computedState = 'readOnly';
  } else if (indeterminate) {
    computedState = 'indeterminate';
  } else if (checked) {
    computedState = 'checked';
  } else {
    computedState = defaultValue;
  }

  return computedState;
}
