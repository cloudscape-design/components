// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { getSortedOptions } from '../utils';

describe('getSortedOptions', () => {
  it('returns the passed-in options with the desired order and visibility', () => {
    const options = [
      {
        id: 'a',
        label: 'a',
      },
      { id: 'b', label: 'b' },
    ];
    const contentDisplay = [
      { id: 'b', visible: false },
      { id: 'a', visible: true },
    ];
    const result = getSortedOptions({ options, contentDisplay });
    expect(result).toEqual([
      { id: 'b', label: 'b', visible: false },
      {
        id: 'a',
        label: 'a',
        visible: true,
      },
    ]);
  });

  it('keeps the value of the alwaysVisible property', () => {
    const options = [
      {
        id: 'a',
        label: 'a',
        alwaysVisible: true,
      },
      { id: 'b', label: 'b' },
    ];
    const contentDisplay = [
      { id: 'b', visible: false },
      { id: 'a', visible: true },
    ];
    const result = getSortedOptions({ options, contentDisplay });
    expect(result).toEqual([
      { id: 'b', label: 'b', visible: false },
      {
        id: 'a',
        label: 'a',
        alwaysVisible: true,
        visible: true,
      },
    ]);
  });
});
