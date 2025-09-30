// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useRef, useState } from 'react';
import clsx from 'clsx';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import FormField from '~components/form-field';
import RadioButton, { RadioButtonProps } from '~components/radio-button';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { ExtraOptions, options } from './common';

import styles from './table.scss';

type RadioButtonDemoContext = React.Context<
  AppContextType<{
    disabled?: boolean;
    readOnly?: boolean;
  }>
>;

const Row = ({
  label,
  checked,
  description,
  disabled,
  readOnly,
  onChange,
}: Omit<RadioButtonProps, 'name'> & { label: string }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <tr className={clsx(styles.row, checked && styles['row--selected'])}>
      <td className={styles.cell}>
        <label aria-label={`Select ${label}`}>
          <RadioButton
            name="quantity"
            checked={checked}
            disabled={disabled}
            readOnly={readOnly}
            onChange={onChange}
            ref={ref}
          />
        </label>
      </td>
      <td className={styles.cell}>
        <a href="#">{label}</a>
      </td>
      <td className={styles.cell}>{description}</td>
    </tr>
  );
};

export default function RadioButtonsTablePage() {
  const { urlParams, setUrlParams } = useContext(AppContext as RadioButtonDemoContext);

  const [value, setValue] = useState<string>('');

  return (
    <article>
      <h1>Radio button — custom table selection</h1>
      <Box margin={{ horizontal: 'm' }}>
        <SpaceBetween size="s">
          <FormField label="Options">
            <SpaceBetween size="s">
              <Checkbox
                checked={!!urlParams.disabled}
                onChange={({ detail }) => setUrlParams({ ...urlParams, disabled: detail.checked })}
                description="Make one of the radio buttons disabled"
              >
                Disabled
              </Checkbox>

              <Checkbox
                checked={!!urlParams.readOnly}
                onChange={({ detail }) => setUrlParams({ ...urlParams, readOnly: detail.checked })}
                description="Make one of the radio buttons read-only"
              >
                Read-only
              </Checkbox>
            </SpaceBetween>
          </FormField>
        </SpaceBetween>
      </Box>
      <hr />
      <ScreenshotArea disableAnimations={true}>
        <table className={styles.table}>
          <thead className={styles.head}>
            <tr className={styles.row}>
              <th className={styles['header-cell']}></th>
              <th className={styles['header-cell']}>Name</th>
              <th className={styles['header-cell']}>Description</th>
            </tr>
          </thead>
          <tbody>
            {options.map((option, index) => (
              <Row
                key={index}
                label={option.label}
                description={option.description}
                checked={option.value === value}
                onChange={({ detail }) => {
                  if (detail.checked) {
                    setValue(option.value);
                  }
                }}
                disabled={option.allowDisabled && urlParams.disabled}
                readOnly={option.allowReadOnly && urlParams.readOnly}
              >
                {option.label}
              </Row>
            ))}
          </tbody>
        </table>
        <Box display={value === 'mail' ? 'block' : 'none'} margin={{ top: 'm' }}>
          <ExtraOptions />
        </Box>
      </ScreenshotArea>
    </article>
  );
}
