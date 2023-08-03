// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { TocProps } from './interfaces';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalToc from './internal';

export { TocProps };

export default function Toc({ variant = 'default', ...props }: TocProps) {
  return <InternalToc variant={variant} {...props} />;
}
applyDisplayName(Toc, 'Toc');
