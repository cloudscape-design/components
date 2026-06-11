// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { ReactNode, useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';

import { ButtonDropdownProps } from '@cloudscape-design/components/button-dropdown';
import { FlashbarProps } from '@cloudscape-design/components/flashbar';
import { PropertyFilterProps } from '@cloudscape-design/components/property-filter';
import { SelectProps } from '@cloudscape-design/components/select';

import { DeleteFilterSetModal, SaveFilterSetModal, UpdateFilterSetModal } from './filter-set-modals';

export interface FilterSet {
  name: string;
  description?: string;
  query: PropertyFilterProps.Query;
  unsaved?: boolean;
  default?: boolean;
}

export interface UseFilterSetsProps {
  filterSets?: FilterSet[];
  query: PropertyFilterProps.Query;
  filteringProperties?: readonly PropertyFilterProps.FilteringProperty[];
  selectRef?: React.RefObject<SelectProps.Ref>;
  updateFilters: (query: PropertyFilterProps.Query) => void;
  updateSavedFilterSets: (newFilterSets: FilterSet[]) => void;
  showNotification?: (notification: FlashbarProps.MessageDefinition) => void;
  saveAsURL?: (query: PropertyFilterProps.Query) => void;
  defaultSelectedFilterSetValue?: string | null;
  updateSelectedFilterValue?: (value: string | null) => void;
}

export interface UseFilterSetsResult {
  currentFilterSet: FilterSet | null;
  selectProps: Partial<SelectProps> & Pick<SelectProps, 'selectedOption'> & { ref?: React.Ref<SelectProps.Ref> };
  buttonDropdownProps: Partial<ButtonDropdownProps> & Pick<ButtonDropdownProps, 'items'>;
  actionModal: React.ReactNode;
}

type FilterAction = 'update' | 'new' | 'delete' | 'default';

function isQueryEmpty(query: PropertyFilterProps.Query) {
  return (!query.tokenGroups || query.tokenGroups.length === 0) && query.tokens.length === 0;
}

function isQueryEqual(queryA: PropertyFilterProps.Query, queryB: PropertyFilterProps.Query) {
  return isEqual(queryA, queryB);
}

