// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import {
  BreadcrumbGroup,
  Container,
  Input,
  Link,
  FormField,
  SpaceBetween,
  Wizard,
  WizardProps,
  Header,
} from '~components';

import { i18nStrings } from '../wizard/common';
import styles from '../wizard/styles.scss';

import { setFunnelMetrics } from '~components/internal/analytics';
import { MockedFunnelMetrics } from './mock-funnel';
import { getAnalyticsProps } from './metadata';

setFunnelMetrics(MockedFunnelMetrics);

export default function MultiPageCreate() {
  const [mounted, setMounted] = useState(true);
  const [value, setValue] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('');
  const [value4, setValue4] = useState('');

  const [errorText, setErrorText] = useState('');
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps: WizardProps.Step[] = [
    {
      title: 'Step 1',
      errorText,
      content: (
        <SpaceBetween size="s">
          <Container
            header={<Header>Container 1 - header</Header>}
            {...getAnalyticsProps({
              instanceIdentifier: 'step1-container1',
              errorContext: value === 'error' ? 'errors.fields' : undefined,
            })}
          >
            <SpaceBetween size="s">
              <FormField
                info={
                  <Link data-testid="external-link" external={true} href="#">
                    Learn more
                  </Link>
                }
                errorText={value === 'error' ? 'Trigger error' : ''}
                label="Field 1"
                {...getAnalyticsProps({
                  instanceIdentifier: 'field1',
                  errorContext: value === 'error' ? 'errors.triggered' : undefined,
                })}
              >
                <Input
                  data-testid="field1"
                  value={value}
                  onChange={event => {
                    setValue(event.detail.value);
                  }}
                />
              </FormField>
              <FormField label="Field 2">
                <Input
                  data-testid="field2"
                  value={value2}
                  onChange={event => {
                    setValue2(event.detail.value);
                  }}
                />
              </FormField>
            </SpaceBetween>
          </Container>
          <Container
            header={<Header>Container 2 - header</Header>}
            {...getAnalyticsProps({ instanceIdentifier: 'step1-container2' })}
          >
            <SpaceBetween size="s">
              <FormField label="Field 3">
                <Input
                  data-testid="field3"
                  value={value3}
                  onChange={event => {
                    setValue3(event.detail.value);
                  }}
                />
              </FormField>
              <FormField label="Field 4">
                <Input
                  data-testid="field4"
                  value={value4}
                  onChange={event => {
                    setValue4(event.detail.value);
                  }}
                />
              </FormField>
            </SpaceBetween>
          </Container>
        </SpaceBetween>
      ),
      ...getAnalyticsProps({ instanceIdentifier: 'step-1' }),
    },
    {
      title: 'Step 2',
      isOptional: true,
      errorText,
      content: (
        <div className={styles['step-content']}>
          <div id="content-text">Content 2</div>
        </div>
      ),
      ...getAnalyticsProps({ instanceIdentifier: 'step-2' }),
    },
    {
      title: 'Step 3',
      info: <Link variant="info">Info</Link>,
      errorText: 'Simulated final step error',
      content: (
        <div className={styles['step-content']}>
          {Array.from(Array(15).keys()).map(key => (
            <div key={key} className={styles['content-item']}>
              Item {key}
            </div>
          ))}
        </div>
      ),
      ...getAnalyticsProps({ instanceIdentifier: 'step-3', errorContext: 'errors.validation' }),
    },
  ];

  return (
    <>
      <BreadcrumbGroup
        items={[
          { text: 'System', href: '#' },
          { text: 'Components', href: '#components' },
          {
            text: 'Create Resource',
            href: '#components/breadcrumb-group',
          },
        ]}
        ariaLabel="Breadcrumbs"
      />
      <button data-testid="unmount" onClick={() => setMounted(false)}>
        Unmount
      </button>
      {mounted && (
        <Wizard
          {...getAnalyticsProps({
            instanceIdentifier: 'multi-page-demo',
            flowType: 'create',
          })}
          i18nStrings={i18nStrings}
          steps={steps}
          activeStepIndex={activeStepIndex}
          onNavigate={e => {
            if (value === 'error') {
              setErrorText('There is an error');
            } else {
              setErrorText('');
              setActiveStepIndex(e.detail.requestedStepIndex);
            }
          }}
          onCancel={() => {
            setMounted(false);
          }}
          onSubmit={() => {
            setMounted(false);
          }}
        />
      )}
    </>
  );
}
