// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

export const headerInfo = <Link variant="info">info</Link>;

export const headerActions = (
  <SpaceBetween direction="horizontal" size="xs">
    <Button>Action</Button>
    <Button>Another action</Button>
  </SpaceBetween>
);

export const headerTextActions = <StatusIndicator>Information</StatusIndicator>;
