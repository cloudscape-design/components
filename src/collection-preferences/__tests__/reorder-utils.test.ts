// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getSortedOptions } from '../reorder-utils';

describe('getSortedOptions', () => {
  it('returns the passed-in options sorted according to the desired order', () => {
    const options = [
      {
        id: 'a',
        label: 'a',
      },
      { id: 'b', label: 'b' },
    ];
    const order = ['b', 'a'];
    const result = getSortedOptions({ options, order });
    expect(result).toEqual([
      { id: 'b', label: 'b' },
      {
        id: 'a',
        label: 'a',
      },
    ]);
  });
});
