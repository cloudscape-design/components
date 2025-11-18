// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';
import clsx from 'clsx';

import Box from '~components/box';
import Checkbox from '~components/checkbox';
import ColumnLayout from '~components/column-layout';
import FormField from '~components/form-field';
import RadioButton, { RadioButtonProps } from '~components/radio-button';
import RadioGroup from '~components/radio-group';
import SpaceBetween from '~components/space-between';

import AppContext, { AppContextType } from '../app/app-context';
import ScreenshotArea from '../utils/screenshot-area';
import { ExtraOptions, options } from './common';
import customStyle from './custom-style';

import styles from './styles.scss';

type Orientation = 'horizontal' | 'vertical';
type Wrapper = 'form-field' | 'fieldset' | 'div';

type RadioButtonDemoContext = React.Context<
  AppContextType<{
    customStyle?: boolean;
    descriptions?: boolean;
    disabled?: boolean;
    interactiveElementsInDescriptions?: boolean;
    interactiveElementsInLabels?: boolean;
    orientation?: Orientation;
    radioGroupRole?: boolean;
    readOnly?: boolean;
    wrapper: Wrapper;
  }>
>;

const label = 'Choose a quantity';

const CustomRadioButton = ({
  checked,
  description,
  children,
  disabled,
  onChange,
  readOnly,
}: Omit<RadioButtonProps, 'name'>) => {
  const { urlParams } = useContext(AppContext as RadioButtonDemoContext);

  const fullDescription = urlParams.descriptions ? (
    urlParams.interactiveElementsInDescriptions ? (
      <>
        {description}. <a href="#">Learn more</a>
      </>
    ) : (
      description
    )
  ) : undefined;

  return (
    <RadioButton
      name="quantity"
      checked={checked}
      disabled={disabled}
      readOnly={readOnly}
      onChange={onChange}
      description={fullDescription}
      style={urlParams.customStyle ? customStyle : undefined}
    >
      {children}
      {urlParams.interactiveElementsInLabels && (
        <>
          {' '}
          <button>Button</button>
        </>
      )}
    </RadioButton>
  );
};

export default function RadioButtonsPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as RadioButtonDemoContext);

  const [value, setValue] = useState<string>('');

  const className = clsx(styles['radio-group'], styles[`radio-group--${urlParams.orientation || 'vertical'}`]);

  const radioButtons = (
    <div role={urlParams.radioGroupRole ? 'radioGroup' : undefined} className={className}>
      {options.map((option, index) => (
        <CustomRadioButton
          key={index}
          checked={option.value === value}
          description={option.description}
          onChange={({ detail }) => {
            if (detail.checked) {
              setValue(option.value);
            }
          }}
          disabled={option.allowDisabled && urlParams.disabled}
          readOnly={option.allowReadOnly && urlParams.readOnly}
        >
          {option.label}
        </CustomRadioButton>
      ))}
    </div>
  );
  return (
    <article>
      <h1>Radio button</h1>
      <Box margin={{ horizontal: 'm' }}>
        <ColumnLayout columns={2}>
          <SpaceBetween size="s">
            <FormField label="Orientation">
              <RadioGroup
                value={urlParams.orientation || 'vertical'}
                onChange={({ detail }) => setUrlParams({ ...urlParams, orientation: detail.value as Orientation })}
                items={[
                  {
                    label: 'Vertical',
                    value: 'vertical',
                  },
                  {
                    label: 'Horizontal',
                    value: 'horizontal',
                  },
                ]}
              />
            </FormField>
            <FormField label="Wrapper">
              <RadioGroup
                value={urlParams.wrapper || 'div'}
                onChange={({ detail }) => setUrlParams({ ...urlParams, wrapper: detail.value as Wrapper })}
                items={[
                  {
                    label: 'Cloudscape Form Field around div',
                    value: 'form-field',
                  },
                  {
                    label: 'Native HTML fieldset around div',
                    value: 'fieldset',
                  },
                  {
                    label: 'Div only',
                    value: 'div',
                  },
                ]}
              />
            </FormField>
            <FormField label="Accessibility">
              <Checkbox
                checked={!!urlParams.radioGroupRole}
                onChange={({ detail }) => setUrlParams({ ...urlParams, radioGroupRole: detail.checked })}
                description="Add `radiogroup` role to the wrapping div"
              >
                Use radiogroup role
              </Checkbox>
            </FormField>
          </SpaceBetween>
          <FormField label="Other options">
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

              <Checkbox
                checked={!!urlParams.descriptions}
                onChange={({ detail }) => setUrlParams({ ...urlParams, descriptions: detail.checked })}
                description="Show descriptions"
              >
                Descriptions
              </Checkbox>

              {urlParams.descriptions && (
                <Checkbox
                  checked={!!urlParams.interactiveElementsInDescriptions}
                  onChange={({ detail }) =>
                    setUrlParams({ ...urlParams, interactiveElementsInDescriptions: detail.checked })
                  }
                >
                  Interactive elements in descriptions
                </Checkbox>
              )}

              <Checkbox
                checked={!!urlParams.interactiveElementsInLabels}
                onChange={({ detail }) => setUrlParams({ ...urlParams, interactiveElementsInLabels: detail.checked })}
              >
                Interactive elements in labels
              </Checkbox>

              <Checkbox
                checked={!!urlParams.customStyle}
                onChange={({ detail }) => setUrlParams({ ...urlParams, customStyle: detail.checked })}
                description="Use the style API to customize the component styles"
              >
                Use custom style
              </Checkbox>
            </SpaceBetween>
          </FormField>
        </ColumnLayout>
      </Box>
      <hr />
      <ScreenshotArea disableAnimations={true}>
        {urlParams.wrapper === 'form-field' ? (
          <FormField label={label}>{radioButtons}</FormField>
        ) : urlParams.wrapper === 'fieldset' ? (
          <fieldset>
            <legend>{label}</legend>
            {radioButtons}
          </fieldset>
        ) : (
          radioButtons
        )}
        <Box display={value === 'mail' ? 'block' : 'none'} margin={{ top: 'm' }}>
          <ExtraOptions />
        </Box>
      </ScreenshotArea>
    </article>
  );
}
