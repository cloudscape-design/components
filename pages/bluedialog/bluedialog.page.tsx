// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import {
  Box,
  Button,
  DatePicker,
  ExpandableSection,
  Form,
  FormField,
  Header,
  Input,
  Select,
  SpaceBetween,
  Textarea,
} from '~components';

import styles from './styles.scss';

export default function Bluedialogbox() {
  // Inputs
  const [dateValue, setDateValue] = React.useState('');
  const [amountValue, setAmountValue] = React.useState('0');
  const [descriptionValue, setDescriptionValue] = React.useState('');
  const [selectedService, setSelectedService] = React.useState({ label: 'Cloudwatch', value: 'Cloudwatch' });

  function submitData() {
    console.log({ dateValue, amountValue, descriptionValue, selectedService });
  }
  function skipDialog() {
    console.log('skip dialog');
  }

  return (
    <div
      className={styles['blue-dialog-box']}
      role={'dialog'}
      aria-labelledby="dialog-box"
      aria-modal="true"
      tabIndex={-1}
    >
      <Form
        header={
          <div className={styles['blue-dialog-box__header']} id={'dialog-title'}>
            <Header variant="h1">Dialog header</Header>
            <Button iconName="close" variant="icon" onClick={skipDialog} aria-label="Close dialog" />
          </div>
        }
      >
        <div className={styles['blue-dialog-box__content']}>
          <SpaceBetween direction="vertical" size="l">
            <FormField label="When did the increase occur?">
              <DatePicker
                onChange={({ detail }) => setDateValue(detail.value)}
                value={dateValue}
                openCalendarAriaLabel={selectedDate =>
                  'Choose certificate expiry date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
                }
                placeholder="YYYY/MM/DD"
                ariaLabel="Select date of increase"
              />
            </FormField>
            <FormField constraintText="Enter a dollar amount in USD" label="What is the increase amount?">
              <Input
                value={amountValue}
                onChange={({ detail }) => setAmountValue(detail.value)}
                ariaLabel="Enter increase amount in USD"
              />
            </FormField>

            <ExpandableSection
              defaultExpanded={true}
              headerText={
                <Box color="text-status-inactive" fontWeight="bold" fontSize="heading-xs">
                  Provide more details to enhance troubleshooting
                </Box>
              }
              aria-expanded={true}
            >
              <SpaceBetween size={'l'}>
                <FormField label="Which service is this related to ? - optional">
                  <Select
                    selectedOption={selectedService}
                    onChange={({ detail }: any) => setSelectedService(detail.selectedOption)}
                    options={[
                      { label: 'Cloudwatch', value: 'Cloudwatch' },
                      { label: 'Dynamodb', value: 'Dynamodb' },
                      { label: 'Route 53', value: 'Route 53' },
                      { label: 'S3', value: 'S3' },
                    ]}
                    ariaLabel="Select related service"
                  />
                </FormField>
                <FormField label="Describe the issue in few words. - optional">
                  <Textarea onChange={({ detail }) => setDescriptionValue(detail.value)} value={descriptionValue} />
                </FormField>
              </SpaceBetween>
            </ExpandableSection>
          </SpaceBetween>
        </div>
        <div className={styles['blue-dialog-box__footer']}>
          <Button onClick={submitData} ariaLabel="Submit form">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
