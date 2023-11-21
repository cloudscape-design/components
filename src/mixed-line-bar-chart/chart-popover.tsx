// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import ChartPopover from '../internal/components/chart-popover';
import ChartSeriesDetails from '../internal/components/chart-series-details';
import { ChartDataTypes, MixedLineBarChartProps } from './interfaces';

import styles from './styles.css.js';
import { Transition } from '../internal/components/transition';
import { HighlightDetails } from './format-highlighted';
import ChartPopoverFooter from '../internal/components/chart-popover-footer';

export interface MixedChartPopoverProps<T extends ChartDataTypes> {
  containerRef: React.RefObject<HTMLDivElement>;
  trackRef: React.RefObject<SVGElement>;
  isOpen: boolean;
  isPinned: boolean;
  highlightDetails: null | HighlightDetails;
  onDismiss(): void;
  size: MixedLineBarChartProps<T>['detailPopoverSize'];
  footer?: React.ReactNode;
  dismissAriaLabel?: string;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  setPopoverText: (s: string) => void;
}

export default React.forwardRef(MixedChartPopover);

function MixedChartPopover<T extends ChartDataTypes>(
  {
    containerRef,
    trackRef,
    isOpen,
    isPinned,
    highlightDetails,
    footer,
    onDismiss,
    size = 'medium',
    dismissAriaLabel,
    onMouseEnter,
    onMouseLeave,
    onBlur,
    setPopoverText,
  }: MixedChartPopoverProps<T>,
  popoverRef: React.Ref<HTMLElement>
) {
  return (
    <Transition in={isOpen}>
      {(state, ref) => (
        <div ref={ref} className={clsx(state === 'exiting' && styles.exiting)}>
          {(isOpen || state !== 'exited') && highlightDetails && (
            <ChartPopover
              ref={popoverRef}
              title={highlightDetails.position}
              trackRef={trackRef}
              trackKey={highlightDetails.position}
              dismissButton={isPinned}
              dismissAriaLabel={dismissAriaLabel}
              onDismiss={onDismiss}
              container={containerRef.current}
              size={size}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onBlur={onBlur}
            >
              <ChartSeriesDetails details={highlightDetails.details} setPopoverText={setPopoverText} />
              {footer && <ChartPopoverFooter>{footer}</ChartPopoverFooter>}
            </ChartPopover>
          )}
        </div>
      )}
    </Transition>
  );
}
