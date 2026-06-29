// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { BaseComponentProps } from '../types/base-component';

export interface TextContentProps extends BaseComponentProps {
  /**
   * Content of the component.
   * @displayname content
   */
  children?: React.ReactNode;
}
