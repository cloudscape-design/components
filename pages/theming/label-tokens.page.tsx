// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useLayoutEffect, useState } from 'react';

import {
  Badge,
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
  StatusIndicator,
  TextContent,
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
          // Status indicator tokens
          borderRadiusStatusIndicator: '50px',
          colorBackgroundStatusIndicatorSuccess: { light: '#d5f5d5', dark: '#1a3d1a' },
          colorBackgroundStatusIndicatorError: { light: '#ffd5d5', dark: '#3d1a1a' },
          colorBackgroundStatusIndicatorWarning: { light: '#fff3cd', dark: '#3d3000' },
          colorBackgroundStatusIndicatorInfo: { light: '#d5e8ff', dark: '#0a2040' },
          colorBackgroundStatusIndicatorNeutral: { light: '#e8e8e8', dark: '#2a2a2a' },
          // Link decoration tokens
          fontLinkDecorationThickness: '1px',
          fontLinkDecorationStyle: 'dashed',
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

          <Container header={<Header variant="h2">Status indicators</Header>}>
            <SpaceBetween size="s">
              <StatusIndicator type="success">Instance running</StatusIndicator>
              <StatusIndicator type="error">Deployment failed</StatusIndicator>
              <StatusIndicator type="warning">High CPU usage</StatusIndicator>
              <StatusIndicator type="info">Update available</StatusIndicator>
              <StatusIndicator type="stopped">Instance stopped</StatusIndicator>
              <StatusIndicator type="pending">Provisioning</StatusIndicator>
              <StatusIndicator type="in-progress">Deployment in progress</StatusIndicator>
              <StatusIndicator type="loading">Loading</StatusIndicator>
            </SpaceBetween>
          </Container>

          <Container
            header={
              <Header
                variant="h2"
                description={
                  themed
                    ? 'fontLinkDecorationThickness: 3px · fontLinkDecorationStyle: dashed'
                    : 'fontLinkDecorationThickness: 1px · fontLinkDecorationStyle: underline (defaults)'
                }
              >
                Links
              </Header>
            }
          >
            <SpaceBetween size="m">
              <TextContent>
                <p>
                  Body M text with a{' '}
                  <Link href="#" variant="primary">
                    primary link
                  </Link>
                  . When themed, the underline becomes a thick dashed line.
                </p>
              </TextContent>
              <SpaceBetween size="xs" direction="horizontal" alignItems="center">
                <Link href="#" variant="primary" fontSize="heading-xl">
                  Heading XL
                </Link>
                <Link href="#" variant="primary" fontSize="heading-l">
                  Heading L
                </Link>
                <Link href="#" variant="primary" fontSize="heading-m">
                  Heading M
                </Link>
                <Link href="#" variant="primary" fontSize="heading-s">
                  Heading S
                </Link>
                <Link href="#" variant="primary" fontSize="heading-xs">
                  Heading XS
                </Link>
                <Link href="#" variant="primary" fontSize="body-m">
                  Body M
                </Link>
                <Link href="#" variant="primary" fontSize="body-s">
                  Body S
                </Link>
              </SpaceBetween>
            </SpaceBetween>
          </Container>

          <Container header={<Header variant="h2">Badges (uses borderRadiusBadge — unchanged)</Header>}>
            <SpaceBetween size="s" direction="horizontal">
              <Badge color="red">Error</Badge>
              <Badge color="green">Success</Badge>
              <Badge color="blue">Info</Badge>
              <Badge color="grey">Inactive</Badge>
              <Badge>12</Badge>
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
