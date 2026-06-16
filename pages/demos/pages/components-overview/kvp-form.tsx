// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import { ColumnLayout } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import CopyToClipboard from '@cloudscape-design/components/copy-to-clipboard';
import Form from '@cloudscape-design/components/form';
import FormField from '@cloudscape-design/components/form-field';
import Grid from '@cloudscape-design/components/grid';
import Header from '@cloudscape-design/components/header';
import Icon from '@cloudscape-design/components/icon';
import Input from '@cloudscape-design/components/input';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import Link from '@cloudscape-design/components/link';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Textarea from '@cloudscape-design/components/textarea';
import Tiles from '@cloudscape-design/components/tiles';

import { Section } from './utils';

export default function KvpForm() {
  const [value, setValue] = React.useState('standard');
  return (
    <Section header="Key-value pairs & Form" level="h2">
      <ColumnLayout borders="horizontal">
        <Box padding={{ bottom: 'xl' }}>
          <SpaceBetween size="l">
            <Header variant="h2">General configuration</Header>
            <KeyValuePairs
              columns={3}
              items={[
                { label: 'Distribution ID', value: 'SLCCSMWOHOFUY0' },
                {
                  label: 'Domain name',
                  value: 'd111111abcdef8.cloudfront.net',
                  info: (
                    <Link variant="info" href="#" className="secondary-link">
                      Info
                    </Link>
                  ),
                },
                {
                  label: 'Status',
                  value: <StatusIndicator type="success">Available</StatusIndicator>,
                },
                { label: 'Price class', value: 'Use only US, Canada, Europe, and Asia' },
                { label: 'CNAMEs', value: <Link href="#">example.com</Link> },
                {
                  label: 'ARN',
                  value: (
                    <CopyToClipboard
                      copyButtonAriaLabel="Copy ARN"
                      copyErrorText="ARN failed to copy"
                      copySuccessText="ARN copied"
                      textToCopy="arn:service23G24::111122223333:distribution/23E1WG1ZNPRXT0D4"
                      variant="inline"
                    />
                  ),
                },
              ]}
            />
          </SpaceBetween>
        </Box>

        <Box margin={{ top: 'xl' }}>
          <SpaceBetween size="l">
            <Form
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button variant="link">Cancel</Button>
                  <Button variant="primary">Submit</Button>
                </SpaceBetween>
              }
              header={<Header variant="h2">Create instance</Header>}
            >
              <SpaceBetween size="l">
                <Grid gridDefinition={[{ colspan: { default: 12, xxs: 8 } }, { colspan: { default: 12, xxs: 4 } }]}>
                  <SpaceBetween size="l">
                    <FormField label="Cache policy">
                      <Tiles
                        value={value}
                        onChange={e => setValue(e.detail.value)}
                        columns={4}
                        items={[
                          {
                            value: 'standard',
                            label: 'Standard',
                            description: 'Recommended for most workloads',
                            image: <Icon name="settings" size="large" />,
                          },
                          {
                            value: 'optimized',
                            label: 'Optimized',
                            description: 'Best for dynamic content',
                            image: <Icon name="mini-player" size="large" />,
                          },
                          {
                            value: 'custom',
                            label: 'Custom',
                            description: 'Configure your own policy',
                            image: <Icon name="location-pin" size="large" />,
                          },
                          {
                            value: 'disabled',
                            label: 'Disabled',
                            description: 'No caching applied',
                            image: <Icon name="globe" size="large" />,
                          },
                        ]}
                        ariaLabel="Cache policy"
                      />
                    </FormField>
                    <FormField label="Delivery method">
                      <Select
                        selectedOption={{ label: 'Web', value: 'web' }}
                        options={[
                          { label: 'Web', value: 'web' },
                          { label: 'RTMP', value: 'rtmp' },
                        ]}
                        ariaLabel="Delivery method"
                      />
                    </FormField>
                    <FormField label="Origin domain name" description="The domain name of the resource.">
                      <Input value="example-bucket.s3.amazonaws.com" ariaLabel="Origin domain name" />
                    </FormField>
                    <FormField label="Origin path" constraintText="Must begin with / and must not end with /.">
                      <Input value="/production" ariaLabel="Origin path" />
                    </FormField>
                    <FormField label="Comment">
                      <Textarea value="Production distribution" ariaLabel="Comment" />
                    </FormField>
                  </SpaceBetween>
                  <div />
                </Grid>
              </SpaceBetween>
            </Form>
          </SpaceBetween>
        </Box>
      </ColumnLayout>
    </Section>
  );
}
