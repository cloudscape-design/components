// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { isThemeActive, Theme, useRuntimeVisualRefresh } from '@cloudscape-design/component-toolkit/internal';

import { ALWAYS_VISUAL_REFRESH } from '../../environment';

export const useVisualRefresh = ALWAYS_VISUAL_REFRESH ? () => true : useRuntimeVisualRefresh;

export const useOneTheme = () => isThemeActive(Theme.OneTheme);
