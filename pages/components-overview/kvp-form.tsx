// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import ColumnLayout from '~components/column-layout';
import CopyToClipboard from '~components/copy-to-clipboard';
import Form from '~components/form';
import FormField from '~components/form-field';
import Grid from '~components/grid';
import Header from '~components/header';
import Icon from '~components/icon';
import Input from '~components/input';
import KeyValuePairs from '~components/key-value-pairs';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';
import Textarea from '~components/textarea';
import Tiles from '~components/tiles';

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
                    <Link variant="info" href="#">
                      Info
                    </Link>
                  ),
                },
                { label: 'Status', value: <StatusIndicator type="success">Available</StatusIndicator> },
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
                            image: <Icon name="star" size="large" />,
                          },
                          {
                            value: 'custom',
                            label: 'Custom',
                            description: 'Configure your own policy',
                            image: <Icon name="edit" size="large" />,
                          },
                          {
                            value: 'disabled',
                            label: 'Disabled',
                            description: 'No caching applied',
                            image: <Icon name="close" size="large" />,
                          },
                        ]}
                        ariaLabel="Cache policy"
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
