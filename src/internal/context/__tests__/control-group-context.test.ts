// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getGroupedControlClassNames } from '../control-group-context';

// Identity-like styles map so the returned CSS-module keys are easy to assert.
const styles = new Proxy<Record<string, string>>({}, { get: (_target, key) => String(key) });

describe('getGroupedControlClassNames', () => {
  test('returns no classes when the control is not in a group', () => {
    expect(getGroupedControlClassNames(styles, null, 'horizontal')).toEqual([]);
    expect(getGroupedControlClassNames(styles, null, 'vertical')).toEqual([]);
  });

  test('returns the base class plus the horizontal position modifier', () => {
    expect(getGroupedControlClassNames(styles, 'first', 'horizontal')).toEqual(['grouped', 'grouped-horizontal-first']);
  });

  test('returns the base class plus the vertical position modifier', () => {
    expect(getGroupedControlClassNames(styles, 'last', 'vertical')).toEqual(['grouped', 'grouped-vertical-last']);
  });

  test('never emits a bare grouped-vertical class', () => {
    for (const position of ['first', 'middle', 'last', 'only'] as const) {
      expect(getGroupedControlClassNames(styles, position, 'vertical')).not.toContain('grouped-vertical');
    }
  });
});
