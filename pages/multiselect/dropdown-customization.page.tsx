// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Multiselect, { MultiselectProps } from '~components/multiselect';

const options: MultiselectProps.Options = [
  { label: 'Apples', value: 'apples' },
  { label: 'Oranges', value: 'oranges' },
  { label: 'Bananas', value: 'bananas' },
  { label: 'Cherries', value: 'cherries' },
];

export default function MultiselectDropdownCustomizationPage() {
  const [selectedOptions, setSelectedOptions] = React.useState<ReadonlyArray<MultiselectProps.Option>>([]);

  return (
    <article>
      <Box padding="l">
        <h1>Multiselect dropdown customization</h1>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="fruits">Fruits</label>
        </Box>
        <Multiselect
          controlId="fruits"
          filteringType="auto"
          filteringPlaceholder="Find fruit"
          filteringAriaLabel="Find fruit"
          placeholder="Choose fruit"
          ariaLabel="Choose fruit"
          options={options}
          selectedOptions={selectedOptions}
          onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
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
          <label htmlFor="fruits-no-filter">Fruits (no filter)</label>
        </Box>
        <p id="fruits-dropdown-description">Pick fruit or create a new one using the actions below.</p>
        <Multiselect
          controlId="fruits-no-filter"
          filteringType="none"
          dropdownRole="dialog"
          dropdownAriaDescribedby="fruits-dropdown-description"
          placeholder="Choose fruit"
          ariaLabel="Choose fruit"
          options={options}
          selectedOptions={selectedOptions}
          onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
          renderDropdownFooter={({ closeDropdown }) => (
            <Box padding="s">
              <Button variant="inline-link">Create new fruit</Button>{' '}
              <Button variant="primary" onClick={closeDropdown}>
                Done
              </Button>
            </Box>
          )}
        />

        <h2>Custom header without a filter</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="fruits-header-no-filter">Fruits (header, no filter)</label>
        </Box>
        <Multiselect
          controlId="fruits-header-no-filter"
          filteringType="none"
          placeholder="Choose fruit"
          ariaLabel="Choose fruit"
          options={options}
          selectedOptions={selectedOptions}
          onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
          renderDropdownHeader={() => (
            <Box padding={{ horizontal: 's', vertical: 'xxs' }} color="text-body-secondary" fontSize="body-s">
              Recently used fruit
            </Box>
          )}
        />

        <h2>Expand to viewport</h2>
        <Box margin={{ bottom: 'xxs' }} color="text-label">
          <label htmlFor="fruits-expand">Fruits (expandToViewport)</label>
        </Box>
        <Multiselect
          controlId="fruits-expand"
          expandToViewport={true}
          filteringType="auto"
          filteringPlaceholder="Find fruit"
          filteringAriaLabel="Find fruit"
          placeholder="Choose fruit"
          ariaLabel="Choose fruit"
          options={options}
          selectedOptions={selectedOptions}
          onChange={({ detail }) => setSelectedOptions(detail.selectedOptions)}
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
