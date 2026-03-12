// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { defineIcons } from '../../../lib/components/icon-provider';

describe('defineIcons', () => {
  it('returns the same object reference', () => {
    const icons = { 'add-plus': 'override' as any, rocket: 'custom' as any };
    const result = defineIcons(icons);
    expect(result).toBe(icons);
  });

  it('accepts built-in icon names', () => {
    const icons = defineIcons({ 'add-plus': 'test' as any, close: 'test' as any });
    expect(icons).toHaveProperty('add-plus');
    expect(icons).toHaveProperty('close');
  });

  it('accepts arbitrary string keys', () => {
    const icons = defineIcons({ rocket: 'test' as any, zap: 'test' as any });
    expect(icons).toHaveProperty('rocket');
    expect(icons).toHaveProperty('zap');
  });

  it('accepts a mix of built-in and custom keys', () => {
    const icons = defineIcons({
      'add-plus': 'built-in' as any,
      rocket: 'custom' as any,
    });
    expect(Object.keys(icons)).toEqual(['add-plus', 'rocket']);
  });
});
