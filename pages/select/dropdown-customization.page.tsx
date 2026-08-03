// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import SegmentedControl from '~components/segmented-control';
import Select, { SelectProps } from '~components/select';

const options: SelectProps.Options = [
  { label: 'Apples', value: 'apples' },
  { label: 'Oranges', value: 'oranges' },
  { label: 'Bananas', value: 'bananas' },
  { label: 'Cherries', value: 'cherries' },
];

export default function SelectDropdownCustomizationPage() {
  const [selectedOption, setSelectedOption] = React.useState<SelectProps.Option | null>(null);
  const [filterType, setFilterType] = React.useState('all');

  return (
    <article>
      <Box padding="l">
        <h1>Select dropdown customization</h1>

        <h2>Interactive footer reachability — dialog context (filteringType=auto)</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="footer-dialog-control">Fruit (dialog footer)</label>
        </Box>
        <Select
          id="footer-dialog"
          controlId="footer-dialog-control"
          filteringType="auto"
          filteringPlaceholder="Find a fruit"
          filteringAriaLabel="Find a fruit"
          placeholder="Choose a fruit"
          ariaLabel="Choose a fruit"
          options={options}
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          renderDropdownFooter={({ closeDropdown }) => (
            <Box padding="s">
              <Button variant="primary" onClick={closeDropdown}>
                Footer action
              </Button>
            </Box>
          )}
        />

        <h2>Interactive footer reachability — plain listbox (filteringType=none)</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="footer-listbox-control">Fruit (listbox footer)</label>
        </Box>
        <Select
          id="footer-listbox"
          controlId="footer-listbox-control"
          filteringType="none"
          placeholder="Choose a fruit"
          ariaLabel="Choose a fruit"
          options={options}
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          renderDropdownFooter={({ closeDropdown }) => (
            <Box padding="s">
              <Button variant="primary" onClick={closeDropdown}>
                Footer action
              </Button>
            </Box>
          )}
        />

        <h2>Interactive header reachability — dialog context (filteringType=auto)</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="header-dialog-control">Fruit (dialog header)</label>
        </Box>
        <Select
          id="header-dialog"
          controlId="header-dialog-control"
          filteringType="auto"
          filteringPlaceholder="Find a fruit"
          filteringAriaLabel="Find a fruit"
          placeholder="Choose a fruit"
          ariaLabel="Choose a fruit"
          options={options}
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          renderDropdownHeader={() => (
            <Box padding="s">
              <Button variant="primary">Header action</Button>
            </Box>
          )}
        />

        <h2>Interactive header reachability — plain listbox (filteringType=none)</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="header-listbox-control">Fruit (listbox header)</label>
        </Box>
        <Select
          id="header-listbox"
          controlId="header-listbox-control"
          filteringType="none"
          placeholder="Choose a fruit"
          ariaLabel="Choose a fruit"
          options={options}
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          renderDropdownHeader={() => (
            <Box padding="s">
              <Button variant="primary">Header action</Button>
            </Box>
          )}
        />

        <h2>Filtering + header + footer (dialog)</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="fruit">Fruit</label>
        </Box>
        <Select
          controlId="fruit"
          filteringType="auto"
          filteringPlaceholder="Find a fruit"
          filteringAriaLabel="Find a fruit"
          placeholder="Choose a fruit"
          ariaLabel="Choose a fruit"
          options={options}
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          renderFilteringActions={() => (
            <SegmentedControl
              selectedId={filterType}
              onChange={({ detail }) => setFilterType(detail.selectedId)}
              label="Filter type"
              options={[
                { id: 'all', text: 'All' },
                { id: 'fav', text: 'Favorites' },
              ]}
            />
          )}
          renderDropdownHeader={({ filterText }) => (
            <Box padding={{ horizontal: 's', vertical: 'xxs' }} color="text-body-secondary" fontSize="body-s">
              {filterText ? `Showing results for "${filterText}"` : 'Start typing to filter fruit'}
            </Box>
          )}
          renderDropdownFooter={({ filterText, closeDropdown }) => (
            <Box padding="s">
              <Button variant="inline-link">{filterText ? `Create "${filterText}"` : 'Create new fruit'}</Button>{' '}
              <Button variant="primary" onClick={closeDropdown}>
                Done
              </Button>
            </Box>
          )}
        />

        <h2>No filter, forced dialog role, with described-by</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="fruit-no-filter">Fruit (no filter)</label>
        </Box>
        <p id="fruit-dropdown-description">Pick a fruit or create a new one using the actions below.</p>
        <Select
          controlId="fruit-no-filter"
          filteringType="none"
          dropdownRole="dialog"
          dropdownAriaDescribedby="fruit-dropdown-description"
          placeholder="Choose a fruit"
          ariaLabel="Choose a fruit"
          options={options}
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          renderDropdownFooter={({ closeDropdown }) => (
            <Box padding="s">
              <Button variant="inline-link">Create new fruit</Button>{' '}
              <Button variant="primary" onClick={closeDropdown}>
                Done
              </Button>
            </Box>
          )}
        />

        <h2>Filtering actions wrapping (actions exceed the dropdown width)</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="fruit-narrow">Fruit (narrow)</label>
        </Box>
        <div style={{ width: 220 }}>
          <Select
            controlId="fruit-narrow"
            filteringType="auto"
            filteringPlaceholder="Find a fruit"
            filteringAriaLabel="Find a fruit"
            placeholder="Choose a fruit"
            ariaLabel="Choose a fruit"
            options={options}
            selectedOption={selectedOption}
            onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
            renderFilteringActions={() => (
              <SegmentedControl
                selectedId={filterType}
                onChange={({ detail }) => setFilterType(detail.selectedId)}
                label="Filter type"
                options={[
                  { id: 'all', text: 'All fruit' },
                  { id: 'fav', text: 'Favorites' },
                  { id: 'recent', text: 'Recently added' },
                ]}
              />
            )}
          />
        </div>

        <h2>Custom header without a filter</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="fruit-header-no-filter">Fruit (header, no filter)</label>
        </Box>
        <Select
          controlId="fruit-header-no-filter"
          filteringType="none"
          placeholder="Choose a fruit"
          ariaLabel="Choose a fruit"
          options={options}
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          renderDropdownHeader={() => (
            <Box padding={{ horizontal: 's', vertical: 'xxs' }} color="text-body-secondary" fontSize="body-s">
              Recently used fruit
            </Box>
          )}
        />

        <h2>Expand to viewport</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="fruit-expand">Fruit (expandToViewport)</label>
        </Box>
        <Select
          controlId="fruit-expand"
          expandToViewport={true}
          filteringType="auto"
          filteringPlaceholder="Find a fruit"
          filteringAriaLabel="Find a fruit"
          placeholder="Choose a fruit"
          ariaLabel="Choose a fruit"
          options={options}
          selectedOption={selectedOption}
          onChange={({ detail }) => setSelectedOption(detail.selectedOption)}
          renderFilteringActions={() => (
            <SegmentedControl
              selectedId={filterType}
              onChange={({ detail }) => setFilterType(detail.selectedId)}
              label="Filter type"
              options={[
                { id: 'all', text: 'All' },
                { id: 'fav', text: 'Favorites' },
              ]}
            />
          )}
          renderDropdownHeader={({ filterText }) => (
            <Box padding={{ horizontal: 's', vertical: 'xxs' }} color="text-body-secondary" fontSize="body-s">
              {filterText ? `Showing results for "${filterText}"` : 'Start typing to filter fruit'}
            </Box>
          )}
          renderDropdownFooter={({ closeDropdown }) => (
            <Box padding="s">
              <Button variant="primary" onClick={closeDropdown}>
                Done
              </Button>
            </Box>
          )}
        />
      </Box>
    </article>
  );
}
