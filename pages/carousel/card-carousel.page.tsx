// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, FormField, Input, Select, SelectProps } from '~components';
import Carousel from '~components/carousel';

import { generateCardCarousels } from './utils';

export default function () {
  const [size, setSize] = useState<SelectProps.Option>({ label: 'Number', value: 'number' });
  const [sizeNumber, setSizeNumber] = useState<number>(350);
  const [visibleItemNumber, setVisibleItemNumber] = useState<number>(3);

  return (
    <>
      <Box padding={'m'} variant="h1">
        Cards Carousel
      </Box>

      <Box padding={'m'}>
        <FormField label="Size">
          <Select
            selectedOption={size}
            onChange={({ detail }) => setSize(detail.selectedOption)}
            options={[
              { label: 'Small', value: 'small' },
              { label: 'Medium', value: 'medium' },
              { label: 'Large', value: 'large' },
              { label: 'Number', value: 'number' },
            ]}
          />
        </FormField>

        {size?.value === 'number' && (
          <FormField label="Size number">
            <Input value={`${sizeNumber}`} onChange={({ detail }) => setSizeNumber(Number(detail.value))} />
          </FormField>
        )}

        <FormField label="Visible item number">
          <Input value={`${visibleItemNumber}`} onChange={({ detail }) => setVisibleItemNumber(Number(detail.value))} />
        </FormField>
      </Box>

      <div
        style={{
          padding: 20,
        }}
      >
        <Carousel
          size={size?.value === 'number' ? sizeNumber : (size.value! as any)}
          ariaLabel="Test carousel"
          ariaLabelNext="Next item"
          ariaLabelPrevious="Previous item"
          visibleItemNumber={visibleItemNumber}
          items={generateCardCarousels()}
        />
      </div>
    </>
  );
}
