// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Flashbar, { FlashbarProps } from '@cloudscape-design/components/flashbar';

import { EC2Instance } from '../../../resources/types';
import { Navigation } from '../../commons';
import { CustomAppLayout } from '../../commons/common-components';
import InstancesTable from './instances-table';

interface InstancesPageProps {
  instances: EC2Instance[];
  selectedItems: EC2Instance[];
  setSelectedItems: (items: EC2Instance[]) => void;
  onDeleteInit: () => void;
  notifications: FlashbarProps.MessageDefinition[];
}
export function InstancesPage({
  instances,
  selectedItems,
  setSelectedItems,
  onDeleteInit,
  notifications,
}: InstancesPageProps) {
  return (
    <CustomAppLayout
      content={
        <InstancesTable
          instances={instances}
          selectedItems={selectedItems}
          onSelectionChange={event => setSelectedItems(event.detail.selectedItems)}
          onDelete={onDeleteInit}
        />
      }
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'Service', href: '#' },
            { text: 'Instances', href: '#' },
          ]}
          expandAriaLabel="Show path"
          ariaLabel="Breadcrumbs"
        />
      }
      notifications={<Flashbar items={notifications} stackItems={true} />}
      navigation={<Navigation activeHref="#" />}
      navigationOpen={false}
      toolsHide={true}
      contentType="table"
    />
  );
}
