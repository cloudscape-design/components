// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';

import { usePortalModeClasses } from '../../../../../lib/components/internal/hooks/use-portal-mode-classes';

export function RenderTest({ refClasses }: { refClasses: string }) {
  const ref = useRef(null);
  const classes = usePortalModeClasses(ref);
  return (
    <div>
      <div ref={ref} className={refClasses} />
      <div data-testid="subject" className={classes} />
    </div>
  );
}
