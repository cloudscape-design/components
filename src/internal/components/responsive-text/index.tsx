// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useEffect, useRef } from 'react';
import { getTextWidth } from './responsive-text-utils';

interface ResponsiveTextProps {
  x: number;
  y: number;
  className?: string;
  children: string;
  maxWidth: number;
}

export default memo(ResponsiveText);

function ResponsiveText({ x, y, className, children, maxWidth }: ResponsiveTextProps) {
  const textRef = useRef<SVGTextElement>(null);

  // Determine the visible width of the text and if necessary truncate it until it fits.
  useEffect(() => {
    renderTextContent(textRef.current!, children, maxWidth);
  }, [maxWidth, children]);

  return (
    <text ref={textRef} x={x} y={y} style={{ textAnchor: 'end' }} className={className}>
      {children}
    </text>
  );
}

export function renderTextContent(textNode: SVGTextElement, text: string, maxWidth: number) {
  let visibleLength = text.length;
  while (visibleLength >= 0) {
    textNode.textContent = truncateText(text, visibleLength);

    if (getTextWidth(textNode) <= maxWidth) {
      return;
    } else {
      visibleLength--;
    }
  }
}

function truncateText(text: string, maxLength: number) {
  if (text.length === maxLength) {
    return text;
  }
  return text.slice(0, maxLength) + '…';
}
