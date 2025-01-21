// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { gridDefaults } from '../grid-defaults';

describe('grid-defaults', () => {
  describe.each(Object.entries(gridDefaults))('Has right number of entries for %i items', (attributes, layouts) => {
    test.each(layouts)('breakpoint: $breakpoint', layout => {
      const totalItems = layout.rows.reduce((acc, row) => acc + row.length, 0);
      expect(totalItems).toEqual(parseInt(attributes, 10));
    });
  });
});
