// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';

export function PositionProbe({ testId = 'probe' }: { testId?: string }) {
  const { position } = useGroupedControlContext();
  return <span data-testid={testId}>{position ?? 'none'}</span>;
}
