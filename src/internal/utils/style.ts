// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function getComputedAbstractSwitchState(
  checked: boolean | undefined,
  disabled: boolean | undefined,
  readOnly: boolean | undefined
) {
  return disabled ? 'disabled' : readOnly ? 'readOnly' : checked ? 'checked' : 'default';
}
