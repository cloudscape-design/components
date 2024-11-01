// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { render } from '@testing-library/react';

import Table from '../../../lib/components/table';
import createWrapper from '../../../lib/components/test-utils/dom';
import { mockComponentMetrics } from '../../internal/analytics/__tests__/mocks';

beforeEach(() => {
  jest.resetAllMocks();
  mockComponentMetrics();
});

test('should add data-analytics-task-interaction-id to root of Table component', () => {
  const { container } = render(<Table items={[]} columnDefinitions={[]} />);
  const tableElement = createWrapper(container).findTable()!.getElement();
  expect(tableElement).toHaveAttribute('data-analytics-task-interaction-id');
});
