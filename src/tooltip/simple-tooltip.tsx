// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';

import InternalTooltip from './internal';

export interface SimpleTooltipProps {
  /**
   * The tooltip content to display.
   */
  content: React.ReactNode;

  /**
   * The element that triggers the tooltip on hover.
   */
  children: React.ReactNode;

  /**
   * The position of the tooltip relative to the trigger element.
   * @default 'top'
   */
  position?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * A simplified, accessible tooltip component that requires minimal props.
 *
 * Features:
 * - Automatic state and ref management
 * - Keyboard accessible (Escape to dismiss)
 * - ARIA compliant
 * - Hover activation
 *
 * Example:
 * ```tsx
 * <SimpleTooltip content="This is a tooltip">
 *   <button>Hover me</button>
 * </SimpleTooltip>
 * ```
 */
export function SimpleTooltip({ content, children, position = 'top' }: SimpleTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(false);

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        // Make the trigger keyboard accessible if it contains interactive elements
        style={{ display: 'inline-block' }}
      >
        {children}
      </span>
      {show && (
        <InternalTooltip trackRef={triggerRef} value={content} position={position} onDismiss={() => setShow(false)} />
      )}
    </>
  );
}
