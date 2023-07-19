// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import AppLayout from '~components/app-layout';
import labels from './utils/labels';
import Table from '~components/table';
import { generateItems, Instance } from '../table/generate-data';
import { columnsConfig } from '../table/shared-configs';
import ExpandableSection from '~components/expandable-section';

const items = generateItems(20);

export default function () {
  return (
    <AppLayout
      ariaLabels={labels}
      contentType="table"
      navigationHide={true}
      content={
        <Table<Instance>
          header={
            <ExpandableSection headerText="Click to expand header area" headingTagOverride="h1">
              <div style={{ height: '300px' }}>Content</div>
            </ExpandableSection>
          }
          stickyHeader={true}
          variant="full-page"
          columnDefinitions={columnsConfig}
          items={items}
        />
      }
    />
  );
}
