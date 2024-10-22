// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { LiveRegionProps } from './interfaces';
import InternalLiveRegion from './internal';

export { LiveRegionProps };

function LiveRegion({ assertive = false, hidden = false, tagName = 'div', ...restProps }: LiveRegionProps) {
  const baseComponentProps = useBaseComponent('LiveRegion');

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
