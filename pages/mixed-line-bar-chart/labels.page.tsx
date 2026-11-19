// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';
import range from 'lodash/range';

import Box from '~components/box';
import Container from '~components/container';
import FormField from '~components/form-field';
import Header from '~components/header';
import Input from '~components/input';
import MixedLineBarChart from '~components/mixed-line-bar-chart';
import Select from '~components/select';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import { commonProps } from './common';

const scaleOptions = [
  { value: 'linear', label: 'Linear' },
  { value: 'categorical', label: 'Categorical' },
];

function findScaleOption(scaleType: 'linear' | 'categorical') {
  return scaleType === 'linear' ? scaleOptions[0] : scaleOptions[1];
}

export default function () {
  const [dataLength, setDataLength] = useState(50);
  const [labelPattern, setLabelPattern] = useState('{x}\\nindex');
  const [scaleType, setScaleType] = useState<'linear' | 'categorical'>('linear');
  const data = useMemo(() => range(0, dataLength).map(index => ({ x: index, y: index * index })), [dataLength]);

  return (
    <ScreenshotArea>
      <h1>Labels playground</h1>
      <Box padding="l">
        <Container header={<Header variant="h2">Line Chart</Header>}>
          <SpaceBetween direction="vertical" size="s">
            <SpaceBetween direction="horizontal" size="s">
              <FormField label="Data length">
                <div style={{ width: 250 }}>
                  <Input
                    type="number"
                    value={dataLength.toString()}
                    onChange={e => {
                      const value = parseInt(e.detail.value);
                      setDataLength(Math.max(0, Math.min(100, value)));
                    }}
                  />
                </div>
              </FormField>

              <FormField label="Label formatter">
                <div style={{ width: 250 }}>
                  <Input value={labelPattern} onChange={e => setLabelPattern(e.detail.value)} />
                </div>
              </FormField>

              <FormField label="Scale type">
                <div style={{ width: 250 }}>
                  <Select
                    selectedOption={findScaleOption(scaleType)}
                    options={scaleOptions}
                    onChange={e => setScaleType(e.detail.selectedOption.value as any)}
                  />
                </div>
              </FormField>
            </SpaceBetween>

            <MixedLineBarChart
              {...commonProps}
              height={250}
              series={[{ title: 'Series', type: 'line', data: data }]}
              xDomain={scaleType === 'linear' ? [0, data.length - 1] : data.map(it => it.x)}
              yDomain={[0, dataLength * dataLength]}
              xTitle="Indices"
              yTitle="Indices x2"
              xScaleType={scaleType}
              ariaLabel="Line chart"
              hideFilter={true}
              hideLegend={true}
              i18nStrings={{
                ...commonProps.i18nStrings,
                xTickFormatter: value => labelPattern.replace(/\{x\}/, value.toString()).replace(/\\n/g, '\n'),
              }}
            />
          </SpaceBetween>
        </Container>
      </Box>
    </ScreenshotArea>
  );
}
