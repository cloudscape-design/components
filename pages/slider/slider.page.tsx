// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Input from '~components/input';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import FormField from '~components/form-field';
import { Grid, Select, Slider, SliderProps } from '~components';

function Sliders() {
  const [value, setValue] = React.useState<SliderProps.ChangeDetail['value']>(50);
  const [sliderValue, setSliderValue] = useState(20);
  const [rangeMin, setRangeMin] = useState(20);
  const [rangeMax, setRangeMax] = useState(80);
  const [minValue, setMinValue] = React.useState<any>({ value: '5' });
  const rangeOptions = [{ value: '0' }, { value: '5' }, { value: '10' }, { value: '15' }, { value: '20' }];

  return (
    <SpaceBetween size="xxl">
      <Slider value={sliderValue} min={0} max={100} step={10} onChange={({ detail }) => setSliderValue(detail.value)} />
      <Slider value={50} min={0} max={100} disabled={true} />

      <FormField label="Slider with select">
        <SpaceBetween size="m">
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
              console.log(detail);
              setMinValue({ value: detail.value });
            }}
            min={0}
            max={20}
            step={5}
          />
          <FormField
            label="Range slider"
            errorText={rangeMin < 0 || (rangeMin > 100 && 'Values must be between 0 and 100')}
          >
            <Grid
              gridDefinition={[
                { colspan: { default: 4, xs: 2 } },
                { colspan: { default: 4, xs: 2 }, offset: { xs: 8, default: 4 } },
              ]}
            >
              <Input
                invalid={rangeMin < 0 || rangeMin > 100}
                type="number"
                inputMode="numeric"
                value={`${rangeMin}`}
                onChange={({ detail }) => {
                  setRangeMin(Number(detail.value));
                }}
              />
              <Input
                invalid={rangeMin < 0 || rangeMin > 100}
                type="number"
                inputMode="numeric"
                value={`${rangeMax}`}
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
          <FormField label="Default slider">
            <Grid
              gridDefinition={[
                { colspan: { default: 8, xs: 4 } },
                { colspan: { default: 2, xs: 1 } },
                { colspan: { default: 2, xs: 1 } },
              ]}
            >
              <Slider
                value={value}
                onChange={({ detail }) => {
                  setValue(detail.value);
                }}
                min={0}
                max={100}
              />
              <Input value={`${value}`} onChange={({ detail }) => setValue(Number(detail.value))} />
              <Box>Units</Box>
            </Grid>
          </FormField>
        </SpaceBetween>
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
