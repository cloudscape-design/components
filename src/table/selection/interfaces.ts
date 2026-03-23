// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export interface ItemSelectionProps {
  name: string;
  disabled: boolean;
  selectionType: 'single' | 'multi';
  indeterminate?: boolean;
  checked: boolean;
  onChange: () => void;
  onShiftToggle?: (value: boolean) => void;
  ariaLabel?: string;
  selectionGroupLabel?: string;
}

export interface SelectionProps<T> {
  isItemSelected: (item: T) => boolean;
  getSelectAllProps?: () => ItemSelectionProps;
  getItemSelectionProps?: (item: T) => ItemSelectionProps;
  getLoaderSelectionProps?: (item: null | T) => ItemSelectionProps;
}
