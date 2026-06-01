// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Checkbox, Container, RadioGroup } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-v2.scss';

export default function StyleV2RadioGroupPage() {
  const [value1, setValue1] = useState('option-1');
  const [value2, setValue2] = useState('small');
  const [readOnly, setReadOnly] = useState(false);

  return (
    <SimplePage
      title="RadioGroup with Style API v2"
      screenshotArea={{}}
      settings={
        <Checkbox checked={readOnly} onChange={({ detail }) => setReadOnly(detail.checked)}>
          readOnly
        </Checkbox>
      }
    >
      <div>
        <Container header="Accent variant with descriptions" variant="stacked">
          <RadioGroup
            value={value1}
            onChange={({ detail }) => setValue1(detail.value)}
            readOnly={readOnly}
            items={[
              { value: 'option-1', label: 'Standard', description: 'Best for most workloads' },
              { value: 'option-2', label: 'Performance', description: 'Optimized for high throughput' },
              { value: 'option-3', label: 'Economy', description: 'Cost-effective for dev/test' },
              { value: 'option-4', label: 'Legacy', description: 'Not recommended', disabled: true },
            ]}
            classNames={{ root: styles['radio-accent'] }}
          />
        </Container>
        <Container header="Success variant" variant="stacked">
          <RadioGroup
            value={value2}
            onChange={({ detail }) => setValue2(detail.value)}
            readOnly={readOnly}
            items={[
              { value: 'small', label: 'Small', description: '1 vCPU, 2 GB RAM' },
              { value: 'medium', label: 'Medium', description: '2 vCPU, 4 GB RAM' },
              { value: 'large', label: 'Large', description: '4 vCPU, 8 GB RAM' },
            ]}
            classNames={{ root: styles['radio-success'] }}
          />
        </Container>
      </div>
    </SimplePage>
  );
}
