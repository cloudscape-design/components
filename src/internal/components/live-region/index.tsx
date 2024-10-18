// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

// import useBaseComponent from '../../hooks/use-base-component';
import { applyDisplayName } from '../../utils/apply-display-name';
import { LiveRegionProps } from './interfaces';
import InternalLiveRegion from './internal';

export { LiveRegionProps };

function LiveRegion({ assertive = false, hidden = false, tagName = 'div', ...restProps }: LiveRegionProps) {
  // TODO: Switch this out when moving this component out of internal
  // const baseComponentProps = useBaseComponent('LiveRegion');
  const baseComponentProps = { __internalRootRef: React.useRef() };

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
