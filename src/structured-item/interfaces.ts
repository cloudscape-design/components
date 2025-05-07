// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ReactNode } from 'react';

export interface StructuredItemProps {
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  disableTypography?: boolean;
  percentageWrapping?: boolean;
}
