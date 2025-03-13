// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { renderMultiselect } from './common';

describe('Multiselect with "Select all"', () => {
  test('closes the dropdown after clicking when `keepOpen` is false', () => {
    const { wrapper } = renderMultiselect({ enableSelectAll: true, keepOpen: false });
    wrapper.openDropdown();
    const dropdown = wrapper.findDropdown();
    expect(dropdown.findOptionByValue('1')).not.toBeNull();
    dropdown.findSelectAll()!.click();
    expect(dropdown.findOptionByValue('1')).toBeNull();
  });
});
