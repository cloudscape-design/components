// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { ALWAYS_VISUAL_REFRESH } from '../../environment';
import { useRuntimeVisualRefresh } from '@cloudscape-design/component-toolkit/internal';

export const useVisualRefresh = ALWAYS_VISUAL_REFRESH ? () => true : useRuntimeVisualRefresh;