export function useFilterSets({
  filterSets = [],
  query,
  filteringProperties,
  selectRef,
  updateFilters,
  updateSavedFilterSets,
  showNotification,
  saveAsURL,
  defaultSelectedFilterSetValue,
  updateSelectedFilterValue,
}: UseFilterSetsProps): UseFilterSetsResult {
  // Value of the currently selected filter set option
  const [selectedFilterSetValue, setSelectedFilterSetValue] = useState<string | null>(
    defaultSelectedFilterSetValue ?? null
  );
  // Represents the last selected *saved* filter set
  const [currentFilterSet, setCurrentFilterSet] = useState<FilterSet | null>(
    filterSets.find(fs => fs.name === selectedFilterSetValue) ?? null
  );
  // Determines if there is currently a modal displayed for a filter set action
  const [filterSetAction, setFilterSetAction] = useState<FilterAction | null>(null);
  // Determines if there are unsaved changes in the filter set
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const unsavedFilterSetOption = {
    value: '___unsaved___',
    label: currentFilterSet ? `${currentFilterSet.name} (unsaved)` : undefined,
  };

  const filterSetOptions: Array<SelectProps.Option> = filterSets.map(filterSet => ({
    value: filterSet.name,
    description: filterSet.description,
    labelTag: filterSet.default ? 'Default' : undefined,
  }));

  // Only show the "(unsaved)" option if there are unsaved changes from a previous filter set
  const showUnsavedFilterOption = hasUnsavedChanges && currentFilterSet;

  // Add the dynamic "(unsaved)" option when there are unsaved changes
  if (showUnsavedFilterOption) {
    filterSetOptions.unshift(unsavedFilterSetOption);
  }
  const selectedFilterSetOption = showUnsavedFilterOption
    ? unsavedFilterSetOption
    : (filterSetOptions.find(({ value }) => value === selectedFilterSetValue) ?? null);

  useEffect(() => {
    const hasFilters = !isQueryEmpty(query);

    // Reset everything if there are no filters
    if (!hasFilters) {
      setHasUnsavedChanges(false);
      setCurrentFilterSet(null);
      setSelectedFilterSetValue(null);
      selectRef?.current?.focus();
    } else if (!hasUnsavedChanges && hasFilters) {
      // Enter "unsaved changes mode" when the filter query changes for the first time
      if (!currentFilterSet || !isQueryEqual(query, currentFilterSet.query)) {
        setHasUnsavedChanges(true);
      }
    } else if (hasUnsavedChanges && currentFilterSet && isQueryEqual(query, currentFilterSet.query)) {
      // Leave "unsaved changed mode" when you get back to the original filter configuration
      setHasUnsavedChanges(false);
    }
  }, [currentFilterSet, hasUnsavedChanges, query, selectRef]);

  const selectProps: UseFilterSetsResult['selectProps'] = {
    placeholder: 'Choose a filter set',
    options: filterSetOptions,
    selectedOption: selectedFilterSetOption,
    empty: 'No saved filter sets',
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
      updateSelectedFilterValue?.(detail.selectedOption.value ?? null);
      setSelectedFilterSetValue(detail.selectedOption.value ?? null);
      setHasUnsavedChanges(false);
    },
  };

  const buttonDropdownProps: UseFilterSetsResult['buttonDropdownProps'] = {
    ariaLabel: 'Filter actions',
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
      {
        id: 'settings',
        text: 'Settings',
        itemType: 'group',
        items: [
          {
            id: 'default',
            text: 'Set as default',
            itemType: 'checkbox',
            checked: currentFilterSet?.default ?? false,
            disabled: hasUnsavedChanges || !currentFilterSet,
            disabledReason: !currentFilterSet
              ? 'This action is available after selecting a filter set.'
              : hasUnsavedChanges
                ? 'This action is available when changes have been saved.'
                : undefined,
          },
        ],
      },
    ],
    onItemClick: ({ detail: { id } }) => setFilterSetAction(id as FilterAction),
  };

  let actionModal: ReactNode | null = null;
  if (filterSetAction === 'default' && currentFilterSet) {
    // This action only fires when toggling the default checkbox
    // Toggles the current filter set's default value, as well as others to not be default
    // The latter applies as: if any other set was default and the current should be default then any others should not be default anymore
    // If the current was default and should not be anymore then all sets should be marked as not default (there will only be one default at a time)
    const currentDefaultValue = currentFilterSet?.default ?? false;

    // Update the current filter set in state
    setCurrentFilterSet({ ...currentFilterSet, default: !currentDefaultValue });

    // Updates filter sets
    // Toggles the current filter sets default value and sets all others to false
    updateSavedFilterSets([
      ...filterSets.map(fs => ({ ...fs, default: fs.name === currentFilterSet.name ? !currentDefaultValue : false })),
    ]);

    // Set the action back to null as a modal wasn't opened that would set the action to null onSubmit or onCancel
    setFilterSetAction(null);
  } else if (filterSetAction === 'update' && currentFilterSet && hasUnsavedChanges) {
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
          selectRef?.current?.focus();
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
        onSubmit={({ name, description, isDefault }) => {
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
            default: isDefault || false,
          };

          // Add to the list of filter sets, set all other filter sets' default values to false if the new one is set to be default
          const newFilterSets = [
            ...filterSets.map(fs => ({ ...fs, default: isDefault ? false : fs.default })),
            newFilterSet,
          ];
          updateSavedFilterSets(newFilterSets);

          // Make this the new current filter set
          setCurrentFilterSet(newFilterSet);
          setSelectedFilterSetValue(newFilterSet.name);
          setHasUnsavedChanges(false);
          selectRef?.current?.focus();
        }}
      />
    );
  }

  return { currentFilterSet, selectProps, buttonDropdownProps, actionModal };
}
