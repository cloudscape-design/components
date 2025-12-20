// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Utility functions for SSR compatibility in demo pages
 */

/**
 * Check if code is running on the server (SSR) or client
 */
export const isServer = typeof window === 'undefined';

/**
 * Check if code is running on the client (browser)
 */
export const isClient = typeof window !== 'undefined';

/**
 * Safely access window object, returns undefined on server
 */
export function getWindow(): Window | undefined {
  return isClient ? window : undefined;
}

/**
 * Safely access document object, returns undefined on server
 */
export function getDocument(): Document | undefined {
  return isClient ? document : undefined;
}

/**
 * Safely access navigator object, returns undefined on server
 */
export function getNavigator(): Navigator | undefined {
  return isClient ? navigator : undefined;
}

/**
 * Execute a function only on the client side
 * Returns undefined on the server
 */
export function clientOnly<T>(fn: () => T): T | undefined {
  return isClient ? fn() : undefined;
}
