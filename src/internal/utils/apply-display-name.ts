// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function applyDisplayName<T>(component: T, displayName: string): void {
  (component as { displayName?: string }).displayName = displayName;
}
