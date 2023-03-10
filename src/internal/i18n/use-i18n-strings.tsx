// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line no-restricted-imports
import cloneDeep from 'lodash/cloneDeep';
// eslint-disable-next-line no-restricted-imports
import has from 'lodash/has';
// eslint-disable-next-line no-restricted-imports
import set from 'lodash/set';

import { useI18nContext } from './context';
import { PropertyOverride, i18nPropertyOverrides } from './overrides';

export function useI18nStrings<P extends Record<string, any>>(
  componentName: string,
  sourceProps: P,
  overrides: Record<string, PropertyOverride> | undefined = i18nPropertyOverrides[componentName]
): P {
  const localeMessages = useI18nContext();
  if (localeMessages === null || !(componentName in localeMessages)) {
    return sourceProps;
  }

  // PERF: This has the potential to cause many unnecessary rerenders.
  //   The fix would be to shallow clone, and only insert lazily while cloning
  //   all parents (because we still want to maintain immutability).

  const props = cloneDeep(sourceProps);
  const messages = localeMessages[componentName];

  for (const messagePath of Object.keys(messages)) {
    if (!has(props, messagePath)) {
      let value;
      if (overrides?.[messagePath]) {
        // PERF: All functions can be stable (depending on localeMessages).
        value = (...args: unknown[]) => messages[messagePath](overrides[messagePath](...args));
      } else {
        value = messages[messagePath]();
      }
      set(props, messagePath, value);
    }
  }

  return props;
}
