// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useRuntimeVisualRefresh } from '@cloudscape-design/component-toolkit/internal';

import { ALWAYS_VISUAL_REFRESH } from '../../environment';
import { useOneTheme } from './use-one-theme';

// One Theme is layered on top of the visual-refresh token set (its builder
// calls `buildVisualRefresh` and applies overrides), so it *is* visual refresh
// plus deltas. Components that gate behavior on VR should unlock that same
// behavior when One Theme is active.
function useDetectVisualRefresh(): boolean {
  // Call both unconditionally (before combining) so hook call order is stable.
  const runtimeVR = useRuntimeVisualRefresh();
  const oneTheme = useOneTheme();
  return runtimeVR || oneTheme;
}

export const useVisualRefresh = ALWAYS_VISUAL_REFRESH ? () => true : useDetectVisualRefresh;
export { useOneTheme } from './use-one-theme';
