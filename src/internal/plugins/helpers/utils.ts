// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function sortByPriority<T extends { orderPriority?: number; id: string }>(items: Array<T>) {
  return items.slice().sort((a, b) => {
    if (b.orderPriority !== a.orderPriority) {
      return Math.sign((b.orderPriority ?? 0) - (a.orderPriority ?? 0));
    }
    return b.id < a.id ? 1 : -1;
  });
}
