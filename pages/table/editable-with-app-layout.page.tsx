// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import Input from '~components/input';
import Select from '~components/select';
import Alert from '~components/alert';
import Table, { TableProps } from '~components/table';
import BreadcrumbGroup from '~components/breadcrumb-group';
import { Autosuggest, Link, TimeInput, Box, Button, Modal, SpaceBetween } from '~components';
import { HelpContent } from './editable-utils';
import { initialItems, DistributionInfo, tlsVersions, originSuggestions } from './editable-data';

let __editStateDirty = false;

// Passes for any valid (fq) domain name including punycode
// https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch08s15.html
const DOMAIN_NAME = /^\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b$/i;

export const ariaLabels: TableProps.AriaLabels<DistributionInfo> = {
  tableLabel: 'Distributions',
  activateEditLabel: column => `Edit ${column.header}`,
  cancelEditLabel: column => `Cancel editing ${column.header}`,
  submitEditLabel: column => `Submit edit ${column.header}`,
};

const withSideEffect =
  <T extends (...args: any[]) => void>(sideEffect: () => void) =>
  (fn: T) =>
  (...args: Parameters<T>) => {
    const result = fn(...args);
    sideEffect();
    return result;
  };

const setDirty = () => {
  __editStateDirty = true;
};
const setClean = () => {
  __editStateDirty = false;
};

const withDirtyState = withSideEffect(setDirty);
const withCleanState = withSideEffect(setClean);

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
            onChange={withDirtyState(event => setValue(event.detail.value))}
          />
        );
      }

      return item.DomainName;
    },
  },
  {
    id: 'Status',
    header: 'Status',
    width: 120,
    cell: (item: DistributionInfo) => item.Status,
  },
  {
    id: 'Origin',
    header: 'Origin',
    minWidth: 200,
    editConfig: {
      ariaLabel: 'Origin',
    },
    cell: (item, { isEditing, setValue, currentValue }) => {
      if (isEditing) {
        return (
          <Autosuggest
            autoFocus={true}
            value={currentValue ?? item.Origin}
            onChange={withDirtyState(event => setValue(event.detail.value))}
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
    header: 'TLS Version',
    width: 170,
    editConfig: {
      ariaLabel: 'Certificate Minimum Version',
    },
    cell(item, { isEditing, currentValue, setValue }) {
      if (isEditing) {
        const value = currentValue ?? item.CertificateMinVersion;

        return (
          <Select
            selectedOption={tlsVersions.find(option => option.value === value) ?? null}
            onChange={withDirtyState(event =>
              setValue(event.detail.selectedOption.value ?? item.CertificateMinVersion)
            )}
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
            onChange={withDirtyState(event => setValue(event.detail.value))}
          />
        );
      }

      return new Date(item.LastModifiedTime).toLocaleTimeString();
    },
  },
];

let errorsMeta = new WeakMap<DistributionInfo, string>();

const Demo = forwardRef(
  (
    { setModalVisible }: { setModalVisible: React.Dispatch<React.SetStateAction<boolean>> },
    tableRef: ForwardedRef<TableProps.Ref>
  ) => {
    const [items, setItems] = useState(initialItems);

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
      setClean();
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
        onEditCancel={evt => {
          if (__editStateDirty) {
            evt.preventDefault();
            setModalVisible(true);
          }
          errorsMeta = new WeakMap();
        }}
        columnDefinitions={columns}
        items={items}
        resizableColumns={true}
        ariaLabels={ariaLabels}
      />
    );
  }
);

export default function () {
  const [modalVisible, setModalVisible] = useState(false);
  const tableRef = useRef<TableProps.Ref>(null);

  const onBeforeUnload = (evt: BeforeUnloadEvent) => {
    if (__editStateDirty) {
      evt.preventDefault();
      evt.returnValue = '';
    }
  };

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  });

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
      content={
        <>
          <Demo setModalVisible={setModalVisible} ref={tableRef} />
          <Modal
            visible={modalVisible}
            header="Discard changes"
            closeAriaLabel="Close modal"
            onDismiss={withCleanState(() => setModalVisible(false))}
            footer={
              <Box float="right">
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="link" onClick={withCleanState(() => setModalVisible(false))}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={withCleanState(() => {
                      setModalVisible(false);
                      tableRef.current?.cancelEdit?.();
                    })}
                  >
                    Discard
                  </Button>
                </SpaceBetween>
              </Box>
            }
          >
            <Alert type="warning" statusIconAriaLabel="Warning">
              Are you sure you want to discard any unsaved changes?
            </Alert>
          </Modal>
        </>
      }
    />
  );
}
