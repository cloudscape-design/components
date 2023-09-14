// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';
import { PropertyFilterProps } from '~components/property-filter';
import { ButtonDropdownProps } from '~components/button-dropdown';
import { SelectProps } from '~components/select';
import { isQueryEqual } from './utils';
import { DeleteFilterSetModal, SaveFilterSetModal, UpdateFilterSetModal } from './modals';
import { FlashbarProps } from '~components/flashbar';

export interface FilterSet {
  name: string;
  description?: string;
  query: PropertyFilterProps.Query;
  unsaved?: boolean;
}

export interface UseFilterSetsProps {
  filterSets?: FilterSet[];
  query: PropertyFilterProps.Query;
  filteringProperties?: readonly PropertyFilterProps.FilteringProperty[];
  updateFilters: (query: PropertyFilterProps.Query) => void;
  updateSavedFilterSets: (newFilterSets: FilterSet[]) => void;
  showNotification?: (notification: FlashbarProps.MessageDefinition) => void;
  saveAsURL?: (query: PropertyFilterProps.Query) => void;
}

export interface UseFilterSetsResult {
  currentFilterSet: FilterSet | null;
  selectProps: Partial<SelectProps> & Pick<SelectProps, 'selectedOption'>;
  buttonDropdownProps: Partial<ButtonDropdownProps> & Pick<ButtonDropdownProps, 'items'>;
  actionModal: React.ReactNode;
}

type FilterAction = 'update' | 'new' | 'delete';

const UNSAVED_OPTION_VALUE = '__unsaved__';

