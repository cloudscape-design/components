// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Skeleton from '~components/skeleton';

export default function SkeletonVariantsPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h1>Skeleton Variants</h1>

      <h2>Default Variant (3em height)</h2>
      <Skeleton variant="default" />

      <h2 style={{ marginTop: '40px' }}>Text Variant (line-height-body-m)</h2>
      <Skeleton variant="text" />

      <h2 style={{ marginTop: '40px' }}>Text Variant with Custom Width</h2>
      <Skeleton variant="text" width="200px" />

      <h2 style={{ marginTop: '40px' }}>Multiple Text Variants (simulating text lines)</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="95%" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="90%" />
      </div>

      <h2 style={{ marginTop: '40px' }}>Comparison: Default vs Text</h2>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <p>Default:</p>
          <Skeleton variant="default" />
        </div>
        <div style={{ flex: 1 }}>
          <p>Text:</p>
          <Skeleton variant="text" />
        </div>
      </div>

      <h2 style={{ marginTop: '40px' }}>Without Explicit Variant (defaults to "default")</h2>
      <Skeleton />
    </div>
  );
}
