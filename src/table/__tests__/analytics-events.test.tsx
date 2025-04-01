// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { render } from '@testing-library/react';

import Header from '../../../lib/components/header';
import { ComponentMetrics, setComponentMetrics } from '../../../lib/components/internal/analytics';
import Table from '../../../lib/components/table';

const componentMounted = jest.fn();
const componentUpdated = jest.fn();

setComponentMetrics({ componentMounted, componentUpdated });

describe('Task name', () => {
  test('instanceIdentifier overrides the automatically determined task name', () => {
    render(
      <Table
        analyticsMetadata={{ instanceIdentifier: 'My custom task name override' }}
        items={[]}
        columnDefinitions={[]}
        header={<Header>This is the table header</Header>}
      />
    );

    expect(ComponentMetrics.componentMounted).toHaveBeenCalledTimes(1);
    expect(ComponentMetrics.componentMounted).toHaveBeenCalledWith(
      expect.objectContaining({
        componentConfiguration: expect.objectContaining({ taskName: 'My custom task name override' }),
      })
    );
  });
});
