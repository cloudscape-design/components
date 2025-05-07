// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

import { StructuredItemProps } from '../structured-item/interfaces';

export interface ListProps {
  items?: StructuredItemProps[];
  /**
   * @awsuiSystem core
   */
  children?: ReactNode;
}
