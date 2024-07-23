// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import LiveRegion from '~components/internal/components/live-region';

export default function LiveRegionXSS() {
  return (
    <>
      <h1>Live region</h1>
      <LiveRegion delay={0}>
        {`<p>Testing</p>`}
        <p>Testing</p>
      </LiveRegion>
    </>
  );
}
