// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { mergeLocales } from '../../../../../lib/components/internal/utils/locale';

test('should return the first locale if it is fully specified', () => {
  expect(mergeLocales('en-US', 'fr-CA')).toEqual('en-US');
});

test('should return the second locale if it extends the first', () => {
  expect(mergeLocales('en', 'en-US')).toEqual('en-US');
});

test('should return the first locale if the second is different', () => {
  expect(mergeLocales('en', 'fr-CA')).toEqual('en');
});
