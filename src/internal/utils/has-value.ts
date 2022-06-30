// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function hasValue<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
