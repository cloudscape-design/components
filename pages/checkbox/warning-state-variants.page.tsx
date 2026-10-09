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

import styles from './warning-state-variants.scss';

/**
 * `warning-*` and `error-*` are mock treatments applied through page CSS. `error-*` additionally
 * passes the real `invalid` prop, which the component supports; there is no `warning` prop.
 */
type Treatment = 'valid' | 'warning-fill' | 'warning-blue' | 'error-fill';

interface State {
  label: string;
  checked: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

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

/** The three states in the design reference. */
const referenceStates = allStates.slice(0, 3);

function treatmentClassName(treatment: Treatment) {
  switch (treatment) {
    case 'warning-fill':
      return clsx(styles['warning-border'], styles['warning-fill']);
    case 'warning-blue':
      return styles['warning-border'];
    case 'error-fill':
      return clsx(styles['error-border'], styles['error-fill']);
    case 'valid':
      return undefined;
  }
}

function StateCheckbox({ state, treatment, label }: { state: State; treatment: Treatment; label?: string }) {
  return (
    <Checkbox
      checked={state.checked}
      indeterminate={state.indeterminate}
      disabled={state.disabled}
      readOnly={state.readOnly}
      // The component has no `warning` prop, so only the error treatment sets a real validation prop.
      invalid={treatment === 'error-fill'}
      onChange={() => {}}
      className={treatmentClassName(treatment)}
    >
      {label ?? state.label}
    </Checkbox>
  );
}

/** One validation group: the three reference states plus the form field validation message. */
function ValidationGroup({ treatment }: { treatment: Treatment }) {
  const isError = treatment === 'error-fill';
  return (
    <FormField
      errorText={isError ? 'This selection is invalid.' : undefined}
      warningText={isError ? undefined : 'This selection may not be supported.'}
      i18nStrings={{ errorIconAriaLabel: 'Error', warningIconAriaLabel: 'Warning' }}
    >
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

export default function CheckboxWarningStateVariants() {
  return (
    <>
      <h1>Checkbox warning state prototype</h1>
      <Box variant="p" color="text-body-secondary">
        Input treats warning and invalid identically apart from the colour — <code>form-warning-control</code> and{' '}
        <code>form-invalid-control</code> are the same mixin body. These mock-ups follow that, using{' '}
        <code>$color-text-status-warning</code> (#906806) in place of the error red. Note that Input sets no ARIA
        attribute for warning, and the checkbox has no <code>warning</code> prop at all, so every warning visual here is
        page CSS.
      </Box>

      <ScreenshotArea disableAnimations={true}>
        <SpaceBetween size="xxl">
          <SpaceBetween size="s">
            <Box variant="h2">Reference</Box>
            <Box variant="p" color="text-body-secondary">
              Unchecked, checked and indeterminate with a 2px inside warning border, warning selected fill, white check
              mark and dash, and the warning message.
            </Box>
            <ValidationGroup treatment="warning-fill" />
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">Selected fill: warning colour vs blue</Box>
            <Box variant="p" color="text-body-secondary">
              Same 2px inside warning border in both. Only the checked and indeterminate fill differs.
            </Box>
            <ColumnLayout columns={2}>
              <SpaceBetween size="xs">
                <Box variant="h3">Warning selected fill</Box>
                <ValidationGroup treatment="warning-fill" />
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="h3">Blue selected fill</Box>
                <ValidationGroup treatment="warning-blue" />
              </SpaceBetween>
            </ColumnLayout>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">Warning next to error</Box>
            <Box variant="p" color="text-body-secondary">
              The two validation states side by side, so the colour pair can be judged together.
            </Box>
            <ColumnLayout columns={2}>
              <SpaceBetween size="xs">
                <Box variant="h3">Warning</Box>
                <ValidationGroup treatment="warning-fill" />
              </SpaceBetween>
              <SpaceBetween size="xs">
                <Box variant="h3">Error</Box>
                <ValidationGroup treatment="error-fill" />
              </SpaceBetween>
            </ColumnLayout>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">All states</Box>
            <Box variant="p" color="text-body-secondary">
              Every control state against each treatment. Tab through or hover any control to see the focus and hover
              states.
            </Box>
            <ColumnLayout columns={4}>
              <MatrixColumn title="Valid" treatment="valid" />
              <MatrixColumn title="Warning, warning fill" treatment="warning-fill" />
              <MatrixColumn title="Warning, blue fill" treatment="warning-blue" />
              <MatrixColumn title="Error, for comparison" treatment="error-fill" />
            </ColumnLayout>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">Single checkbox as the whole field</Box>
            <FormField
              warningText="Turning this on will apply to all regions."
              i18nStrings={{ warningIconAriaLabel: 'Warning' }}
            >
              <StateCheckbox
                state={{ label: 'replication', checked: true }}
                treatment="warning-fill"
                label="Enable cross-region replication"
              />
            </FormField>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">Group with only some controls in warning</Box>
            <Box variant="p" color="text-body-secondary">
              Unlike the error state, nothing is inherited from the form field here, so the neutral controls need no
              opt-out.
            </Box>
            <FormField
              warningText="Web component selections may not be supported in this region."
              i18nStrings={{ warningIconAriaLabel: 'Warning' }}
            >
              <SpaceBetween size="xs">
                <StateCheckbox state={{ label: 'a', checked: true }} treatment="warning-fill" label="Web component" />
                <StateCheckbox
                  state={{ label: 'b', checked: false, indeterminate: true }}
                  treatment="warning-fill"
                  label="Web component group"
                />
                <StateCheckbox state={{ label: 'c', checked: true }} treatment="valid" label="Lambda function" />
                <StateCheckbox state={{ label: 'd', checked: false }} treatment="valid" label="S3 bucket" />
              </SpaceBetween>
            </FormField>
          </SpaceBetween>

          <SpaceBetween size="s">
            <Box variant="h2">Precedence: error and warning together</Box>
            <Box variant="p" color="text-body-secondary">
              FormField computes <code>warning</code> as <code>!!warningText &amp;&amp; !errorText</code>, so when both
              slots are filled only the error message renders. Input follows the same rule with{' '}
              <code>warning &amp;&amp; !invalid</code>. The controls below carry the error treatment for consistency
              with that.
            </Box>
            <FormField
              label="Resource types"
              errorText="This selection is invalid."
              warningText="This selection may not be supported."
              i18nStrings={{ errorIconAriaLabel: 'Error', warningIconAriaLabel: 'Warning' }}
            >
              <SpaceBetween size="xs">
                {referenceStates.map(state => (
                  <StateCheckbox key={state.label} state={state} treatment="error-fill" label="Web component" />
                ))}
              </SpaceBetween>
            </FormField>
          </SpaceBetween>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
