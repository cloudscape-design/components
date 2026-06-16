// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef, useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Checkbox from '@cloudscape-design/components/checkbox';
import FormField from '@cloudscape-design/components/form-field';
import Input, { InputProps } from '@cloudscape-design/components/input';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Modal from '@cloudscape-design/components/modal';
import { PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { isTokenGroup } from '../../common/property-filter-type-guards';
import { FilterSet } from './use-filter-sets';

function queryToString(
  query: PropertyFilterProps.Query,
  filteringProperties?: readonly PropertyFilterProps.FilteringProperty[]
): string {
  function tokenToString({ operator, value, propertyKey }: PropertyFilterProps.Token): string {
    if (propertyKey) {
      const property = filteringProperties?.find(({ key }) => key === propertyKey);
      const keyLabel = property?.propertyLabel ?? propertyKey;

      let valueLabel = value;

      // See if there is a custom value formatter defined for this property and operator
      if (property && property.operators) {
        property.operators.forEach(propertyOperator => {
          if (
            typeof propertyOperator !== 'string' &&
            propertyOperator.operator === operator &&
            propertyOperator.format
          ) {
            valueLabel = propertyOperator.format(value);
          }
        });
      }
      return `${keyLabel} ${operator} ${valueLabel}`;
    }
    return operator === ':' ? value : `${operator} ${value}`;
  }

  function tokenOrGroupToString(tokenOrGroup: PropertyFilterProps.TokenGroup | PropertyFilterProps.Token): string {
    if (isTokenGroup(tokenOrGroup)) {
      return '(' + tokenOrGroup.tokens.map(tokenOrGroupToString).join(`, ${tokenOrGroup.operation} `) + ')';
    } else {
      return tokenToString(tokenOrGroup);
    }
  }

  return (query.tokenGroups || query.tokens).map(tokenOrGroupToString).join(`, ${query.operation} `);
}

export function SaveFilterSetModal({
  query,
  filteringProperties,
  onCancel,
  onSubmit,
}: {
  query: PropertyFilterProps.Query;
  filteringProperties?: readonly PropertyFilterProps.FilteringProperty[];
  onCancel: () => void;
  onSubmit: (formData: { name: string; description?: string; isDefault?: boolean }) => void;
}) {
  const [visible, setVisible] = useState(true);
  const [nameValue, setNameValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [isDefaultFilterSet, setIsDefaultFilterSet] = useState(false);
  const [nameError, setNameError] = useState<string>();
  const nameInputRef = useRef<InputProps.Ref>(null);

  const onDismiss = () => {
    setVisible(false);
    onCancel();
  };

  const submitModal = () => {
    // Validate the input
    if (!nameValue) {
      setNameError('You must specify a name.');
      nameInputRef.current?.focus();
      return;
    }

    setVisible(false);
    onSubmit({
      name: nameValue,
      description: descriptionValue,
      isDefault: isDefaultFilterSet,
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
            <Button variant="primary" data-testid="submit" onClick={submitModal}>
              Save
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="m">
        <Box variant="span">Save this custom filter set to easily reproduce this view again later.</Box>
        <FormField label="Filter set name" errorText={nameError}>
          <Input
            ref={nameInputRef}
            value={nameValue}
            onChange={({ detail }) => {
              setNameValue(detail.value);

              // Reset error state after typing
              setNameError(undefined);
            }}
            onBlur={() => {
              if (!nameValue) {
                setNameError('You must specify a name.');
              }
            }}
          />
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
        <FormField label={<span>Default filter set</span>}>
          <Checkbox checked={isDefaultFilterSet} onChange={({ detail }) => setIsDefaultFilterSet(detail.checked)}>
            Set as default
          </Checkbox>
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
  const [visible, setVisible] = useState(true);

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
            <Button variant="primary" data-testid="submit" onClick={submitModal}>
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
        <KeyValuePairs
          items={[
            {
              label: 'Filter set name',
              value: filterSet.name,
            },
            {
              label: 'Filter set description',
              value: filterSet.description ?? '-',
            },
            {
              label: 'Current filter values',
              value: queryToString(filterSet.query, filteringProperties),
            },
            {
              label: 'New filter values',
              value: queryToString(newQuery, filteringProperties),
            },
            {
              label: 'Default filter set',
              value: filterSet.default ? 'Yes' : 'No',
            },
          ]}
        />
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
  const [visible, setVisible] = useState(true);

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
            <Button variant="primary" data-testid="submit" onClick={submitModal}>
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
        <KeyValuePairs
          items={[
            {
              label: 'Filter set name',
              value: filterSet.name,
            },
            {
              label: 'Filter set description',
              value: filterSet.description ?? '-',
            },
            {
              label: 'Filter values',
              value: queryToString(filterSet.query, filteringProperties),
            },
            {
              label: 'Default filter set',
              value: filterSet.default ? 'Yes' : 'No',
            },
          ]}
        />
      </SpaceBetween>
    </Modal>
  );
}
