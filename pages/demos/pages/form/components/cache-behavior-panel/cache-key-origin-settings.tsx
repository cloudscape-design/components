// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import FormField from '@cloudscape-design/components/form-field';
import Select, { SelectProps } from '@cloudscape-design/components/select';
import SpaceBetween, { SpaceBetweenProps } from '@cloudscape-design/components/space-between';

import {
  ORIGIN_REQUEST_COOKIE_OPTIONS,
  ORIGIN_REQUEST_HEADER_OPTIONS,
  ORIGIN_REQUEST_QUERY_STRING_OPTIONS,
} from '../../form-config';

interface CacheKeyOriginSettingsProps {
  header: SelectProps.Option;
  queryStrings: SelectProps.Option;
  cookies: SelectProps.Option;
  setHeader: (selectedOption: SelectProps.Option) => void;
  setQueryStrings: (selectedOption: SelectProps.Option) => void;
  setCookies: (selectedOption: SelectProps.Option) => void;
  spacing: SpaceBetweenProps.Size;
}

export default function CacheKeyOriginSettings({
  header,
  queryStrings,
  cookies,
  setHeader,
  setQueryStrings,
  setCookies,
  spacing,
}: CacheKeyOriginSettingsProps) {
  return (
    <SpaceBetween size={spacing}>
      <FormField label="Headers" description="Choose which headers to include in origin requests.">
        <Select
          selectedAriaLabel="Selected"
          options={ORIGIN_REQUEST_HEADER_OPTIONS}
          selectedOption={header}
          onChange={({ detail: { selectedOption } }) => setHeader(selectedOption)}
          ariaRequired={true}
        />
      </FormField>

      <FormField label="Query strings" description="Choose which query strings to include in origin requests.">
        <Select
          placeholder="Choose a query string option"
          selectedAriaLabel="Selected"
          options={ORIGIN_REQUEST_QUERY_STRING_OPTIONS}
          selectedOption={queryStrings}
          onChange={({ detail: { selectedOption } }) => setQueryStrings(selectedOption)}
          ariaRequired={true}
        />
      </FormField>

      <FormField label="Cookies" description="Choose which cookies to include in origin requests.">
        <Select
          placeholder="Choose a cookie"
          selectedAriaLabel="Selected"
          options={ORIGIN_REQUEST_COOKIE_OPTIONS}
          selectedOption={cookies}
          onChange={({ detail: { selectedOption } }) => setCookies(selectedOption)}
          ariaRequired={true}
        />
      </FormField>
    </SpaceBetween>
  );
}
