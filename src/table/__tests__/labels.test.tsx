// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import createWrapper from '../../../lib/components/test-utils/dom';
import Table, { TableProps } from '../../../lib/components/table';
import { render } from '@testing-library/react';
import { useContainerQuery } from '../../../lib/components/internal/hooks/container-queries';

jest.mock('../../../lib/components/internal/hooks/container-queries', () => ({
  useContainerQuery: jest.fn().mockReturnValue([800, { current: null }]),
}));

function renderTableWrapper(props?: Partial<TableProps>) {
  const { container } = render(<Table items={[]} columnDefinitions={[]} {...props} />);
  return createWrapper(container).findTable()!;
}

function mockSmallWrapper() {
  // This is very brittle, bc we do not pass any identifying parameters to
  // userContainerQuery. It relies on the call order inside the table.
  (useContainerQuery as jest.MockedFn<typeof useContainerQuery>).mockReturnValueOnce([400, { current: null }]);
}

const tableLabel = 'Items';

afterAll(() => {
  jest.restoreAllMocks();
});

test('not to have aria-label if omitted', () => {
  const wrapper = renderTableWrapper();
  expect(wrapper.find('[role=table]')!.getElement()).not.toHaveAttribute('aria-label');
});

test('sets aria-label on table', () => {
  const wrapper = renderTableWrapper({
    ariaLabels: { itemSelectionLabel: () => '', selectionGroupLabel: '', tableLabel },
  });
  expect(wrapper.find('[role=table]')!.getElement().getAttribute('aria-label')).toEqual(tableLabel);
});

test('sets role=region and aria-label on scrollable wrapper when overflowing', () => {
  mockSmallWrapper();
  const wrapper = renderTableWrapper({
    ariaLabels: { itemSelectionLabel: () => '', selectionGroupLabel: '', tableLabel },
  });

  expect(wrapper.find('[role=region]')!.getElement().getAttribute('aria-label')).toEqual(tableLabel);
});
