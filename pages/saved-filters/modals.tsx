// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { PropertyFilterProps } from '~components/property-filter';
import Button from '~components/button';
import Box from '~components/box';
import FormField from '~components/form-field';
import Modal from '~components/modal';
import SpaceBetween from '~components/space-between';
import Input from '~components/input';
import { queryToString } from './utils';
import { FilterSet } from './use-filter-sets';
import Alert from '~components/alert';

export function SaveFilterSetModal({
  query,
  filteringProperties,
  onCancel,
  onSubmit,
}: {
  query: PropertyFilterProps.Query;
  filteringProperties?: readonly PropertyFilterProps.FilteringProperty[];
  onCancel: () => void;
  onSubmit: (formData: { name: string; description?: string }) => void;
}) {
  const [visible, setVisible] = React.useState(true);
  const [nameValue, setNameValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');

  const onDismiss = () => {
    setVisible(false);
    onCancel();
  };

  const submitModal = () => {
    setVisible(false);
    onSubmit({
      name: nameValue,
      description: descriptionValue,
    });
  };

  return (
    <Modal
      header="Save filter set"
      visible={visible}
      onDismiss={onDismiss}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitModal}>
              Save
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        <Box variant="span">Save this custom filter set to easily reproduce this view again later.</Box>
        <FormField label="Filter set name">
          <Input value={nameValue} onChange={({ detail }) => setNameValue(detail.value)} />
        </FormField>
        <FormField
          label={
            <span>
              Filter set description <i>- optional</i>
            </span>
          }
        >
          <Input value={descriptionValue} onChange={({ detail }) => setDescriptionValue(detail.value)} />
        </FormField>
        <div>
          <Box variant="awsui-key-label">Filter values</Box>
          <div>{queryToString(query, filteringProperties)}</div>
        </div>
      </SpaceBetween>
    </Modal>
  );
}

export function UpdateFilterSetModal({
  filterSet,
  newQuery,
  filteringProperties,
  onCancel,
  onSubmit,
}: {
  filterSet: FilterSet;
  newQuery: PropertyFilterProps.Query;
  filteringProperties?: readonly PropertyFilterProps.FilteringProperty[];
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const [visible, setVisible] = React.useState(true);

  const onDismiss = () => {
    setVisible(false);
    onCancel();
  };

  const submitModal = () => {
    setVisible(false);
    onSubmit();
  };

  return (
    <Modal
      header="Update filter set"
      visible={visible}
      onDismiss={onDismiss}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitModal}>
              Update
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        <Box variant="span">
          Update{' '}
          <Box variant="span" fontWeight="bold">
            {filterSet.name}
          </Box>
          ? You can’t undo this action.
        </Box>
        <Alert type="info" statusIconAriaLabel="Info">
          Proceeding with this action will change the saved filter set with the updated configuration.
        </Alert>
        <div>
          <Box variant="awsui-key-label">Filter set name</Box>
          <div>{filterSet.name}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Filter set description</Box>
          <div>{filterSet.description ?? '-'}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Current filter values</Box>
          <div>{queryToString(filterSet.query, filteringProperties)}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">New filter values</Box>
          <div>{queryToString(newQuery, filteringProperties)}</div>
        </div>
      </SpaceBetween>
    </Modal>
  );
}

export function DeleteFilterSetModal({
  filterSet,
  filteringProperties,
  onCancel,
  onSubmit,
}: {
  filterSet: FilterSet;
  filteringProperties?: readonly PropertyFilterProps.FilteringProperty[];
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const [visible, setVisible] = React.useState(true);

  const onDismiss = () => {
    setVisible(false);
    onCancel();
  };

  const submitModal = () => {
    setVisible(false);
    onSubmit();
  };

  return (
    <Modal
      header="Delete filter set"
      visible={visible}
      onDismiss={onDismiss}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={onDismiss}>
              Cancel
            </Button>
            <Button variant="primary" onClick={submitModal}>
              Delete
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        <Box variant="span">
          Permantently delete{' '}
          <Box variant="span" fontWeight="bold">
            {filterSet.name}
          </Box>
          ? You can’t undo this action.
        </Box>
        <Alert type="info" statusIconAriaLabel="Info">
          Proceeding with this action will delete the saved filter set with the updated configuration.
        </Alert>
        <div>
          <Box variant="awsui-key-label">Filter set name</Box>
          <div>{filterSet.name}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Filter set description</Box>
          <div>{filterSet.description ?? '-'}</div>
        </div>
        <div>
          <Box variant="awsui-key-label">Filter values</Box>
          <div>{queryToString(filterSet.query, filteringProperties)}</div>
        </div>
      </SpaceBetween>
    </Modal>
  );
}
