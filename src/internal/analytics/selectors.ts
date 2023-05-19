// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
export const getFunnelNameSelector = () => '[data-analytics-context="breadcrumb"]';
export const getSubStepAllSelector = () => `[data-analytics-substep]`;
export const getSubStepSelector = (subStepId: string) => `[data-analytics-substep="${subStepId}"]`;
export const getSubStepNameSelector = (subStepId: string) =>
  `[data-analytics-substep="${subStepId}"] [data-analytics="heading-text"]`;
export const getElementSelector = (uniqueId: string) => `[data-analytics-element-id="${uniqueId}"]`;
