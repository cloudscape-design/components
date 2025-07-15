// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { HTMLAttributes, useRef } from 'react';
import clsx from 'clsx';

import Tooltip from '../../tooltip';
import { DragHandleProps } from '../interfaces';
import DirectionButton from './direction-button';
import PortalOverlay from './portal-overlay';

import styles from '../styles.css.js';

export interface DragHandleWrapperProps {
  tooltipText?: string;
  directions: Partial<Record<DragHandleProps.Direction, DragHandleProps.DirectionState>>;
  children: React.ReactNode;

  showButtons: boolean;
  showTooltip: boolean;

  nativeAttributes?: HTMLAttributes<HTMLElement>;
  onDirectionClick?: (direction: DragHandleProps.Direction) => void;
  onTooltipDismiss?: () => void;
}

export default function DragHandleWrapper({
  directions,
  tooltipText,
  children,
  onDirectionClick,
  onTooltipDismiss,
  showButtons,
  showTooltip,
  nativeAttributes,
}: DragHandleWrapperProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      {/* Rendered using "display: inline", but can be restyled. Mostly serves as a container for listening to events. */}
      <div
        {...nativeAttributes}
        className={clsx(styles['drag-handle-wrapper'], nativeAttributes?.className)}
        ref={trackRef}
      >
        {children}
        {/* We want events like onPointerEnter/onPointerLeave to include the tooltip. */}
        {showTooltip && <Tooltip trackRef={trackRef} value={tooltipText} onDismiss={onTooltipDismiss} />}
      </div>

      <PortalOverlay track={trackRef} isDisabled={!showButtons}>
        {directions['block-start'] && (
          <DirectionButton
            show={showButtons}
            direction="block-start"
            state={directions['block-start']}
            onClick={() => onDirectionClick?.('block-start')}
          />
        )}
        {directions['block-end'] && (
          <DirectionButton
            show={showButtons}
            direction="block-end"
            state={directions['block-end']}
            onClick={() => onDirectionClick?.('block-end')}
          />
        )}
        {directions['inline-start'] && (
          <DirectionButton
            show={showButtons}
            direction="inline-start"
            state={directions['inline-start']}
            onClick={() => onDirectionClick?.('inline-start')}
          />
        )}
        {directions['inline-end'] && (
          <DirectionButton
            show={showButtons}
            direction="inline-end"
            state={directions['inline-end']}
            onClick={() => onDirectionClick?.('inline-end')}
          />
        )}
      </PortalOverlay>
    </>
  );
}
