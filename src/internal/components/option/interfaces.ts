// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../../../icon/interfaces';
import { BaseComponentProps } from '../../base-component';

export interface BaseOption {
  label?: string;
  disabled?: boolean;
  disabledReason?: string;
  labelTag?: string;
  tags?: ReadonlyArray<string>;
}

export interface OptionDefinition extends BaseOption {
  value?: string;
  lang?: string;
  description?: string;
  iconAlt?: string;
  iconName?: IconProps.Name;
  iconUrl?: string;
  iconSvg?: React.ReactNode;
  filteringTags?: ReadonlyArray<string>;
  __labelPrefix?: string;
}

export interface InternalOptionDefinition extends OptionDefinition {
  __customIcon?: React.ReactNode;
}

export interface OptionGroup extends BaseOption {
  options: ReadonlyArray<OptionDefinition>;
}

export interface DropdownOption {
  type?: string;
  disabled?: boolean;
  disabledReason?: string;
  option: OptionDefinition | OptionGroup;
}

export interface OptionProps extends BaseComponentProps {
  option?: InternalOptionDefinition;
  triggerVariant?: boolean;
  highlightText?: string;
  highlightedOption?: boolean;
  selectedOption?: boolean;
  isGroupOption?: boolean;
  isGenericGroup?: boolean;
}
