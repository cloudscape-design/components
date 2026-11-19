// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getVisualTheme } from '../../../../lib/components/internal/utils/get-visual-theme';

describe('getVisualTheme', () => {
  it('returns vr when theme is polaris and VR is active', () => {
    expect(getVisualTheme('polaris', true)).toBe('vr');
  });

  it('returns polaris when theme is polaris and VR is not active', () => {
    expect(getVisualTheme('polaris', false)).toBe('polaris');
  });

  it('returns defined theme by default', () => {
    expect(getVisualTheme('custom', false)).toBe('custom');
    expect(getVisualTheme('custom', true)).toBe('custom');
  });
});
