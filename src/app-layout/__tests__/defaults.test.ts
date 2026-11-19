// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { applyDefaults } from '../../../lib/components/app-layout/defaults';

test('returns defaults for content type', () => {
  expect(applyDefaults('default', {}, false)).toEqual({
    minContentWidth: 280,
    navigationOpen: true,
  });
  expect(applyDefaults('form', {}, false)).toEqual({
    minContentWidth: 280,
    maxContentWidth: 800,
    navigationOpen: false,
  });
});

test('returns visual refresh defaults for content types', () => {
  expect(applyDefaults('form', {}, true)).toEqual({
    navigationOpen: false,
    minContentWidth: 280,
    maxContentWidth: undefined,
  });
  expect(applyDefaults('wizard', {}, true)).toEqual({
    navigationOpen: false,
    minContentWidth: 280,
    maxContentWidth: undefined,
  });
});

test('allows values override', () => {
  expect(applyDefaults('form', { navigationOpen: true }, false)).toEqual({
    minContentWidth: 280,
    maxContentWidth: 800,
    navigationOpen: true,
  });
  expect(applyDefaults('form', { minContentWidth: 600 }, false)).toEqual({
    minContentWidth: 600,
    maxContentWidth: 800,
    navigationOpen: false,
  });
});
