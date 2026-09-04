// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import Badge from '~components/badge';
import Box from '~components/box';
import FormField from '~components/form-field';
import Input, { InputProps } from '~components/input';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';
import Token from '~components/token';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

type PageContext = React.Context<
  AppContextType<{
    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    warning?: boolean;
  }>
>;

export default function LeadingContentPage() {
  const { urlParams, setUrlParams } = useContext(AppContext as PageContext);
  const disabled = urlParams.disabled ?? false;
  const readOnly = urlParams.readOnly ?? false;
  const invalid = urlParams.invalid ?? false;
  const warning = urlParams.warning ?? false;

  const sharedProps: Partial<InputProps> = { disabled, readOnly, invalid, warning };
  const fieldProps = {
    errorText: invalid ? 'Validation error.' : undefined,
    warningText: warning && !invalid ? 'Validation warning.' : undefined,
  };

  return (
    <SimplePage
      title="Input — leadingContent"
      settings={
        <SpaceBetween direction="horizontal" size="s" alignItems="center">
          <Toggle checked={disabled} onChange={({ detail }) => setUrlParams({ disabled: detail.checked })}>
            Disabled
          </Toggle>
          <Toggle checked={readOnly} onChange={({ detail }) => setUrlParams({ readOnly: detail.checked })}>
            Read-only
          </Toggle>
          <Toggle checked={invalid} onChange={({ detail }) => setUrlParams({ invalid: detail.checked })}>
            Invalid
          </Toggle>
          <Toggle checked={warning} onChange={({ detail }) => setUrlParams({ warning: detail.checked })}>
            Warning
          </Toggle>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        {/* Single inline token */}
        <FormField label="Single token" {...fieldProps}>
          <div data-testid="with-content">
            <Input
              value=""
              onChange={() => {}}
              ariaLabel="Filter"
              {...sharedProps}
              leadingContent={
                <Token variant="inline" label="us-east-1" dismissLabel="Remove us-east-1" onDismiss={() => {}} />
              }
            />
          </div>
        </FormField>

        {/* No leadingContent — baseline */}
        <FormField label="No leadingContent" {...fieldProps}>
          <div data-testid="without-content">
            <Input
              value=""
              onChange={() => {}}
              ariaLabel="Filter"
              placeholder="leadingContent not set"
              {...sharedProps}
            />
          </div>
        </FormField>

        {/* Token + typed value */}
        <FormField label="Token with typed value" {...fieldProps}>
          <Input
            value="query"
            onChange={() => {}}
            ariaLabel="Filter"
            {...sharedProps}
            leadingContent={
              <Token variant="inline" label="us-east-1" dismissLabel="Remove us-east-1" onDismiss={() => {}} />
            }
          />
        </FormField>

        {/* leadingContent alongside prefix and suffix */}
        <FormField label="With prefix and suffix" {...fieldProps}>
          <Input
            value=""
            onChange={() => {}}
            ariaLabel="Filter"
            prefix="$"
            suffix="USD"
            {...sharedProps}
            leadingContent={
              <Token variant="inline" label="us-east-1" dismissLabel="Remove us-east-1" onDismiss={() => {}} />
            }
          />
        </FormField>

        {/* Non-token content — badge */}
        <FormField label="Non-token content (badge)" {...fieldProps}>
          <Input
            value=""
            onChange={() => {}}
            ariaLabel="Filter"
            {...sharedProps}
            leadingContent={<Badge color="blue">3</Badge>}
          />
        </FormField>

        {/* Many tokens — exercises overflow scroll */}
        <FormField label="Many tokens (overflow scroll)" {...fieldProps}>
          <div data-testid="overflow">
            <Input
              value=""
              onChange={() => {}}
              ariaLabel="Filter regions"
              {...sharedProps}
              leadingContent={
                <span style={{ display: 'flex', flexWrap: 'nowrap', gap: '4px' }}>
                  {[
                    'us-east-1',
                    'us-west-2',
                    'eu-west-1',
                    'ap-southeast-1',
                    'ap-northeast-1',
                    'sa-east-1',
                    'ca-central-1',
                    'eu-central-1',
                  ].map(r => (
                    <Token key={r} variant="inline" label={r} dismissLabel={`Remove ${r}`} onDismiss={() => {}} />
                  ))}
                </span>
              }
            />
          </div>
        </FormField>

        {/* Text-only content */}
        <FormField label="Plain text content" {...fieldProps}>
          <Input
            value=""
            onChange={() => {}}
            ariaLabel="Filter"
            {...sharedProps}
            leadingContent={<Box variant="small">Label:</Box>}
          />
        </FormField>
      </SpaceBetween>
    </SimplePage>
  );
}
