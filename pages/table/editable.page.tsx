// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { ForwardedRef, forwardRef, useContext, useEffect, useRef, useState } from 'react';

import { useCollection } from '@cloudscape-design/collection-hooks';

import { Box, Button, Checkbox, Modal, SpaceBetween } from '~components';
import Alert from '~components/alert';
import Autosuggest, { AutosuggestProps } from '~components/autosuggest';
import Header from '~components/header';
import Input from '~components/input';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import Select, { SelectProps } from '~components/select';
import Table, { TableProps } from '~components/table';
import TimeInput, { TimeInputProps } from '~components/time-input';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { DistributionInfo, initialItems, originSuggestions, tagOptions, tlsVersions } from './editable-data';

type PageContext = React.Context<
  AppContextType<{
    resizableColumns: boolean;
    enableKeyboardNavigation: boolean;
    expandableRows: boolean;
    renderInModal: boolean;
  }>
>;

let __editStateDirty = false;

// Passes for any valid (fq) domain name including punycode
// https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch08s15.html
const DOMAIN_NAME = /^\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b$/i;

export const ariaLabels: TableProps.AriaLabels<DistributionInfo> = {
  tableLabel: 'Distributions',
  activateEditLabel: (column, item) => `Edit ${item.Id} ${column.header}`,
  cancelEditLabel: column => `Cancel editing ${column.header}`,
  submitEditLabel: column => `Submit edit ${column.header}`,
  submittingEditText: () => 'Loading edit response',
  successfulEditLabel: () => 'Edit successful',
};

const withSideEffect =
  (sideEffect: () => void) =>
  <T extends (...args: any[]) => void>(fn: T) =>
  (...args: Parameters<T>) => {
    sideEffect();
    return fn(...args);
  };

const setDirty = () => {
  __editStateDirty = true;
};
const setClean = () => {
  __editStateDirty = false;
};

const withDirtyState = withSideEffect(setDirty);
const withCleanState = withSideEffect(setClean);

const columns: TableProps.ColumnDefinition<DistributionInfo>[] = [
  {
    id: 'Id',
    header: 'Distribution ID',
    sortingField: 'Id',
    width: 180,
    cell: (item: DistributionInfo) => item.Id,
    editConfig: {
      ariaLabel: 'Distribution ID',
      editIconAriaLabel: 'editable',
      errorIconAriaLabel: 'Distribution ID Error',
      editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
        return (
          <Input
            autoFocus={true}
            value={currentValue ?? item.Id}
            onChange={withDirtyState(event => setValue(event.detail.value))}
          />
        );
      },
      disabledReason(item) {
        if (item.Id.includes('E2')) {
          return "You don't have the necessary permissions to edit this item.";
        }
        return undefined;
      },
    },
  },
  {
    id: 'DomainName',
    header: 'Domain name',
    sortingField: 'DomainName',
    minWidth: 180,
    editConfig: {
      ariaLabel: 'Domain name',
      editIconAriaLabel: 'editable',
      errorIconAriaLabel: 'Domain Name Error',
      validation(item, value: string) {
        const currentValue = value ?? item.DomainName;
        if (!DOMAIN_NAME.test(currentValue)) {
          return 'Must be a valid domain name';
        }
        if (errorsMeta.get(item)) {
          return errorsMeta.get(item);
        }
      },
      editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
        return (
          <Input
            autoFocus={true}
            value={currentValue ?? item.DomainName}
            onChange={withDirtyState(event => setValue(event.detail.value))}
          />
        );
      },
    },
    cell: item => item.DomainName,
  },
  {
    id: 'Status',
    header: 'Status',
    minWidth: 176,
    cell: (item: DistributionInfo) => item.Status,
  },
  {
    id: 'Origin',
    header: 'Origin',
    minWidth: 200,
    editConfig: {
      ariaLabel: 'Origin',
      editIconAriaLabel: 'editable',
      editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
        return (
          <Autosuggest
            autoFocus={true}
            value={currentValue ?? item.Origin}
            onChange={withDirtyState<NonNullable<AutosuggestProps['onChange']>>(event => setValue(event.detail.value))}
            options={originSuggestions}
            enteredTextLabel={value => `Use Custom Origin "${value}"`}
            expandToViewport={true}
            ariaLabel="Origin Domain"
            placeholder="Enter an origin domain name"
          />
        );
      },
      disabledReason(item) {
        if (item.Origin.includes('browserstack')) {
          return "You don't have the necessary permissions to change a BrowserStack origin.";
        }
        return undefined;
      },
    },
    cell: item => item.Origin,
  },
  {
    id: 'CertificateMinVersion',
    header: 'TLS Version',
    minWidth: 176,
    editConfig: {
      ariaLabel: 'Certificate Minimum Version',
      editIconAriaLabel: 'editable',
      editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
        const value = currentValue ?? item.CertificateMinVersion;

        return (
          <Select
            autoFocus={true}
            selectedOption={tlsVersions.find(option => option.value === value) ?? null}
            onChange={withDirtyState<NonNullable<SelectProps['onChange']>>(event => {
              setValue(event.detail.selectedOption.value ?? item.CertificateMinVersion);
            })}
            options={tlsVersions}
          />
        );
      },
    },
    cell: item => item.CertificateMinVersion,
  },
  {
    id: 'LastModifiedTime',
    header: 'Last Modified',
    editConfig: {
      ariaLabel: 'Last Modified',
      editIconAriaLabel: 'editable',
      editingCell(item, { currentValue, setValue }: TableProps.CellContext<string>) {
        const time = new Date(item.LastModifiedTime);
        const value = [time.getHours(), time.getMinutes()].map(part => part.toString().padStart(2, '0')).join(':');
        return (
          <TimeInput
            autoFocus={true}
            format="hh:mm"
            value={currentValue ?? value}
            onChange={withDirtyState<NonNullable<TimeInputProps['onChange']>>(event => {
              setValue(event.detail.value);
            })}
          />
        );
      },
    },
    cell: item => {
      const time = new Date(item.LastModifiedTime);
      const value = [time.getHours(), time.getMinutes()].map(part => part.toString().padStart(2, '0')).join(':');
      return value;
    },
  },
  {
    id: 'Tags',
    header: 'Tags',
    minWidth: 200,
    editConfig: {
      ariaLabel: 'Tags',
      editIconAriaLabel: 'editable',
      editingCell(item, { currentValue, setValue }: TableProps.CellContext<MultiselectProps.Options>) {
        const value = currentValue ?? (item.Tags as MultiselectProps.Options);
        return (
          <Box padding={{ vertical: 'xxs' }}>
            <Multiselect
              autoFocus={true}
              selectedOptions={value}
              onChange={withDirtyState<NonNullable<MultiselectProps['onChange']>>(event => {
                setValue(event.detail.selectedOptions);
              })}
              options={tagOptions}
              placeholder="Choose options"
              selectedAriaLabel="Selected"
              deselectAriaLabel={e => `Remove ${e.label}`}
              expandToViewport={true}
            />
          </Box>
        );
      },
    },
    cell(item) {
      return item.Tags.map(tag => tag.label).join(', ');
    },
  },
];

