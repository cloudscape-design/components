// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { getBaseProps } from '../internal/base-component';
import { InternalButtonGroupProps } from './interfaces';

export default function InternalButtonGroup({ __internalRootRef = null, ...props }: InternalButtonGroupProps) {
  const baseProps = getBaseProps(props);

  return (
    <div {...baseProps} ref={__internalRootRef}>
      test
    </div>
  );
}
