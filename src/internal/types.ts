// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/**
 * Makes specified properties required.
 *
 * @example
 * ```
 * import { AlertProps } from '~components/alert/interfaces'
 *
 * type InternalAlertProps = SomeRequired<AlertProps, 'type'>
 *
 * function Alert(props: AlertProps) { ... }
 * function InternalAlert(props: InternalAlertProps) { ... }
 * ```
 */
export type SomeRequired<Type, Keys extends keyof Type> = Type & {
  [Key in Keys]-?: Type[Key];
};

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
 * Utility type that makes a union of given type and undefined.
 * @example
 * ```
 * type OptionalString = Optional<string>
 * type OptionalStringOrNumber = Optional<string | number>
 * ```
 */
export type Optional<Type> = Type | undefined;

/**
 * A React ref shim that avoids dependency on React typings.
 * This makes the code portable across major React versions.
 *
 * @example
 * ```
 * interface MyProps {
 *   anchorRef: RefShim<HTMLElement>;
 * }
 * ```
 */
export interface RefShim<T> {
  current: T | null;
}

/**
 * Use this function to mark conditions which should never be visited
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function assertNever(_value: never) {
  /* istanbul ignore next: this code is not intended to be visited */
  return null;
}
