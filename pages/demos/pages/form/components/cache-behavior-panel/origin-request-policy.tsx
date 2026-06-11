// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import FormField from '@cloudscape-design/components/form-field';
import Input, { InputProps } from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import RadioGroup from '@cloudscape-design/components/radio-group';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';

import {
  EXISTING_ORIGIN_REQUEST_POLICIES,
  ORIGIN_REQUEST_COOKIE_OPTIONS,
  ORIGIN_REQUEST_HEADER_OPTIONS,
  ORIGIN_REQUEST_QUERY_STRING_OPTIONS,
} from '../../form-config';
import validateField from '../../form-validation-config';
import { FormPanelProps } from '../../types';
import CacheKeyOriginSettings from './cache-key-origin-settings';

export default function OriginRequestPolicy({
  data,
  validation = false,
  errors,
  setErrors,
  setData,
  refs,
}: Omit<FormPanelProps, 'loadHelpPanelContent'>) {
  const [existingOrNewPolicy, setExistingOrNewPolicy] = useState('existing');
  const [selectedExistingOriginRequestPolicy, setSelectedExistingOriginRequestPolicy] =
    useState<SelectProps.Option | null>(null);
  const [header, setHeader] = useState<SelectProps.Option>(ORIGIN_REQUEST_HEADER_OPTIONS[0]);
  const [queryStrings, setQueryStrings] = useState<SelectProps.Option>(ORIGIN_REQUEST_QUERY_STRING_OPTIONS[0]);
  const [cookies, setCookies] = useState<SelectProps.Option>(ORIGIN_REQUEST_COOKIE_OPTIONS[0]);

  const onNameChange: InputProps['onChange'] = event => {
    const { value } = event.detail;
    setData({ originRequestPolicyName: value });

    if (validation) {
      setErrors?.({ originRequestPolicyName: '' });
    }
  };

  const onNameBlur = () => {
    if (!validation || !setErrors || existingOrNewPolicy !== 'new') {
      return;
    }

    const value = data.originRequestPolicyName;
    const { errorText } = validateField('originRequestPolicyName', value);

    setErrors({ originRequestPolicyName: errorText });
  };

  return (
    <SpaceBetween size="xs">
      <FormField
        label="Origin request policy"
        description={
          <>
            Choose an existing origin request policy or create a new one. To configure advanced settings{' '}
            <Link href="#" external={true} variant="primary" fontSize="inherit">
              create origin request policy
            </Link>
            .
          </>
        }
        stretch={true}
      >
        <RadioGroup
          items={[
            { label: 'Choose an existing policy', value: 'existing' },
            { label: 'Create a new policy', value: 'new' },
          ]}
          value={existingOrNewPolicy}
          onChange={event => {
            setExistingOrNewPolicy(event.detail.value);
            setData({ isOriginRequestPolicyNew: event.detail.value === 'new' });
          }}
          ariaRequired={true}
        />
      </FormField>

      {existingOrNewPolicy === 'existing' ? (
        <FormField
          label={
            <>
              Choose an existing origin policy - <i>optional</i>
            </>
          }
        >
          <Select
            placeholder="Select origin policy"
            selectedAriaLabel="Selected"
            options={EXISTING_ORIGIN_REQUEST_POLICIES}
            selectedOption={selectedExistingOriginRequestPolicy}
            onChange={({ detail: { selectedOption } }) => setSelectedExistingOriginRequestPolicy(selectedOption)}
          />
        </FormField>
      ) : (
        <>
          <FormField
            label="Name"
            description="Enter a name for the origin request policy."
            errorText={errors?.originRequestPolicyName}
            i18nStrings={{ errorIconAriaLabel: 'Error' }}
          >
            <Input
              ref={refs?.originRequestPolicyName}
              value={data?.originRequestPolicyName}
              ariaRequired={true}
              onChange={onNameChange}
              onBlur={onNameBlur}
            />
          </FormField>

          <CacheKeyOriginSettings
            header={header}
            queryStrings={queryStrings}
            cookies={cookies}
            setHeader={setHeader}
            setQueryStrings={setQueryStrings}
            setCookies={setCookies}
            spacing="xs"
          />
        </>
      )}
    </SpaceBetween>
  );
}
