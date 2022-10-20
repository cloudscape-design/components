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

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
