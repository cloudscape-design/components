// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { supportsKeyboardAccessibility, getStatusButtonId } from '../../../lib/components/code-editor/util';

describe('supportsKeyboardAccessibility', () => {
  it('returns false for old versions of ace', () => {
    expect(supportsKeyboardAccessibility({ version: '1.0.0' })).toBe(false);
  });

  it('returns true for versions of ace with enableKeyboardAccessibility', () => {
    expect(supportsKeyboardAccessibility({ version: '1.23.0' })).toBe(true);
  });

  it('returns false if version is not provided or is invalid', () => {
    expect(supportsKeyboardAccessibility({})).toBe(false);
    expect(supportsKeyboardAccessibility({ version: '1.0.0-alpha.100' })).toBe(false);
    expect(supportsKeyboardAccessibility({ version: 'testing' })).toBe(false);
  });
});

describe('getStatusButtonId', () => {
  it('returns undefined if paneId is undefined', () => {
    expect(getStatusButtonId({ paneStatus: 'error' })).toBeUndefined();
  });

  it('returns generated id if valid paneId is provided', () => {
    expect(getStatusButtonId({ paneId: 'test-panel-id', paneStatus: 'error' })).toBe('test-panel-id-button-error');
  });
});
