// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ChartPopover from '../../internal/components/chart-popover/index.js';
import ChartPopoverFooter from '../../internal/components/chart-popover-footer/index.js';
import ChartSeriesDetails from '../../internal/components/chart-series-details/index.js';
import { AreaChartProps } from '../interfaces.js';
import { ChartModel } from '../model/index.js';
import { HighlightDetails } from './use-highlight-details.js';

import styles from '../styles.css.js';

export default function AreaChartPopover<T extends AreaChartProps.DataTypes>({
  model,
  highlightDetails,
  dismissAriaLabel,
  footer,
  size,
  onBlur,
}: {
  model: ChartModel<T>;
  highlightDetails: null | HighlightDetails;
  dismissAriaLabel?: string;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  onBlur?: (event: React.FocusEvent) => void;
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
      onBlur={onBlur}
    >
      <ChartSeriesDetails details={highlightDetails.seriesDetails} />
      <div className={styles['popover-divider']} />
      <ChartSeriesDetails details={highlightDetails.totalDetails} />
      {footer && <ChartPopoverFooter>{footer}</ChartPopoverFooter>}
    </ChartPopover>
  );
}
