// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { IconProps } from '../icon/interfaces';

interface BaseOption {
  value?: string;
  label?: string;
  labelContent?: React.ReactNode;
  lang?: string;
  description?: string;
  disabled?: boolean;
  disabledReason?: string;
  labelTag?: string;
  tags?: ReadonlyArray<string>;
  filteringTags?: ReadonlyArray<string>;
  iconAlt?: string;
  iconAriaLabel?: string;
  iconName?: IconProps.Name;
  iconUrl?: string;
  iconSvg?: React.ReactNode;
}

export interface OptionDefinition extends BaseOption {
  __labelPrefix?: string;
}

export interface OptionGroup extends BaseOption {
  options: ReadonlyArray<OptionDefinition>;
}
