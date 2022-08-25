// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { forwardRef } from 'react';

export interface FocusDetectorProps {
  onFocus: React.FocusEventHandler<HTMLDivElement>;
  disabled?: boolean;
}

/**
 * This component handles forwarding focus when navigating through the tab order.
 *
 * When the user focuses this component, the `onFocus` callback function is called
 * to move the focus to another element.
 */
const FocusDetector = forwardRef<HTMLDivElement, FocusDetectorProps>(({ onFocus, disabled = false }, ref) => (
  <div ref={ref} tabIndex={disabled ? -1 : 0} onFocus={onFocus} />
));

export default FocusDetector;
