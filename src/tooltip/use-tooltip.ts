// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useRef, useState } from 'react';

import type { TooltipProps } from './interfaces';

export interface UseTooltipOptions {
  position?: TooltipProps['position'];
  size?: TooltipProps['size'];
  onDismiss?: () => void;
}

export function useTooltip(content: React.ReactNode, options?: UseTooltipOptions) {
  const ref = useRef<HTMLElement>(null);
  const [show, setShow] = useState(false);

  const handleDismiss = () => {
    setShow(false);
    options?.onDismiss?.();
  };

  return {
    // Spread these props on your trigger element
    triggerProps: {
      ref,
      onMouseEnter: () => setShow(true),
      onMouseLeave: () => setShow(false),
    },
    // Render this after your trigger element
    tooltip: show
      ? {
          trackRef: ref,
          value: content,
          position: options?.position,
          size: options?.size,
          onDismiss: options?.onDismiss ? handleDismiss : undefined,
        }
      : null,
    // Manual control if needed
    show,
    setShow,
  };
}
