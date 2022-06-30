// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Method to filter out internal properties prefixed by "__"
 */
export const getExternalProps = <T extends Record<string, any>>(props: T): T => {
  const externalPropNames = Object.keys(props).filter(
    (propName: string) => propName.indexOf('__') !== 0
  ) as (keyof T)[];
  return externalPropNames.reduce<Partial<T>>((acc: Partial<T>, propName: keyof T) => {
    acc[propName] = props[propName];
    return acc;
  }, {}) as T;
};
