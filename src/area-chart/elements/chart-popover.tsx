// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ChartPopover from '../../internal/components/chart-popover';
import ChartSeriesDetails from '../../internal/components/chart-series-details';

import { AreaChartProps } from '../interfaces';
import { ChartModel } from '../model';
import styles from '../styles.css.js';
import { HighlightDetails } from './use-highlight-details';

export default function AreaChartPopover<T extends AreaChartProps.DataTypes>({
  model,
  highlightDetails,
  dismissAriaLabel,
  footer,
  size,
}: {
  model: ChartModel<T>;
  highlightDetails: null | HighlightDetails;
  dismissAriaLabel?: string;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}) {
  if (!highlightDetails) {
    return null;
  }

  const popoverProps = {
    title: highlightDetails.formattedX,
    trackRef: model.refs.verticalMarker,
    trackKey: highlightDetails.highlightIndex,
    dismissButton: highlightDetails.isPopoverPinned,
    onDismiss: model.handlers.onPopoverDismiss,
    onMouseLeave: model.handlers.onPopoverLeave,
    ref: model.refs.popoverRef,
  };

  return (
    <ChartPopover
      {...popoverProps}
      container={model.refs.container.current}
      dismissAriaLabel={dismissAriaLabel}
      size={size}
    >
      <ChartSeriesDetails details={highlightDetails.seriesDetails} />
      <div className={styles['popover-divider']} />
      <ChartSeriesDetails details={highlightDetails.totalDetails} />
      {footer}
    </ChartPopover>
  );
}
