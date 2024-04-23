// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useEffect, useRef } from 'react';
import { getTextWidth } from './responsive-text-utils';
import { isRtl as getIsRtl } from '../../direction';

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
  const isRtl = textRef.current ? getIsRtl(textRef.current) : false;

  // Determine the visible width of the text and if necessary truncate it until it fits.
  useEffect(() => {
    renderTextContent(textRef.current!, children, maxWidth, isRtl);
  }, [maxWidth, children, isRtl]);

  return (
    <text ref={textRef} x={x} y={y} style={{ textAnchor: 'end' }} className={className}>
      {children}
    </text>
  );
}

export function renderTextContent(textNode: SVGTextElement, text: string, maxWidth: number, isRtl: boolean) {
  let visibleLength = text.length;
  while (visibleLength >= 0) {
    textNode.textContent = truncateText(text, visibleLength, isRtl);

    if (getTextWidth(textNode) <= maxWidth) {
      return;
    } else {
      visibleLength--;
    }
  }
}

function truncateText(text: string, maxLength: number, isRtl: boolean) {
  if (text.length === maxLength) {
    return text;
  }
  if (isRtl) {
    return text.slice(text.length - maxLength) + '…';
  }
  return text.slice(0, maxLength) + '…';
}
