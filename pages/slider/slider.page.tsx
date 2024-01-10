// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Input from '~components/input';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import FormField from '~components/form-field';
import { Grid, Select, Slider, SliderProps } from '~components';

function Sliders() {
  const [value, setValue] = React.useState<SliderProps.ChangeDetail['value']>(2);
  const [sliderValue, setSliderValue] = useState(20);
  const [rangeMin, setRangeMin] = useState(20);
  const [rangeMax, setRangeMax] = useState(80);
  const [error, setError] = useState(false);
  const [minValue, setMinValue] = React.useState<any>({ value: '5' });
  const rangeOptions = [{ value: '5' }, { value: '10' }, { value: '15' }, { value: '20' }, { value: '25' }];

  return (
    <SpaceBetween size="xxl">
      <Slider value={sliderValue} min={0} max={100000} onChange={({ detail }) => setSliderValue(detail.value)} />
      <Slider value={50} min={0} max={100} disabled={true} />
      <FormField label="Slider with select">
        <Grid
          gridDefinition={[
            { colspan: { default: 4, xs: 2 } },
            { colspan: { default: 4, xs: 2 }, offset: { xs: 8, default: 4 } },
          ]}
        >
          <Select
            selectedOption={minValue}
            onChange={({ detail }) => setMinValue(detail.selectedOption)}
            options={rangeOptions}
          />
        </Grid>
        <Slider
          value={minValue.value}
          onChange={({ detail }) => {
            setMinValue({ value: detail.value });
          }}
          min={5}
          max={25}
          step={5}
        />
      </FormField>
      <FormField label="Range slider">
        <Grid
          gridDefinition={[
            { colspan: { default: 4, xs: 2 } },
            { colspan: { default: 4, xs: 2 }, offset: { xs: 8, default: 4 } },
          ]}
        >
          <Input
            type="number"
            inputMode="numeric"
            value={`${rangeMin}`}
            onChange={({ detail }) => {
              setRangeMin(Number(detail.value));
            }}
          />
          <Input
            type="number"
            inputMode="numeric"
            value={`${rangeMax}`}
            onBlur={() => setRangeMax(rangeMax)}
            onChange={({ detail }) => setRangeMax(Number(detail.value))}
          />
        </Grid>
        <Slider
          variant="range"
          rangeValue={[rangeMin, rangeMax]}
          onRangeChange={({ detail }) => {
            setRangeMin(detail.value[0]);
            setRangeMax(detail.value[1]);
          }}
          min={0}
          max={100}
        />
      </FormField>
      <FormField
        constraintText="Units must be a value between 0 and 10."
        label="Default slider"
        errorText={
          error ? (value % 1 !== 0 ? 'Unit must be a whole number' : 'Unit must be between 0 and 10.') : undefined
        }
      >
        <Grid gridDefinition={[{ colspan: { default: 8, xs: 4 } }, { colspan: { default: 3, xs: 3 } }]}>
          <Slider
            value={value}
            onChange={({ detail }) => {
              setValue(detail.value);
            }}
            min={0}
            max={10}
            step={0.5}
          />
          <SpaceBetween size="m" alignItems="center" direction="horizontal">
            <Input
              type="number"
              inputMode="numeric"
              invalid={error}
              onBlur={() => {
                setError(value < 0 || value > 10 || value % 1 !== 0);
              }}
              onKeyDown={({ detail }) => {
                if (detail.keyCode === 13) {
                  setError(value < 0 || value > 10 || value % 1 !== 0);
                }
              }}
              value={`${value}`}
              onChange={({ detail }) => {
                setValue(Number(detail.value));
              }}
            />
            <Box>Units</Box>
          </SpaceBetween>
        </Grid>
      </FormField>
    </SpaceBetween>
  );
}

export default function InputsPage() {
  return (
    <div style={{ padding: 10 }}>
      <h1>Sliders demo</h1>
      <SpaceBetween size="xxl">
        <Sliders />
      </SpaceBetween>
    </div>
  );
}
