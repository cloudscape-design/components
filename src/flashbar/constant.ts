// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * This is a delay that delays the `entering` transition state
 * for the flashbar to be executed, this is useful for:
 * - If a flashbar is exiting and another is entering at the same time we'd want to delay the entering to
 * prevent the jumping in the layout
 * The current animation time for the exiting can be found in motion.scss which is equivilant to 115ms,
 * if in the future this value is changed for the exiting animation we'll have to change this as well to match it
 */
export const TIMEOUT_FOR_ENTERING_ANIMATION = 115;
