// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { AppLayoutPendingState, AppLayoutState } from '../interfaces';

export function isWidgetReady(state: AppLayoutPendingState): state is AppLayoutState {
  return !!state.widgetizedState;
}
