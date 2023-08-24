// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import { useState } from 'react';
import Button from '~components/button';
import ColumnLayout from '~components/column-layout';
import Container from '~components/container';
import FormField from '~components/form-field';
import Grid from '~components/grid';
import Input from '~components/input';
import Multiselect from '~components/multiselect';
import Popover from '~components/popover';
import Select, { SelectProps } from '~components/select';
import SpaceBetween from '~components/space-between';
import TokenGroup from '~components/token-group';

import styles from './rule-builder.scss';
import Box from '~components/box';

const propertyOptions = [
  { label: 'Tag', value: 'tag' },
  { label: 'Account', value: 'account' },
];
const tagsOptions = [{ label: 'project', value: 'project' }];
const operatorOptions = [
  { label: 'includes', value: 'includes' },
  { label: 'is', value: 'is' },
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

function InlineTokens({ tokens }: { tokens: string[] }) {
  return (
    <div className={styles['inline-tokens']}>
      {tokens.map((token, i) => (
        <div className={styles.token} key={`token-${i}`}>
          {token}
        </div>
      ))}
    </div>
  );
}

export default function RuleBuilderDemo() {
  const [values, setValues] = useState(['one token', 'another one', 'third']);
  const [accountValues, setAccountValues] = useState(accountOptions.filter((_, i) => i % 2 === 0));
  const [textValue, setTextValue] = useState('');

  return (
    <>
      <h1>Rule builder demo</h1>
      <Box padding="l">
        <Container>
          <ColumnLayout columns={1} borders="all">
            <Grid
              gridDefinition={[
                { colspan: { default: 6, xs: 3 } },
                { colspan: { default: 6, xs: 2 } },
                { colspan: { default: 12, xs: 7 } },
              ]}
            >
              <Select options={propertyOptions} selectedOption={propertyOptions[1]} />
              <Select options={operatorOptions} selectedOption={operatorOptions[1]} />
              <Multiselect
                options={accountOptions}
                selectedOptions={accountValues}
                triggerVariant="tokens"
                onChange={({ detail }) => {
                  setAccountValues([...detail.selectedOptions]);
                }}
              />
            </Grid>

            <Grid
              gridDefinition={[
                { colspan: { default: 4, xs: 1 } },
                { colspan: { default: 4, xs: 2 } },
                { colspan: { default: 4, xs: 2 } },
                { colspan: { default: 12, xs: 7 } },
              ]}
            >
              <Select options={propertyOptions} selectedOption={propertyOptions[0]} />
              <Select options={tagsOptions} selectedOption={tagsOptions[0]} />
              <Select options={operatorOptions} selectedOption={operatorOptions[0]} />
              <div className={styles['inline-token-editor']}>
                <Popover
                  triggerType="custom"
                  header="Tag project contains"
                  content={
                    <div>
                      <SpaceBetween size="xxs">
                        <FormField label="Add filter token">
                          <Input
                            value={textValue}
                            onKeyUp={e => {
                              if (e.detail.key === 'Enter') {
                                setValues([...values, textValue]);
                                setTextValue('');
                              }
                            }}
                            onChange={e => setTextValue(e.detail.value)}
                          />
                        </FormField>
                        <TokenGroup
                          items={values.map(value => ({ label: value }))}
                          onDismiss={({ detail }) => {
                            console.log('setValue');
                            setValues([...values.slice(0, detail.itemIndex), ...values.slice(detail.itemIndex + 1)]);
                          }}
                        />
                      </SpaceBetween>
                    </div>
                  }
                >
                  <Button variant="icon" iconName="edit" />
                </Popover>
                <InlineTokens tokens={values} />
              </div>
            </Grid>
          </ColumnLayout>
        </Container>
      </Box>
    </>
  );
}
