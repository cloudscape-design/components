// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './error-state-variants.scss';

type Treatment = 'valid' | 'blue-selected' | 'red-selected';

interface State {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

/** Every visual state the checkbox control can be in. */
const allStates: State[] = [
  { label: 'Unchecked', checked: false },
  { label: 'Checked', checked: true },
  { label: 'Indeterminate', checked: false, indeterminate: true },
  { label: 'Unchecked, disabled', checked: false, disabled: true },
  { label: 'Checked, disabled', checked: true, disabled: true },
  { label: 'Indeterminate, disabled', checked: false, indeterminate: true, disabled: true },
  { label: 'Unchecked, read-only', checked: false, readOnly: true },
  { label: 'Checked, read-only', checked: true, readOnly: true },
  { label: 'Indeterminate, read-only', checked: false, indeterminate: true, readOnly: true },
];

/** The three states in the reference screenshot. */
const referenceStates = allStates.slice(0, 3);

function StateCheckbox({ state, treatment, label }: { state: State; treatment: Treatment; label?: string }) {
  const invalid = treatment !== 'valid';
  return (
    <Checkbox
      checked={state.checked}
      indeterminate={state.indeterminate}
      disabled={state.disabled}
      readOnly={state.readOnly}
      invalid={invalid}
      onChange={() => {}}
      className={
        invalid ? clsx(styles['error-border'], treatment === 'red-selected' && styles['error-fill']) : undefined
      }
    >
      {label ?? state.label}
    </Checkbox>
  );
}

/** One error group: the three reference states plus the form field error message. */
function ErrorGroup({ treatment }: { treatment: Treatment }) {
  return (
    <FormField errorText="This selection is invalid.">
      <SpaceBetween size="xs">
        {referenceStates.map(state => (
          <StateCheckbox key={state.label} state={state} treatment={treatment} label="Web component" />
        ))}
      </SpaceBetween>
    </FormField>
  );
}

function MatrixColumn({ title, treatment }: { title: string; treatment: Treatment }) {
  return (
    <div className={styles['matrix-cell']}>
      <SpaceBetween size="xs">
        <Box variant="h3">{title}</Box>
        {allStates.map(state => (
          <StateCheckbox key={state.label} state={state} treatment={treatment} />
        ))}
      </SpaceBetween>
    </div>
  );
}

export default function CheckboxErrorStateVariants() {
  return (
    <>
      <h1>Checkbox error state prototype</h1>

      <ScreenshotArea disableAnimations={true}>
        <SpaceBetween size="xxl">
          <SpaceBetween size="s">
            <Box variant="h2">Reference</Box>
            <Box variant="p" color="text-body-secondary">
              Unchecked, checked and indeterminate with a red 2px inside border, red selected fill, white check mark and
              dash, and the error message.
            </Box>
            <ErrorGroup treatment="red-selected" />
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">Selected fill: red vs blue</Box>
            <Box variant="p" color="text-body-secondary">
              Same red 2px inside border in both. Only the checked and indeterminate fill differs.
            </Box>
            <ColumnLayout columns={2}>
              <SpaceBetween size="xs">
                <Box variant="h3">Red selected fill</Box>
                <ErrorGroup treatment="red-selected" />
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="h3">Blue selected fill</Box>
                <ErrorGroup treatment="blue-selected" />
              </SpaceBetween>
            </ColumnLayout>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">All states</Box>
            <Box variant="p" color="text-body-secondary">
              Every control state against each treatment. Tab through or hover any control to see the focus and hover
              states.
            </Box>
            <ColumnLayout columns={3}>
              <MatrixColumn title="Valid" treatment="valid" />
              <MatrixColumn title="Invalid, red fill" treatment="red-selected" />
              <MatrixColumn title="Invalid, blue fill" treatment="blue-selected" />
            </ColumnLayout>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">Single checkbox as the whole field</Box>
            <FormField errorText="You must accept the terms to continue.">
              <StateCheckbox
                state={{ label: 'terms', checked: false }}
                treatment="red-selected"
                label="I accept the terms and conditions"
              />
            </FormField>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">Group with only some controls in error</Box>
            <FormField errorText="Web component selections are not valid for this region.">
              <SpaceBetween size="xs">
                <StateCheckbox state={{ label: 'a', checked: true }} treatment="red-selected" label="Web component" />
                <StateCheckbox
                  state={{ label: 'b', checked: false, indeterminate: true }}
                  treatment="red-selected"
                  label="Web component group"
                />
                <StateCheckbox state={{ label: 'c', checked: true }} treatment="valid" label="Lambda function" />
                <StateCheckbox state={{ label: 'd', checked: false }} treatment="valid" label="S3 bucket" />
              </SpaceBetween>
            </FormField>
          </SpaceBetween>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
