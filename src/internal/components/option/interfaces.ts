// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { IconProps } from '../../../icon/interfaces';
import { BaseComponentProps } from '../../base-component';

export interface BaseOption {
  label?: string;
  disabled?: boolean;
}

export interface OptionDefinition<ValueType extends string = string> extends BaseOption {
  value?: ValueType;
  lang?: string;
  labelTag?: string;
  description?: string;
  iconAlt?: string;
  iconName?: IconProps.Name;
  iconUrl?: string;
  iconSvg?: React.ReactNode;
  tags?: ReadonlyArray<string>;
  filteringTags?: ReadonlyArray<string>;
  __labelPrefix?: string;
}

export interface InternalOptionDefinition extends OptionDefinition {
  __customIcon?: React.ReactNode;
}

export interface OptionGroup<ValueType extends string = string> extends BaseOption {
  options: ReadonlyArray<OptionDefinition<ValueType>>;
}

export interface DropdownOption {
  type?: string;
  disabled?: boolean;
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
