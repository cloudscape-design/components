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

import styles from './cards.scss';

type RadioButtonDemoContext = React.Context<
  AppContextType<{
    disabled?: boolean;
    readOnly?: boolean;
  }>
>;

const Card = ({
  label,
  checked,
  onChange,
  description,
  disabled,
  readOnly,
}: Omit<RadioButtonProps, 'name'> & { label: string }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <li className={clsx(styles.card, checked && styles['card--selected'])}>
      <div>
        <h2 className={styles.heading}>
          <a href="#">{label}</a>
        </h2>
        <p className={styles.description}>{description}</p>
      </div>
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
    </li>
  );
};

export default function RadioButtonsCardsPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as RadioButtonDemoContext);

  const [value, setValue] = useState<string>('');

  return (
    <article>
      <h1>Radio button — custom card selection</h1>
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
        <ul className={styles.cards}>
          {options.map((option, index) => (
            <Card
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
            />
          ))}
        </ul>
        <Box display={value === 'mail' ? 'block' : 'none'} margin={{ top: 'm' }}>
          <ExtraOptions />
        </Box>
      </ScreenshotArea>
    </article>
  );
}
