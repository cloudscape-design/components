// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';

import {
  Box,
  Checkbox,
  ColumnLayout,
  Container,
  FormField,
  Header,
  Input,
  KeyValuePairs,
  Link,
  SpaceBetween,
} from '~components';
import { applyTheme, Theme } from '~components/theming';

export default function LabelTokensPage() {
  const [themed, setThemed] = useState(false);
  const [inputValue, setInputValue] = useState('us-east-1');

  useLayoutEffect(() => {
    let reset: () => void = () => {};
    if (themed) {
      const theme: Theme = {
        tokens: {
          // Form-field label tokens
          colorTextFormLabel: { light: '#8B008B', dark: '#DA70D6' },
          fontSizeFormLabel: '16px',
          lineHeightFormLabel: '24px',
          fontWeightFormLabel: '300',
          // Key-value pairs label tokens
          fontSizeKeyValuePairsLabel: '13px',
          lineHeightKeyValuePairsLabel: '22px',
          fontWeightKeyValuePairsLabel: '900',
        },
      };

      const result = applyTheme({ theme, baseThemeId: 'visual-refresh' });
      reset = result.reset;
    }
    return reset;
  }, [themed]);

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Header variant="h1">Label design tokens</Header>

        <label>
          <input
            type="checkbox"
            data-testid="apply-theme"
            checked={themed}
            onChange={evt => setThemed(evt.currentTarget.checked)}
          />
          <span style={{ marginInlineStart: 8 }}>Apply custom label tokens</span>
        </label>

        <ColumnLayout columns={2}>
          <Container header={<Header variant="h2">Form-field labels</Header>}>
            <SpaceBetween size="l">
              <FormField
                label="Region"
                description="The AWS region where your resource will be deployed."
                constraintText="Select an appropriate region for your workload."
              >
                <Input value={inputValue} onChange={({ detail }) => setInputValue(detail.value)} />
              </FormField>

              <FormField
                label={
                  <>
                    Resource name <Link variant="info">Info</Link>
                  </>
                }
                description="A unique name for your resource."
              >
                <Input value="my-resource" readOnly={true} />
              </FormField>

              <FormField label="Enable notifications">
                <Checkbox checked={true} onChange={() => {}}>
                  Send email alerts
                </Checkbox>
              </FormField>

              <FormField label="Instance type" errorText="This instance type is not available in this region.">
                <Input value="t3.micro" readOnly={true} />
              </FormField>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Key-value pairs labels</Header>}>
            <KeyValuePairs
              columns={2}
              items={[
                {
                  label: 'Instance ID',
                  value: 'i-0ab12cd34ef56gh78',
                },
                {
                  label: 'Instance state',
                  value: 'Running',
                },
                {
                  label: 'Instance type',
                  value: 't3.micro',
                },
                {
                  label: 'Availability zone',
                  value: 'us-east-1a',
                },
                {
                  label: 'Public DNS',
                  value: 'ec2-12-34-56-78.compute-1.amazonaws.com',
                },
                {
                  label: 'IPv4 address',
                  value: '12.34.56.78',
                },
              ]}
            />
          </Container>
        </ColumnLayout>
      </SpaceBetween>
    </Box>
  );
}