let errorsMeta = new WeakMap<DistributionInfo, string>();

const Demo = forwardRef(
  (
    { setModalVisible }: { setModalVisible: React.Dispatch<React.SetStateAction<boolean>> },
    tableRef: ForwardedRef<TableProps.Ref>
  ) => {
    const [allItems, setItems] = useState(initialItems);
    const {
      urlParams: { resizableColumns = true, enableKeyboardNavigation = false, expandableRows = false },
    } = useContext(AppContext as PageContext);

    const { items, collectionProps } = useCollection(allItems, { sorting: {} });

    const handleSubmit: TableProps.SubmitEditFunction<DistributionInfo> = async (currentItem, column, newValue) => {
      let value = newValue;
      await new Promise(r => setTimeout(r, 1000));
      errorsMeta.delete(currentItem);
      if (typeof value === 'string' && value.includes('inline')) {
        errorsMeta.set(currentItem, 'Server does not accept this value, try another');
        throw new Error('Inline error');
      }
      if (
        column.id === 'LastModifiedTime' &&
        typeof value === 'string' &&
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

    const [expandedItems, setExpandedItems] = useState<DistributionInfo[]>([]);

    return (
      <Table
        {...collectionProps}
        trackBy="Id"
        ref={tableRef}
        header={
          <Header headingTagOverride="h1" counter={`(${items.length})`}>
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
        ariaLabels={ariaLabels}
        stickyHeader={true}
        resizableColumns={resizableColumns}
        enableKeyboardNavigation={enableKeyboardNavigation}
        expandableRows={
          expandableRows
            ? {
                getItemChildren: item => [
                  { ...item, Id: item.Id + '-1' },
                  { ...item, Id: item.Id + '-2' },
                ],
                isItemExpandable: item => !item.Id.endsWith('-1') && !item.Id.endsWith('-2'),
                expandedItems,
                onExpandableItemToggle: ({ detail }) => {
                  if (detail.expanded) {
                    return setExpandedItems(prev => [...prev, detail.item]);
                  } else {
                    return setExpandedItems(prev => prev.filter(item => item !== detail.item));
                  }
                },
              }
            : undefined
        }
      />
    );
  }
);

export default function () {
  const {
    urlParams: {
      resizableColumns = true,
      enableKeyboardNavigation = false,
      expandableRows = false,
      renderInModal = false,
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);
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
    <Box margin="s">
      <SpaceBetween size="s">
        <SpaceBetween size="s" direction="horizontal">
          <Checkbox
            checked={resizableColumns}
            onChange={event => {
              setUrlParams({ resizableColumns: event.detail.checked });
              window.location.reload();
            }}
          >
            Resizable columns
          </Checkbox>

          <Checkbox
            checked={enableKeyboardNavigation}
            onChange={event => {
              setUrlParams({ enableKeyboardNavigation: event.detail.checked });
              window.location.reload();
            }}
          >
            Keyboard navigation
          </Checkbox>

          <Checkbox checked={expandableRows} onChange={event => setUrlParams({ expandableRows: event.detail.checked })}>
            Expandable rows
          </Checkbox>

          <Checkbox checked={renderInModal} onChange={event => setUrlParams({ renderInModal: event.detail.checked })}>
            Render in Modal
          </Checkbox>
        </SpaceBetween>

        <input data-testid="focus" aria-label="focus input" />
      </SpaceBetween>

      <ScreenshotArea disableAnimations={true}>
        {renderInModal ? (
          <Modal visible={true} onDismiss={() => setUrlParams({ renderInModal: false })}>
            <Demo setModalVisible={setModalVisible} ref={tableRef} />
          </Modal>
        ) : (
          <Demo setModalVisible={setModalVisible} ref={tableRef} />
        )}
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
      </ScreenshotArea>
    </Box>
  );
}
