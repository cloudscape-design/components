// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use client';
import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { LiveRegionProps } from './interfaces.js';
import InternalLiveRegion from './internal.js';

export { LiveRegionProps };

function LiveRegion({ assertive = false, hidden = false, tagName = 'div', ...restProps }: LiveRegionProps) {
  const baseComponentProps = useBaseComponent('LiveRegion', { props: { assertive, hidden } });

  return (
    <InternalLiveRegion
      assertive={assertive}
      hidden={hidden}
      tagName={tagName}
      {...baseComponentProps}
      {...restProps}
    />
  );
}

applyDisplayName(LiveRegion, 'LiveRegion');

export default LiveRegion;
