// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { KeyboardEventHandler, useRef, useState } from 'react';

import Arrow from '../popover/arrow';
import PopoverContainer from '../popover/container';
import PopoverBody from '../popover/body';
import Portal from '../internal/components/portal';
import { usePortalModeClasses } from '../internal/hooks/use-portal-mode-classes';
import { useReducedMotion } from '@cloudscape-design/component-toolkit/internal';

export interface TooltipProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const DEFAULT_OPEN_TIMEOUT_IN_MS = 120;

export default function Tooltip({ children, content, position = 'right' }: TooltipProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isReducedMotion = useReducedMotion(ref);
  const { open, triggerProps } = useTooltipOpen(isReducedMotion ? 0 : DEFAULT_OPEN_TIMEOUT_IN_MS);
  const portalClasses = usePortalModeClasses(ref);

  return (
    <span ref={ref} {...triggerProps}>
      {children}
      {open && (
        <Portal>
          <span className={portalClasses}>
            <PopoverContainer
              size="small"
              fixedWidth={false}
              position={position}
              trackRef={ref}
              arrow={position => <Arrow position={position} />}
              renderWithPortal={true}
              zIndex={7000}
            >
              <PopoverBody
                dismissButton={false}
                dismissAriaLabel={undefined}
                header={null}
                onDismiss={() => {}}
                overflowVisible="both"
              >
                <span data-testid="button-dropdown-disabled-reason" role="tooltip">
                  {content}
                </span>
              </PopoverBody>
            </PopoverContainer>
          </span>
        </Portal>
      )}
    </span>
  );
}

function useTooltipOpen(timeout: number) {
  const handle = useRef<number>();
  const [isOpen, setIsOpen] = useState(false);

  const close = () => {
    clearTimeout(handle.current);
    setIsOpen(false);
  };
  const open = () => setIsOpen(true);
  const openDelayed = () => {
    handle.current = setTimeout(open, timeout);
  };
  const onKeyDown: KeyboardEventHandler = e => {
    if (isOpen && isEscape(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      close();
    }
  };

  const onFocus = openDelayed;
  const onBlur = close;

  return {
    open: isOpen,
    triggerProps: {
      onBlur,
      onFocus,
      onKeyDown,
    },
  };
}

const isEscape = (key: string) => key === 'Escape' || key === 'Esc';
