// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { displayToIso, isoToDisplay } from '../../../../../lib/components/internal/utils/date-time/display-format';

test('isoToDisplay', () => {
  expect(isoToDisplay('2020-01-01')).toBe('2020/01/01');
});

test('displayToIso', () => {
  expect(displayToIso('2020/01/01')).toBe('2020-01-01');
});
