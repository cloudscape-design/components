// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Method to filter out internal properties prefixed by "__"
 */
export const getExternalProps = <T extends Record<string, any>>(props: T): T => {
  const externalProps: Partial<T> = {};
  for (const propName in props) {
    if (!propName.startsWith('__')) {
      externalProps[propName] = props[propName];
    }
  }
  return externalProps as T;
};
