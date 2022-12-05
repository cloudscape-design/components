// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

/**
 * Updates text of the target node if it's differ from source node.
 * @param targetRef - Ref to the element with aria-live
 * @param sourceRef - Ref to the element to be announced
 */
export function updateLiveRegion(
  targetRef: React.RefObject<HTMLSpanElement>,
  sourceRef: React.RefObject<HTMLSpanElement>
) {
  if (targetRef.current && sourceRef.current) {
    const sourceContent = extractInnerText(sourceRef.current);
    const targetContent = extractInnerText(targetRef.current);
    if (targetContent !== sourceContent) {
      // The aria-atomic does not work properly in Voice Over, causing
      // certain parts of the content to be ignored. To fix that,
      // we assign the source text content as a single node.
      targetRef.current.innerText = sourceContent;
    }
  }
}

// This only extracts text content from the node including all its children which is enough for now.
// To make it more powerful, it is possible to create a more sophisticated extractor with respect to
// ARIA properties to ignore aria-hidden nodes and read ARIA labels from the live content.
function extractInnerText(node: HTMLElement) {
  return (node.innerText || '').replace(/\s+/g, ' ').trim();
}
