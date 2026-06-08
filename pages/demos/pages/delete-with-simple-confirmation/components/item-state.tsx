// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import StatusIndicator from '@cloudscape-design/components/status-indicator';

export default function ItemState({ state }: { state: string }) {
  if (state === 'deleting') {
    return <StatusIndicator type="pending">Deleting...</StatusIndicator>;
  }
  return <StatusIndicator type={state === 'Deactivated' ? 'error' : 'success'}>{state}</StatusIndicator>;
}
