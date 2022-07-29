// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export interface TabTrapProps {
  focusNextCallback: FocusNextElement;
  disabled?: boolean;
}

export interface FocusNextElement {
  (): void;
}

// This component handles focus-forwarding when navigating through the calendar grid.
// When the customer focuses that component the `next` callback function is called
// with forwards the focus.
export default function TabTrap({ focusNextCallback, disabled = false }: TabTrapProps) {
  return <div tabIndex={disabled ? -1 : 0} onFocus={focusNextCallback} />;
}
