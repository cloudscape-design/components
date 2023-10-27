// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export function getTextWidth(textNode: SVGTextElement) {
  // Ignoring as unsupported in JSDom.
  /* istanbul ignore next */
  if (textNode.getComputedTextLength) {
    return textNode.getComputedTextLength();
  }
  return -1;
}
