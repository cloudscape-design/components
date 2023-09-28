// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';
import Box from '~components/box';
import Button from '~components/button';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import FormField from '~components/form-field';
import Grid from '~components/grid';
import Multiselect from '~components/multiselect';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';

import { MultiAutosuggest } from './multi-autosuggest';

const propertyOptions = [
  { label: 'Account', value: 'account' },
  { label: 'Tag', value: 'tag' },
];
const tagsOptions = [
  { label: 'project', value: 'project' },
  { label: 'production', value: 'production' },
  { label: 'test', value: 'test' },
];
const operatorOptions = [
  { label: 'Is', value: 'is' },
  { label: 'Is not', value: 'is not' },
  { label: 'Contains', value: 'contains' },
  { label: 'Starts with', value: 'starts with' },
  { label: 'Ends with', value: 'ends with' },
];

const accountOptions: SelectProps.Option[] = [
  { label: 'AccountA (1234567890)', value: 'a' },
  { label: 'AccountB (4545391810)', value: 'b' },
  { label: 'AccountC (3439520065)', value: 'c' },
  { label: 'AccountD (9739472222)', value: 'd' },
  { label: 'AccountE (4534634133)', value: 'e' },
  { label: 'AccountF (4687777332)', value: 'f' },
  { label: 'AccountG (2234366766)', value: 'g' },
];

function AccountMultiselect() {
  const [accountValues, setAccountValues] = useState(accountOptions.filter((_, i) => i % 2 === 0));

  return (
    <FormField label="Condition values">
      <Multiselect
        placeholder="Select applicable values"
        options={accountOptions}
        selectedOptions={accountValues}
        ariaLabel={`${accountValues.length} accounts selected`}
        {...{ inlineTokens: true }}
        filteringType="auto"
        onChange={({ detail }) => {
          setAccountValues([...detail.selectedOptions]);
        }}
      />
    </FormField>
  );
}

type DimensionProperty = 'account' | 'tag';
type DimensionOperator = 'is' | 'is not' | 'contains' | 'starts with' | 'ends with';

function DimensionRow({
  defaultProperty = 'account',
  defaultOperator = 'is',
}: {
  defaultProperty?: DimensionProperty;
  defaultOperator?: DimensionOperator;
}) {
  const [property, setProperty] = useState<DimensionProperty>(defaultProperty);
  const [operator, setOperator] = useState<DimensionOperator>(defaultOperator);
  const [tagKey, setTagKey] = useState<string | null>('');

  const gridDefinition =
    property === 'tag'
      ? [
          { colspan: { default: 4, xs: 1 } },
          { colspan: { default: 4, xs: 2 } },
          { colspan: { default: 4, xs: 2 } },
          { colspan: { default: 12, xs: 7 } },
        ]
      : [{ colspan: { default: 6, xs: 3 } }, { colspan: { default: 6, xs: 2 } }, { colspan: { default: 12, xs: 7 } }];

  return (
    <Grid gridDefinition={gridDefinition}>
      <FormField label="Property">
        <Select
          options={propertyOptions}
          selectedOption={propertyOptions.find(({ value }) => value === property) ?? null}
          onChange={({ detail }) => {
            setProperty((detail.selectedOption.value ?? 'account') as DimensionProperty);
          }}
        />
      </FormField>
      {property === 'tag' && (
        <FormField label="Tag key">
          <Select
            options={tagsOptions}
            selectedOption={tagsOptions.find(({ value }) => value === tagKey) ?? null}
            onChange={({ detail }) => {
              setTagKey(detail.selectedOption.value ?? null);
            }}
          />
        </FormField>
      )}
      <FormField label="Operator">
        <Select
          options={operatorOptions}
          selectedOption={operatorOptions.find(({ value }) => value === operator) ?? null}
          onChange={({ detail }) => {
            setOperator((detail.selectedOption.value ?? 'is') as DimensionOperator);
          }}
        />
      </FormField>

      {operator === 'is' || operator === 'is not' ? <AccountMultiselect /> : <MultiAutosuggest />}
    </Grid>
  );
}

export default function RuleBuilderDemo() {
  const [dimensions, setDimensions] = useState<string[]>([]);

  return (
    <>
      <h1>Rule builder demo</h1>
      <Box padding="l">
        <Container>
          <div>
            <SpaceBetween size="l">
              <ColumnLayout columns={1} borders="all">
                <DimensionRow />
                <DimensionRow defaultOperator="contains" />
                {dimensions.map((_, idx) => (
                  <DimensionRow key={idx} />
                ))}
                <Button
                  onClick={() => {
                    setDimensions([...dimensions, 'row']);
                  }}
                >
                  Add dimension
                </Button>
              </ColumnLayout>
            </SpaceBetween>
          </div>
        </Container>
      </Box>
    </>
  );
}
