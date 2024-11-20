// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Header, Link, Table } from '~components';
import { setComponentMetrics } from '~components/internal/analytics';

const componentMetricsLog: any[] = [];
(window as any).__awsuiComponentlMetrics__ = componentMetricsLog;

setComponentMetrics({
  componentMounted: props => {
    componentMetricsLog.push(props);
    return props.taskInteractionId || 'mocked-task-interaction-id';
  },
  componentUpdated: props => {
    componentMetricsLog.push(props);
  },
});

export default function () {
  return (
    <>
      <h1>Table analytics</h1>
      <Table
        items={[]}
        columnDefinitions={[]}
        header={
          <Header info={<Link variant="info">Info</Link>} counter="(10)">
            Table title
          </Header>
        }
      />
    </>
  );
}
