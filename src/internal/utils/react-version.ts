// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

export function getReactMajorVersion(): number {
  const versionString = React.version?.split('.')[0];
  return versionString ? parseInt(versionString, 10) : NaN;
}