export function useFilterSets({
  filterSets = [],
  query,
  filteringProperties,
  updateFilters,
  updateSavedFilterSets,
  showNotification,
  saveAsURL,
}: UseFilterSetsProps): UseFilterSetsResult {
  // Represents the last selected *saved* filter set
  const [currentFilterSet, setCurrentFilterSet] = useState<FilterSet | null>(null);
  // Determines if there is currently a modal displayed for a filter set action
  const [filterSetAction, setFilterSetAction] = useState<FilterAction | null>(null);
  // Determines if there are unsaved changes in the filter set
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  // Value of the currently selected filter set option
  const [selectedFilterSetValue, setSelectedFilterSetValue] = useState<string | null>(null);

  const unsavedFilterSetOption = {
    value: UNSAVED_OPTION_VALUE,
    label: currentFilterSet ? `${currentFilterSet.name} (unsaved)` : undefined,
  };

  const filterSetOptions: Array<SelectProps.Option> = filterSets.map(filterSet => ({
    value: filterSet.name,
    description: filterSet.description,
  }));

  // Only show the "(unsaved)" option if there are unsaved changes from a previous filter set
  const showUnsavedFilterOption = hasUnsavedChanges && currentFilterSet;

  // Add the dynamic "(unsaved)" option when there are unsaved changes
  if (showUnsavedFilterOption) {
    filterSetOptions.unshift(unsavedFilterSetOption);
  }
  const selectedFilterSetOption = showUnsavedFilterOption
    ? unsavedFilterSetOption
    : filterSetOptions.find(({ value }) => value === selectedFilterSetValue) ?? null;

  useEffect(() => {
    const hasFilters = query.tokens.length > 0;

    // Reset everything if there are no filters
    if (query.tokens.length === 0) {
      setHasUnsavedChanges(false);
      setCurrentFilterSet(null);
      setSelectedFilterSetValue(null);
    } else if (!hasUnsavedChanges && hasFilters) {
      // Enter "unsaved changes mode" when the filter query changes for the first time
      if (!currentFilterSet || !isQueryEqual(query, currentFilterSet.query)) {
        setHasUnsavedChanges(true);
      }
    }
  }, [currentFilterSet, hasUnsavedChanges, query]);

  const selectProps: UseFilterSetsResult['selectProps'] = {
    placeholder: 'Choose saved filter',
    options: filterSetOptions,
    selectedOption: selectedFilterSetOption,
    onChange: ({ detail }) => {
      if (!detail.selectedOption || detail.selectedOption === unsavedFilterSetOption) {
        return;
      }

      const newFilterSet = filterSets.find(({ name }) => name === detail.selectedOption.value) ?? null;
      setCurrentFilterSet(newFilterSet);
      if (newFilterSet) {
        // Apply filters of the selected filter set
        updateFilters(newFilterSet.query);
      }
      setSelectedFilterSetValue(detail.selectedOption.value ?? null);
      setHasUnsavedChanges(false);
    },
  };

  const buttonDropdownProps: UseFilterSetsResult['buttonDropdownProps'] = {
    mainAction: {
      text: 'Clear filters',
      onClick: () => {
        updateFilters({ operation: 'and', tokens: [] });
        setCurrentFilterSet(null);
        setHasUnsavedChanges(false);
        setSelectedFilterSetValue(null);
      },
    },
    items: [
      { id: 'new', text: 'Save as new filter set' },
      { id: 'update', text: 'Update current filter set', disabled: !hasUnsavedChanges || !currentFilterSet },
      { id: 'delete', text: 'Delete current filter set', disabled: hasUnsavedChanges || !currentFilterSet },
      ...(saveAsURL ? [{ id: 'url', text: 'Copy filters as URL' }] : []),
    ],
    onItemClick: ({ detail: { id } }) => setFilterSetAction(id as FilterAction),
  };

  let actionModal = null;
  if (filterSetAction === 'update' && currentFilterSet && hasUnsavedChanges) {
    actionModal = (
      <UpdateFilterSetModal
        filterSet={currentFilterSet}
        filteringProperties={filteringProperties}
        newQuery={query}
        onCancel={() => {
          setFilterSetAction(null);
        }}
        onSubmit={() => {
          setFilterSetAction(null);
          if (!hasUnsavedChanges) {
            return;
          }

          // Emit flashbar notification
          showNotification?.({
            content: `Successfully updated "${currentFilterSet.name}"`,
            type: 'success',
            statusIconAriaLabel: 'Success',
            dismissible: true,
            dismissLabel: 'Dismiss message',
            id: `saved-filter-updated-${currentFilterSet.name}`,
          });

          // Update query and rebuild the list of filter sets
          currentFilterSet.query = query;
          updateSavedFilterSets([...filterSets]);

          setSelectedFilterSetValue(currentFilterSet.name);
          setHasUnsavedChanges(false);
        }}
      />
    );
  } else if (filterSetAction === 'delete' && currentFilterSet) {
    actionModal = (
      <DeleteFilterSetModal
        filterSet={currentFilterSet}
        filteringProperties={filteringProperties}
        onCancel={() => {
          setFilterSetAction(null);
        }}
        onSubmit={() => {
          setFilterSetAction(null);

          // Emit flashbar notification
          showNotification?.({
            content: `Successfully deleted "${currentFilterSet.name}"`,
            type: 'success',
            statusIconAriaLabel: 'Success',
            dismissible: true,
            dismissLabel: 'Dismiss message',
            id: `saved-filter-deleted-${currentFilterSet.name}`,
          });

          // Remove the filter set from the list
          const filterIndex = filterSets.indexOf(currentFilterSet);
          filterSets.splice(filterIndex, 1);
          updateSavedFilterSets([...filterSets]);

          // Reset filters
          setSelectedFilterSetValue(null);
          setHasUnsavedChanges(false);
          updateFilters({ operation: 'and', tokens: [] });
        }}
      />
    );
  } else if (filterSetAction === 'new') {
    actionModal = (
      <SaveFilterSetModal
        query={query}
        filteringProperties={filteringProperties}
        onCancel={() => {
          setFilterSetAction(null);
        }}
        onSubmit={({ name, description }) => {
          setFilterSetAction(null);

          // Emit flashbar notification
          showNotification?.({
            content: `Successfully saved "${name}"`,
            type: 'success',
            statusIconAriaLabel: 'Success',
            dismissible: true,
            dismissLabel: 'Dismiss message',
            id: `saved-filter-saved-${name}`,
          });

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
          setSelectedFilterSetValue(newFilterSet.name);
          setHasUnsavedChanges(false);
        }}
      />
    );
  }

  return { currentFilterSet, selectProps, buttonDropdownProps, actionModal };
}
