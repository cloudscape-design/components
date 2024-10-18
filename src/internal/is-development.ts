// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Allow use of `process.env.NODE_ENV` specifically.
 *
 * Bundlers like Webpack and Parcel find uses of `process.env.NODE_ENV` and
 * statically replace them with the actual value during the build. When creating
 * production bundles, the use is replaced with the string "production", and
 * dead code checkers (e.g. terser) will then remove our dev-only code from
 * production bundles, letting us write runtime checks and warnings that don't
 * hurt production bundle size or performance.
 */
declare const process: { env: { NODE_ENV?: string } };

/**
 * Whether the bundle is a development bundle.
 * Only use this in an if condition and on its own! This will help bundlers find
 * and remove the conditional statement for production bundles.
 */
export const isDevelopment = process.env.NODE_ENV !== 'production';
