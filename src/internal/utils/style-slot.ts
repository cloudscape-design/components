// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// A Style API v2 slot that takes a class name, or a function of the slot arguments that returns one.
export type Slot<Args> = string | ((args: Args) => string | undefined);

export function getStyleClassName<Args>(slot: Slot<Args> | undefined, args: Args) {
  return typeof slot === 'function' ? slot(args) : slot;
}
