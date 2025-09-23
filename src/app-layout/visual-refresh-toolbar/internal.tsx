// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { createLoadableComponent } from '../../internal/widgets/loader-mock';
import { AppLayoutStateProvider as AppLayoutStateImplementation, createWidgetizedAppLayoutState } from './state';
import { AfterMainSlotImplementation, createWidgetizedAppLayoutAfterMainSlot } from './widget-areas/after-main-slot';
import { BeforeMainSlotImplementation, createWidgetizedAppLayoutBeforeMainSlot } from './widget-areas/before-main-slot';
import {
  BottomContentSlotImplementation,
  createWidgetizedAppLayoutBottomContentSlot,
} from './widget-areas/bottom-content-slot';
import { createWidgetizedAppLayoutTopContentSlot, TopContentSlotImplementation } from './widget-areas/top-content-slot';

export const AppLayoutBeforeMainSlot = createWidgetizedAppLayoutBeforeMainSlot(
  createLoadableComponent(BeforeMainSlotImplementation)
);
export const AppLayoutAfterMainSlot = createWidgetizedAppLayoutAfterMainSlot(
  createLoadableComponent(AfterMainSlotImplementation)
);
export const AppLayoutTopContentSlot = createWidgetizedAppLayoutTopContentSlot(
  createLoadableComponent(TopContentSlotImplementation)
);
export const AppLayoutBottomContentSlot = createWidgetizedAppLayoutBottomContentSlot(
  createLoadableComponent(BottomContentSlotImplementation)
);
export const AppLayoutWidgetizedState = createWidgetizedAppLayoutState(
  createLoadableComponent(AppLayoutStateImplementation)
);
