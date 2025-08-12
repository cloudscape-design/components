// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getComputedAbstractSwitchState } from '../../../../lib/components/internal/utils/style';

describe('abstract switch computed states', () => {
  it('returns disabled', () => {
    expect(getComputedAbstractSwitchState(true, true, false, false)).toBe('disabled');
  });

  it('returns readOnly', () => {
    expect(getComputedAbstractSwitchState(true, false, true, false)).toBe('readOnly');
  });

  it('returns indeterminate', () => {
    expect(getComputedAbstractSwitchState(true, false, false, true)).toBe('indeterminate');
  });

  it('returns checked', () => {
    expect(getComputedAbstractSwitchState(true, false, false, false)).toBe('checked');
  });

  it('returns default', () => {
    expect(getComputedAbstractSwitchState(false, false, false, false)).toBe('default');
  });

  it('returns custom default', () => {
    expect(getComputedAbstractSwitchState(false, false, false, false, 'hello')).toBe('hello');
  });
});
