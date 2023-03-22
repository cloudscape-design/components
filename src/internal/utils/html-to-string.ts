// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export function toString(node: any) {
  if (!node) {
    return '';
  }

  if (typeof node === 'string') {
    return node;
  }

  return (node as any).props.children; // how to do this correctly?
}
