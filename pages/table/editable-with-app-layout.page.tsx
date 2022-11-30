// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Input from '~components/input';
import Select from '~components/select';
import { Autosuggest, Link, TimeInput } from '~components';
import Table, { TableProps } from '~components/table';
import BreadcrumbGroup from '~components/breadcrumb-group';
import { initialItems, DistributionInfo, tlsVersions, originSuggestions } from './editable-data';
import { HelpContent } from './editable-utils';

export const ariaLabels: TableProps.AriaLabels<DistributionInfo> = {
  tableLabel: 'Distributions',
  activateEditLabel: column => `Edit ${column.header}`,
  cancelEditLabel: column => `Cancel editing ${column.header}`,
  submitEditLabel: column => `Submit edit ${column.header}`,
};

// Passes for any valid (fq) domain name including punycode
// https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch08s15.html
const DOMAIN_NAME = /^\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b$/i;

const columns: TableProps.ColumnDefinition<DistributionInfo, string>[] = [
  {
    id: 'Id',
    header: 'Distribution ID',
    sortingField: 'Id',
    width: 180,
    cell: (item: DistributionInfo) => <Link href={`/#/distributions/${item.Id}`}>{item.Id}</Link>,
  },
  {
    id: 'DomainName',
    header: 'Domain name',
    minWidth: 160,
    editConfig: {
      ariaLabel: 'Domain name',
      errorIconAriaLabel: 'Domain Name Error',
      validation(item, value) {
        const currentValue = value ?? item.DomainName;
        if (!DOMAIN_NAME.test(currentValue)) {
          return 'Must be a valid domain name';
        }
        if (errorsMeta.get(item)) {
          return errorsMeta.get(item);
        }
      },
    },
    cell(item, { isEditing, currentValue, setValue }) {
      if (isEditing) {
        return (
          <Input
            autoFocus={true}
            value={currentValue ?? item.DomainName}
            onChange={event => setValue(event.detail.value)}
          />
        );
      }

      return item.DomainName;
    },
  },
  {
    id: 'Status',
    header: 'Status',
    width: 100,
    cell: (item: DistributionInfo) => item.Status,
  },
  {
    id: 'Origin',
    header: 'Origin',
    editConfig: {
      ariaLabel: 'Origin',
      errorIconAriaLabel: 'Origin Error',
    },
    cell: (item, { isEditing, setValue, currentValue }) => {
      if (isEditing) {
        return (
          <Autosuggest
            autoFocus={true}
            value={currentValue ?? item.Origin}
            onChange={event => setValue(event.detail.value)}
            options={originSuggestions}
            enteredTextLabel={value => `Use "${value}"`}
            ariaLabel="Origin Domain"
            placeholder="Enter an origin domain name"
          />
        );
      }
      return item.Origin;
    },
  },
  {
    id: 'CertificateMinVersion',
    header: 'Certificate Min. Version',
    maxWidth: 280,
    editConfig: {
      ariaLabel: 'Certificate Minimum Version',
      errorIconAriaLabel: 'Certificate Minimum Version Error',
    },
    cell(item, { isEditing, currentValue, setValue }) {
      if (isEditing) {
        const value = currentValue ?? item.CertificateMinVersion;

        return (
          <Select
            selectedOption={tlsVersions.find(option => option.value === value) ?? null}
            onChange={event => setValue(event.detail.selectedOption.value ?? item.CertificateMinVersion)}
            options={tlsVersions}
          />
        );
      }

      return item.CertificateMinVersion;
    },
  },
  {
    id: 'LastModifiedTime',
    header: 'Last Modified',
    editConfig: {
      ariaLabel: 'Last Modified',
    },
    cell: (item, { isEditing, currentValue, setValue }) => {
      if (isEditing) {
        const time = new Date(item.LastModifiedTime);
        const value = `${time.getHours()}:${time.getMinutes()}`;
        return (
          <TimeInput
            autoFocus={true}
            format="hh:mm"
            value={currentValue ?? value}
            onChange={event => {
              setValue(event.detail.value);
            }}
          />
        );
      }

      return item.LastModifiedTime;
    },
  },
];

let errorsMeta = new WeakMap<DistributionInfo, string>();

function Demo() {
  const [items, setItems] = useState(initialItems);
  const tableRef = useRef<TableProps.Ref>(null);

  const handleSubmit: TableProps.SubmitEditFunction<DistributionInfo> = async (
    currentItem,
    column,
    newValue: string
  ) => {
    let value = newValue;
    await new Promise(r => setTimeout(r, 1000));
    errorsMeta.delete(currentItem);
    if (value === 'inline') {
      errorsMeta.set(currentItem, 'Server does not accept this value, try another');
      throw new Error('Inline error');
    }
    if (
      column.id === 'LastModifiedTime' &&
      (new Date(value).toString() === 'Invalid Date' || !isNaN(+new Date(value)))
    ) {
      const time = new Date(currentItem.LastModifiedTime);
      const [hours, minutes] = value.split(':').map(Number);
      time.setHours(hours);
      time.setMinutes(minutes);
      value = time.toISOString();
    }

    const newItem = { ...currentItem, [column.id as keyof DistributionInfo]: value };

    setItems(items => items.map(item => (item === currentItem ? newItem : item)));
  };

  return (
    <Table
      variant="full-page"
      ref={tableRef}
      header={
        <Header variant="awsui-h1-sticky" counter={`(${items.length})`}>
          Distributions
        </Header>
      }
      submitEdit={handleSubmit}
      onEditCancel={() => {
        errorsMeta = new WeakMap();
      }}
      columnDefinitions={columns}
      items={items}
      resizableColumns={true}
      ariaLabels={ariaLabels}
    />
  );
}

export default function () {
  return (
    <AppLayout
      contentType="table"
      navigationHide={true}
      breadcrumbs={
        <BreadcrumbGroup
          items={[
            { text: 'AWS-UI Demos', href: '#' },
            { text: 'Editable table', href: '#' },
          ]}
        />
      }
      ariaLabels={{
        navigation: 'Side navigation',
        navigationToggle: 'Open navigation',
        navigationClose: 'Close navigation',
        notifications: 'Notifications',
        tools: 'Tools',
        toolsToggle: 'Open tools',
        toolsClose: 'Close tools',
      }}
      tools={<HelpContent />}
      content={<Demo />}
    />
  );
}
