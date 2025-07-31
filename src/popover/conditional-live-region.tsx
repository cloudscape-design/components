// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ReactNode } from 'react';

import InternalLiveRegion from '../live-region/internal';

interface ConditionalLiveRegionProps {
  condition: boolean;
  children: ReactNode;
}

const ConditionalLiveRegion = ({ condition, children }: ConditionalLiveRegionProps) => {
  if (condition) {
    return <InternalLiveRegion>{children}</InternalLiveRegion>;
  }
  return <>{children}</>;
};

export default ConditionalLiveRegion;
