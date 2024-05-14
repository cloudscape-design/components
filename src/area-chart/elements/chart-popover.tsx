// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ChartPopover from '../../internal/components/chart-popover';
import ChartSeriesDetails from '../../internal/components/chart-series-details';

import { AreaChartProps } from '../interfaces';
import { ChartModel } from '../model';
import styles from '../styles.css.js';
import { HighlightDetails } from './use-highlight-details';
import ChartPopoverFooter from '../../internal/components/chart-popover-footer';

export default function AreaChartPopover<T extends AreaChartProps.DataTypes>({
  popoverId,
  model,
  highlightDetails,
  dismissAriaLabel,
  footer,
  size,
  onBlur,
}: {
  popoverId: string;
  model: ChartModel<T>;
  highlightDetails: null | HighlightDetails;
  dismissAriaLabel?: string;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  onBlur?: (event: React.FocusEvent) => void;
}) {
  return (
    <ChartPopover
      popoverId={popoverId}
      isOpen={!!highlightDetails}
      ref={model.refs.popoverRef}
      title={highlightDetails?.formattedX}
      trackRef={model.refs.verticalMarker}
      trackKey={highlightDetails?.highlightIndex}
      dismissButton={highlightDetails?.isPopoverPinned}
      onDismiss={model.handlers.onPopoverDismiss}
      onMouseLeave={model.handlers.onPopoverLeave}
      container={model.refs.container.current}
      dismissAriaLabel={dismissAriaLabel}
      size={size}
      onBlur={onBlur}
    >
      {highlightDetails && (
        <>
          <ChartSeriesDetails details={highlightDetails.seriesDetails} />
          <div className={styles['popover-divider']} />
          <ChartSeriesDetails details={highlightDetails.totalDetails} />
        </>
      )}
      {footer && <ChartPopoverFooter>{footer}</ChartPopoverFooter>}
    </ChartPopover>
  );
}
