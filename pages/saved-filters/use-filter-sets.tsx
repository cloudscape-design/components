// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import { PropertyFilterProps } from '~components/property-filter';
import { ButtonDropdownProps } from '~components/button-dropdown';
import { SelectProps } from '~components/select';
import { isQueryEqual } from './utils';
import { DeleteFilterSetModal, SaveFilterSetModal, UpdateFilterSetModal } from './modals';

export interface FilterSet {
  name: string;
  description?: string;
  query: PropertyFilterProps.Query;
}

export interface UseFilterSetsProps {
  filterSets?: FilterSet[];
  query: PropertyFilterProps.Query;
  updateFilters: (query: PropertyFilterProps.Query) => void;
  updateSavedFilterSets: (newFilterSets: FilterSet[]) => void;
}

export interface UseFilterSetsResult {
  currentFilterSet: FilterSet | null;
  selectProps: Partial<SelectProps> & Pick<SelectProps, 'selectedOption'>;
  buttonDropdownProps: Partial<ButtonDropdownProps> & Pick<ButtonDropdownProps, 'items'>;
  actionModal: React.ReactNode;
}

type FilterAction = 'update' | 'new' | 'delete';

export function useFilterSets({
  filterSets = [],
  query,
  updateFilters,
  updateSavedFilterSets,
}: UseFilterSetsProps): UseFilterSetsResult {
  const [currentFilterSet, setCurrentFilterSet] = useState<FilterSet | null>(null);
  const [filterSetAction, setFilterSetAction] = useState<FilterAction | null>(null);

  const hasUnsavedChanges = currentFilterSet && !isQueryEqual(query, currentFilterSet.query);

  const filterSetOptions: Array<SelectProps.Option> = filterSets.map(filterSet => ({ value: filterSet.name }));
  let selectedFilterSet = filterSetOptions.find(({ value }) => value === currentFilterSet?.name) ?? null;

  if (hasUnsavedChanges) {
    // TODO: special unsaved value?
    filterSetOptions.unshift({ value: '$UNSAVED$', label: `${currentFilterSet.name} (unsaved)` });

    selectedFilterSet = filterSetOptions[0];

    console.log('Unsaved changes detected! Switching to unsaved option');
  }

  const selectProps: UseFilterSetsResult['selectProps'] = {
    placeholder: 'Choose saved filters',
    options: filterSetOptions,
    selectedOption: selectedFilterSet,
    onChange: ({ detail }) => {
      const newFilterSet = filterSets.find(({ name }) => name === detail.selectedOption.value) ?? null;
      setCurrentFilterSet(newFilterSet);
      if (newFilterSet) {
        updateFilters(newFilterSet.query);
      }
    },
  };

  const buttonDropdownProps: UseFilterSetsResult['buttonDropdownProps'] = {
    mainAction: {
      text: 'Clear filters',
      onClick: () => {
        updateFilters({ operation: 'and', tokens: [] });
        setCurrentFilterSet(null);
      },
    },
    items: [
      { id: 'new', text: 'Save as new filter set' },
      { id: 'update', text: 'Update current filter set', disabled: !hasUnsavedChanges },
      { id: 'delete', text: 'Delete current filter set', disabled: !currentFilterSet },
    ],
    onItemClick: ({ detail }) => {
      switch (detail.id) {
        case 'new':
        case 'delete':
        case 'update':
          setFilterSetAction(detail.id);
          break;
      }
    },
  };

  let actionModal = null;
  if (filterSetAction === 'update' && hasUnsavedChanges) {
    actionModal = (
      <UpdateFilterSetModal
        filterSet={currentFilterSet}
        newQuery={query}
        onCancel={() => {
          setFilterSetAction(null);
        }}
        onSubmit={() => {
          if (!hasUnsavedChanges) {
            return;
          }

          currentFilterSet.query = query;
          updateSavedFilterSets([...filterSets]);
        }}
      />
    );
  } else if (filterSetAction === 'delete' && currentFilterSet) {
    actionModal = (
      <DeleteFilterSetModal
        filterSet={currentFilterSet}
        onCancel={() => {
          setFilterSetAction(null);
        }}
        onSubmit={() => {
          // Remove the filter set from the list
          const filterIndex = filterSets.indexOf(currentFilterSet);
          filterSets.splice(filterIndex, 1);
          updateSavedFilterSets([...filterSets]);
        }}
      />
    );
  } else if (filterSetAction === 'new') {
    actionModal = (
      <SaveFilterSetModal
        query={query}
        onCancel={() => {
          setFilterSetAction(null);
        }}
        onSubmit={({ name, description }) => {
          // Create new filter set
          const newFilterSet: FilterSet = {
            name,
            description,
            query,
          };

          // Add to the list of filter sets
          const newFilterSets = [...filterSets, newFilterSet];
          updateSavedFilterSets(newFilterSets);

          // Make this the new current filter set
          setCurrentFilterSet(newFilterSet);
        }}
      />
    );
  }

  return { currentFilterSet, selectProps, buttonDropdownProps, actionModal };
}
