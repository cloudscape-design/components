// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* istanbul ignore next */
export function getTextWidth(textNode: SVGTextElement) {
  return textNode.getComputedTextLength?.() ?? -1;
}
