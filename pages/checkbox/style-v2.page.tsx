// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';

import { Checkbox, Container, Multiselect, MultiselectProps, SpaceBetween, Table } from '~components';

import { SimplePage } from '../app/templates';
import * as tableProps from '../table/shared-configs';

import styles from './style-v2.scss';

export default function CheckboxStyleV2() {
  const [disabled, setDisabled] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const shared = { disabled, readOnly, classNames: { root: styles['styled-checkbox'] } };

  const multiselectOptions: MultiselectProps.Options = [
    { value: '1', label: 'First option', disabled },
    { value: '2', label: 'Second option', disabled },
    { value: '3', label: 'Third option', disabled },
  ];

  const tableItems = tableProps.createSimpleItems(3);

  return (
    <SimplePage
      title="Checkbox with Style API v2"
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs">
          <Checkbox checked={disabled} onChange={({ detail }) => setDisabled(detail.checked)}>
            disabled
          </Checkbox>
          <Checkbox checked={readOnly} onChange={({ detail }) => setReadOnly(detail.checked)}>
            readonly
          </Checkbox>
        </SpaceBetween>
      }
    >
      <div>
        <Container header="Standalone checkboxes" variant="stacked">
          <Checkbox {...shared} checked={checked1} onChange={({ detail }) => setChecked1(detail.checked)}>
            Checkbox 1
          </Checkbox>
          <Checkbox {...shared} checked={checked2} onChange={({ detail }) => setChecked2(detail.checked)}>
            Checkbox 2
          </Checkbox>
          <Checkbox
            {...shared}
            indeterminate={(checked1 || checked2) && !(checked1 && checked2)}
            checked={checked1 && checked2}
            onChange={({ detail }) => {
              setChecked1(detail.checked);
              setChecked2(detail.checked);
            }}
          >
            Checkbox 1+2
          </Checkbox>
        </Container>
        <Container header="Checkboxes in multiselect" variant="stacked">
          <Multiselect
            placeholder="Choose option"
            selectedOptions={[multiselectOptions[1]]}
            options={multiselectOptions}
            classNames={{
              options: ({ option }) => {
                switch (option.value) {
                  case '1':
                    return styles['styled-checkbox-one'];
                  case '2':
                    return styles['styled-checkbox-two'];
                  case '3':
                    return styles['styled-checkbox-three'];
                  default:
                    return undefined;
                }
              },
            }}
          />
        </Container>
        <Container header="Checkboxes in table" variant="stacked">
          <Table
            columnDefinitions={tableProps.simpleColumns}
            items={tableItems}
            selectionType="multi"
            selectedItems={[tableItems[1]]}
            ariaLabels={tableProps.ariaLabels}
            enableKeyboardNavigation={true}
            isItemDisabled={() => disabled}
            classNames={{
              selection: ({ item }) => {
                switch (item?.text) {
                  case 'One':
                    return clsx(styles['styled-checkbox'], styles['styled-checkbox-one']);
                  case 'Two':
                    return clsx(styles['styled-checkbox'], styles['styled-checkbox-two']);
                  case 'Three':
                    return clsx(styles['styled-checkbox'], styles['styled-checkbox-three']);
                  default:
                    return styles['styled-checkbox'];
                }
              },
            }}
          />
        </Container>
      </div>
    </SimplePage>
  );
}
