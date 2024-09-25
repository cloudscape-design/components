// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGlobalFlag } from '@cloudscape-design/component-toolkit/internal';

import { useVisualRefresh } from '../../internal/hooks/use-visual-mode';

export const useAppLayoutToolbarEnabled = () => {
  const isRefresh = useVisualRefresh();
  return isRefresh && (getGlobalFlag('appLayoutWidget') || getGlobalFlag('appLayoutToolbar'));
};
