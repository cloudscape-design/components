// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { DefineIconsInput } from './interfaces';

/**
 * Defines a set of custom icons for use with {@link IconProvider}.
 * Use with {@link IconMap} and `declare module` to register the icon names.
 *
 * @example
 * const myIcons = defineIcons({ "my-icon": <MySvg /> });
 *
 * declare module "@cloudscape-design/components/icon-provider" {
 *   interface IconRegistry extends IconMap<typeof myIcons> {}
 * }
 */
export function defineIcons<T extends DefineIconsInput>(icons: T): T {
  return icons;
}
