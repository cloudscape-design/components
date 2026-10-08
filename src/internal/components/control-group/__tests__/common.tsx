// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { useGroupedControlContext } from '../../../../../lib/components/internal/context/control-group-context';

export function PositionProbe({ testId = 'probe' }: { testId?: string }) {
  const { position } = useGroupedControlContext();
  return <span data-testid={testId}>{position ?? 'none'}</span>;
}

export function DirectionProbe({ testId = 'direction-probe' }: { testId?: string }) {
  const { direction } = useGroupedControlContext();
  return <span data-testid={testId}>{direction}</span>;
}

export function HasActionProbe({ testId = 'has-action-probe' }: { testId?: string }) {
  const { hasAction } = useGroupedControlContext();
  return <span data-testid={testId}>{hasAction ? 'yes' : 'no'}</span>;
}
