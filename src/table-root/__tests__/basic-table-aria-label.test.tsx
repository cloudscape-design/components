// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { findTable, renderResourcesTable } from './table-fixtures';

describe('Table labelling', () => {
  test('ariaLabel passes through to the table aria-label', () => {
    const { wrapper } = renderResourcesTable({ grid: true, ariaLabel: 'Resources' });
    expect(findTable(wrapper).getAttribute('aria-label')).toBe('Resources');
  });

  test('ariaLabelledby passes through to the table aria-labelledby', () => {
    const { wrapper } = renderResourcesTable({ grid: true, ariaLabelledby: 'heading-id' });
    expect(findTable(wrapper).getAttribute('aria-labelledby')).toBe('heading-id');
  });
});
