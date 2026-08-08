// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import SpaceBetween from '~components/space-between';

import { deselectAriaLabel, groupedOptions } from './constants';

const flatOptions: MultiselectProps.Options = [
  { value: '1', label: 'First option' },
  { value: '2', label: 'Second option' },
  { value: '3', label: 'Third option', disabled: true },
  { value: '4', label: 'Fourth option' },
  { value: '5', label: 'Fifth option' },
];

function ControlledMultiselect({
  id,
  label,
  initialOptions,
  ...props
}: Partial<MultiselectProps> & { id: string; label: string; initialOptions: MultiselectProps.Options }) {
  const [selected, setSelected] = useState<MultiselectProps.Options>([]);
  return (
    <Box padding="s">
      <Box variant="h2">{label}</Box>
      <Multiselect
        id={id}
        options={initialOptions}
        selectedOptions={selected}
        onChange={e => setSelected(e.detail.selectedOptions)}
        deselectAriaLabel={deselectAriaLabel}
        i18nStrings={{
          selectAllText: 'Select all',
          tokenLimitShowFewer: 'Show fewer',
          tokenLimitShowMore: 'Show more',
        }}
        placeholder="Choose options"
        enableSelectAll={true}
        {...props}
      />
      <Box color="text-body-secondary" fontSize="body-s" margin={{ top: 'xs' }}>
        {selected.length} option(s) selected
      </Box>
    </Box>
  );
}

export default function SelectAllPage() {
  return (
    <article>
      <Box padding="l">
        <Box variant="h1">Multiselect — Select all</Box>
        <SpaceBetween size="l">
          <ControlledMultiselect
            id="flat_options"
            label="Flat options (with one disabled)"
            initialOptions={flatOptions}
          />
          <ControlledMultiselect id="grouped_options" label="Grouped options" initialOptions={groupedOptions} />
          <ControlledMultiselect
            id="with_filtering"
            label="With auto-filtering"
            initialOptions={groupedOptions}
            filteringType="auto"
          />
          <ControlledMultiselect
            id="keep_open"
            label="keepOpen=false (closes after select all)"
            initialOptions={flatOptions}
            keepOpen={false}
          />
          <ControlledMultiselect
            id="virtual_scroll"
            label="Virtual scroll (many options)"
            initialOptions={[
              ...flatOptions,
              ...Array.from({ length: 50 }, (_, i) => ({
                value: `extra-${i}`,
                label: `Extra option ${i + 1}`,
              })),
            ]}
            virtualScroll={true}
          />
        </SpaceBetween>
      </Box>
    </article>
  );
}
