// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useEffect, useRef } from 'react';
import { renderTextContent } from '../internal/components/responsive-text';

interface ResponsiveTextProps {
  x: number;
  y: number;
  rightSide?: boolean;
  className?: string;
  children: string;
  containerBoundaries: null | { left: number; right: number };
}

export default memo(ResponsiveText);

function ResponsiveText({ x, y, rightSide, className, children, containerBoundaries }: ResponsiveTextProps) {
  const actualRef = useRef<SVGTextElement>(null);
  const virtualRef = useRef<SVGTextElement>(null);

  // Determine the visible width of the text and if necessary truncate it until it fits.
  useEffect(() => {
    // The debouncing is necessary for visual smoothness.
    const timeoutId = setTimeout(() => {
      const groupRect = virtualRef.current!.getBoundingClientRect();
      const visibleWidth = containerBoundaries ? getVisibleWidth(groupRect, containerBoundaries) : 0;
      renderTextContent(actualRef.current!, children, visibleWidth);
    }, 25);
    return () => clearTimeout(timeoutId);
  });

  return (
    <>
      {/* Invisible sample text used for measurement */}
      <text
        ref={virtualRef}
        x={x}
        y={y}
        style={{ textAnchor: rightSide ? 'start' : 'end', visibility: 'hidden' }}
        aria-hidden="true"
        className={className}
      >
        {children}
      </text>

      {/* Text node to render truncated text into */}
      <text ref={actualRef} x={x} y={y} style={{ textAnchor: rightSide ? 'start' : 'end' }} className={className}>
        {children}
      </text>
    </>
  );
}

function getVisibleWidth(element: { left: number; right: number }, container: { left: number; right: number }): number {
  if (element.left < container.left) {
    return element.right - container.left;
  } else if (element.right > container.right) {
    return container.right - element.left;
  } else {
    return container.right - container.left;
  }
}
