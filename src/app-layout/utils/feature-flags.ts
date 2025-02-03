// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGlobalFlag } from '@cloudscape-design/component-toolkit/internal';

export const useAppLayoutToolbarEnabled = () => {
  return getGlobalFlag('appLayoutWidget') || getGlobalFlag('appLayoutToolbar');
};
