// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { FormField, KeyValuePairs, TextFilter, TextFilterProps } from '~components';

import { SimplePage } from '../app/templates';
import { getInputFieldClassNames } from '../style-api/input-field';

import styles from './style-api-v2.scss';

// The `input` slot forwards to the whole Input style API; the shared helper maps the owned states (disabled, and
// invalid or warning from the surrounding form field) to classes.
function StyledTextFilter({
  filteringText: initialFilteringText,
  disabled,
  invalid,
  warning,
  ...rest
}: Omit<TextFilterProps, 'onChange'> & { invalid?: boolean; warning?: boolean }) {
  const [filteringText, setFilteringText] = useState(initialFilteringText);
  const fieldClassNames = getInputFieldClassNames({ invalid, warning, disabled });
  const textFilter = (
    <TextFilter
      {...rest}
      filteringAriaLabel="Filter instances"
      filteringText={filteringText}
      onChange={({ detail }) => setFilteringText(detail.filteringText)}
      disabled={disabled}
      {...{
        styleClassNames: {
          input: {
            ...fieldClassNames,
            input: clsx(fieldClassNames.input, styles['input-input-search']),
            searchIcon: clsx(styles['input-search-icon'], disabled && styles['input-search-icon-disabled']),
            clearButton: styles['input-clear-button'],
          },
          countText: styles['count-text'],
        },
      }}
    />
  );
  if (invalid || warning) {
    return (
      <FormField errorText={invalid ? 'Invalid filter' : undefined} warningText={warning ? 'Broad filter' : undefined}>
        {textFilter}
      </FormField>
    );
  }
  return textFilter;
}

export default function () {
  return (
    <SimplePage title="Text filter - Style API v2" screenshotArea={{}} i18n={{}}>
      <KeyValuePairs
        columns={2}
        items={[
          {
            type: 'pair',
            label: 'Default with count text',
            value: <StyledTextFilter filteringText="invoices" countText="18 matches" />,
          },
          {
            type: 'pair',
            label: 'Placeholder',
            value: <StyledTextFilter filteringText="" filteringPlaceholder="Find instances" countText="18 matches" />,
          },
          {
            type: 'pair',
            label: 'Disabled with count text',
            value: <StyledTextFilter filteringText="invoices" countText="18 matches" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Disabled with placeholder',
            value: <StyledTextFilter filteringText="" filteringPlaceholder="Find instances" disabled={true} />,
          },
          {
            type: 'pair',
            label: 'Invalid',
            value: <StyledTextFilter filteringText="invoices" countText="0 matches" invalid={true} />,
          },
          {
            type: 'pair',
            label: 'Warning',
            value: <StyledTextFilter filteringText="in" countText="1,200 matches" warning={true} />,
          },
        ]}
      />
    </SimplePage>
  );
}
