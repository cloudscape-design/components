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
 * Utility type that makes a union of given type and undefined.
 * @example
 * ```
 * type OptionalString = Optional<string>
 * type OptionalStringOrNumber = Optional<string | number>
 * ```
 */
export type Optional<Type> = Type | undefined;
