// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// SomeRequired, Optional and FocusRingStyle are consumed by public component interfaces, so their
// canonical definitions now live in the public `src/types` location. They are re-exported here for
// backward compatibility with internal modules and downstream consumers of this internal path.
export { FocusRingStyle, Optional, SomeRequired } from '../types/utils';

/**
 * Makes specified properties optional.
 *
 * @example
 * ```
 * type PartialAlertProps = SomeOptional<AlertProps, 'type' | 'children'>
 * ```
 */
export type SomeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Use this function to mark conditions which should never be visited
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertNever(_value: never) {
  /* istanbul ignore next: this code is not intended to be visited */
  return null;
}
