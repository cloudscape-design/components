// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { circleIndex } from '../../../../lib/components/area-chart/model/utils';

it('returns same index if in range', () => {
  expect(circleIndex(1, [1, 5])).toBe(1);
  expect(circleIndex(5, [1, 5])).toBe(5);
});

it('returns opposite boundary if not in range', () => {
  expect(circleIndex(0, [1, 5])).toBe(5);
  expect(circleIndex(6, [1, 5])).toBe(1);
});
