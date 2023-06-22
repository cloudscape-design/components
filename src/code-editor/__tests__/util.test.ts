// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { supportsKeyboardAccessibility } from '../../../lib/components/code-editor/util';

describe('supportsKeyboardAccessibility', () => {
  it('returns false for old versions of ace', () => {
    expect(supportsKeyboardAccessibility({ version: '1.0.0' })).toBe(false);
  });

  it('returns true for versions of ace with enableKeyboardAccessibility', () => {
    expect(supportsKeyboardAccessibility({ version: '1.23.0' })).toBe(true);
  });

  it('returns false if version is not provided or is invalid', () => {
    expect(() => supportsKeyboardAccessibility({})).not.toThrow();
    expect(() => supportsKeyboardAccessibility({ version: '1.0.0-alpha.100' })).not.toThrow();
    expect(() => supportsKeyboardAccessibility({ version: 'testing' })).not.toThrow();
  });
});
