// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { BaseComponentProps } from '../internal/base-component';
import React from 'react';

export interface TextContentProps extends BaseComponentProps {
  /**
   * Content of the component.
   * @displayname content
   */
  children?: React.ReactNode;
}
