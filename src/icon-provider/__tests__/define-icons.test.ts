// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { defineIcons } from '../../../lib/components/icon-provider';

// Compile-time helpers: Assert<T> only compiles when T is `true`.
type IsExact<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Assert<T extends true> = never;

describe('defineIcons', () => {
  it('returns the same object reference', () => {
    const icons = { 'add-plus': 'override', rocket: 'custom' };
    const result = defineIcons(icons);
    expect(result).toBe(icons);

    // Return type has exact keys 'rocket' | 'zap', not widened to string
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type KeysAreExact = Assert<IsExact<keyof typeof result, 'rocket' | 'add-plus'>>;

    // @ts-expect-error - keys must not widen to string
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type KeysNotString = Assert<IsExact<keyof typeof result, string>>;
  });
});
