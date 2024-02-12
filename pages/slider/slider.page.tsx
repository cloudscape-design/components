// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Input from '~components/input';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import FormField from '~components/form-field';
import Container from '~components/container';
import Header from '~components/header';
import { Grid, Select, SelectProps, Slider } from '~components';

function Sliders() {
  const [value2, setValue2] = React.useState(-2);
  const [value3, setValue3] = React.useState(50);
  const [value4, setValue4] = React.useState(40);
  const [value5, setValue5] = React.useState(25);
  const [sliderValue, setSliderValue] = useState(40);
  const [error2, setError2] = useState(false);
  const [minValue, setMinValue] = React.useState<SelectProps.Option>({ value: '5' });
  const rangeOptions = [{ value: '5' }, { value: '10' }, { value: '15' }, { value: '20' }, { value: '25' }];
  const sliderWordOptions = [
    { value: 0, label: 'None' },
    { value: 25, label: 'Low' },
    { value: 50, label: 'Medium' },
    { value: 75, label: 'High' },
  ];

  React.useEffect(() => {
    setError2(value2 < 0 || value2 > 100 || value2 % 1 !== 0);
  }, [value2]);

  return (
    <SpaceBetween size="xxl">
      <Slider
        ariaLabel="slider-example"
        valueFormatter={value => `${value}%`}
        value={sliderValue}
        min={0}
        max={100}
        onChange={({ detail }) => {
          setSliderValue(detail.value);
        }}
      />

      <Slider ariaLabel="slider-disabled-example" value={50} min={0} max={100} disabled={true} />

      <FormField
        label="Slider with input and validation"
        errorText={
          error2 ? (value2 % 1 !== 0 ? 'Unit must be a whole number' : 'Unit must be between 0 and 100.') : undefined
        }
      >
        <Grid gridDefinition={[{ colspan: { default: 8, xs: 4 } }, { colspan: { default: 3, xs: 3 } }]}>
          <Slider
            value={value2}
            onChange={({ detail }) => {
              setValue2(detail.value);
            }}
            min={0}
            max={100}
            invalid={error2}
          />
          <SpaceBetween size="m" alignItems="center" direction="horizontal">
            <Input
              type="number"
              inputMode="numeric"
              invalid={error2}
              value={`${value2}`}
              onChange={({ detail }) => {
                setValue2(Number(detail.value));
              }}
            />
            <Box>Units</Box>
          </SpaceBetween>
        </Grid>
      </FormField>

      <FormField label="Slider with select">
        <Grid gridDefinition={[{ colspan: { default: 4, xs: 2 } }]}>
          <Select
            selectedOption={minValue}
            onChange={({ detail }) => setMinValue(detail.selectedOption)}
            options={rangeOptions}
          />
        </Grid>
        <Slider
          value={Number(minValue.value)}
          onChange={({ detail }) => {
            setMinValue({ value: `${detail.value}` });
          }}
          min={5}
          max={25}
          step={5}
        />
      </FormField>
      <FormField label="Stepped slider">
        <Slider
          value={value3}
          onChange={({ detail }) => {
            setValue3(detail.value);
          }}
          valueFormatter={value => `The very long and precise value at this point on the slider is: ${value}`}
          min={0}
          max={100}
          step={10}
        />
      </FormField>
      <FormField label="Slider with thumb only and reference labels">
        <Slider
          value={value4}
          onChange={({ detail }) => {
            setValue4(detail.value);
          }}
          valueFormatter={value => (value < 0 ? `${value}%` : value === 0 ? '500' : `+${value}%`)}
          min={-100}
          max={100}
          thumbOnly={true}
          referenceValues={[-80, -60, -40, -20, 0, 20, 40, 60, 80]}
        />
      </FormField>
      <FormField label="Slider with words">
        <Slider
          value={value5}
          onChange={({ detail }) => {
            setValue5(detail.value);
          }}
          valueFormatter={value => sliderWordOptions.find(item => item.value === value)?.label || ''}
          step={25}
          hideTooltip={true}
          min={0}
          max={75}
          referenceValues={[25, 50]}
        />
      </FormField>
    </SpaceBetween>
  );
}

export default function InputsPage() {
  const [value, setValue] = React.useState(4);
  return (
    <div style={{ padding: 30 }}>
      <h1>Sliders demo</h1>
      <SpaceBetween size="xxl">
        <Sliders />
        <Container header={<Header>This is a header</Header>}>
          <SpaceBetween size="xl">
            <FormField label="This is a form field" description="This is a description">
              <Input value="" placeholder="Placeholder" />
            </FormField>
            <FormField label="Volume">
              <Grid gridDefinition={[{ colspan: 10 }, { colspan: 2 }]}>
                <Slider value={value} onChange={({ detail }) => setValue(detail.value)} min={0} max={11} />
                <SpaceBetween size="xxs" direction="vertical">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={`${value}`}
                    onChange={({ detail }) => {
                      setValue(Number(detail.value));
                    }}
                  />
                  <Box>Units</Box>
                </SpaceBetween>
              </Grid>
            </FormField>
            <FormField label="This is a form field" description="This is a description">
              <Input value="" placeholder="Placeholder" />
            </FormField>
            <FormField label="Volume">
              <Grid gridDefinition={[{ colspan: 2 }, { colspan: 10 }]}>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={`${value}`}
                  onChange={({ detail }) => {
                    setValue(Number(detail.value));
                  }}
                />
              </Grid>
              <Slider
                valueFormatter={() => ''}
                hideTooltip={true}
                value={value}
                onChange={({ detail }) => setValue(detail.value)}
                min={0}
                max={11}
              />
            </FormField>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </div>
  );
}
