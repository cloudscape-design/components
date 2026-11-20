// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleSlot } from '../../types/utils';

export function getStyleClassName<Args, Value = string>(slot: StyleSlot<Args, Value> | undefined, args: Args) {
  return typeof slot === 'function' ? (slot as (args: Args) => Value | undefined)(args) : slot;
}
