// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import { BaseComponentProps } from '../../../types/base-component';
import { OptionDefinition, OptionGroup } from '../../../types/option';

interface InternalOptionDefinition extends OptionDefinition {
  __customIcon?: React.ReactNode;
}

export interface DropdownOption {
  type?: 'child' | 'parent' | 'select-all' | 'use-entered';
  disabled?: boolean;
  disabledReason?: string;
  option: OptionDefinition | OptionGroup;
  afterHeader?: boolean;
  // Set on `parent` options when `collapsibleGroups` is enabled. Indicates the
  // group header renders an expand/collapse affordance.
  collapsible?: boolean;
  // Expanded state for a collapsible `parent` option. When `false`, the group's
  // child options are omitted from the rendered list.
  expanded?: boolean;
}

export interface OptionProps extends BaseComponentProps {
  option?: InternalOptionDefinition;
  triggerVariant?: boolean;
  highlightText?: string;
  highlightedOption?: boolean;
  selectedOption?: boolean;
  isGroupOption?: boolean;
  disableTitleTooltip?: boolean;
  labelContainerRef?: React.RefObject<HTMLSpanElement>;
  labelRef?: React.RefObject<HTMLSpanElement>;
  labelId?: string;
  customContent?: ReactNode;
}

// Backward-compatibility re-export for consumers importing this public type from the internal path.
export { OptionDefinition, OptionGroup } from '../../../types/option';
