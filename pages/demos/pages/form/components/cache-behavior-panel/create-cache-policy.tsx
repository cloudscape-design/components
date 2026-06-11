// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useRef } from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import Link from '@cloudscape-design/components/link';
import SpaceBetween from '@cloudscape-design/components/space-between';

import validateField from '../../form-validation-config';
import { CreateCachePolicyAttributesErrors, CreateCachePolicyAttributesValues } from '../../types';
import CacheKeyOriginSettings from './cache-key-origin-settings';

interface CreateCachePolicyProps {
  validation?: boolean;
  data: CreateCachePolicyAttributesValues;
  setData: (updateObj: Partial<CreateCachePolicyAttributesValues>) => void;
  errors: CreateCachePolicyAttributesErrors;
  setErrors: (updateObj: CreateCachePolicyAttributesErrors) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SpaceBetween size="s">
      <Header>{title}</Header>

      <SpaceBetween size="m">{children}</SpaceBetween>
    </SpaceBetween>
  );
}

export default function CreateCachePolicy({
  data,
  setData,
  errors,
  setErrors,
  onSubmit,
  onCancel,
  validation,
}: CreateCachePolicyProps) {
  const nameRef = useRef<HTMLInputElement>(null);

  const onCreate = () => {
    if (!validation) {
      return;
    }

    const { errorText } = validateField('cachePolicyName', data.name);
    if (errorText && errorText.length > 0) {
      setErrors({ nameError: errorText });
      nameRef.current?.focus();
      return;
    }

    setData({ isSubmitting: true });

    // Emulate create request
    setTimeout(() => {
      setData({ isSubmitting: false });
      onSubmit();
    }, 2000);
  };

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onCreate();
      }}
    >
      <SpaceBetween size="m">
        <Box variant="p">
          Specify how CloudFront caches responses, including cache key values and caching duration, to optimize
          performance and reduce origin load. To configure advanced settings{' '}
          <Link href="#" external={true} variant="primary">
            create cache policy
          </Link>
          .
        </Box>

        <SpaceBetween size="xl">
          <Section title="Details">
            <FormField
              label="Name"
              description="Enter a name for the cache policy."
              errorText={errors.nameError}
              i18nStrings={{ errorIconAriaLabel: 'Error' }}
            >
              <Input
                ref={nameRef}
                value={data.name}
                onChange={({ detail }) => {
                  setData({ name: detail.value });
                  setErrors({ nameError: '' });
                }}
                onBlur={() => {
                  if (validation) {
                    const { errorText } = validateField('cachePolicyName', data.name);
                    setErrors({ nameError: errorText || '' });
                  }
                }}
                ariaRequired={true}
              />
            </FormField>
            <FormField
              label={
                <>
                  Description - <i>optional</i>
                </>
              }
              description="Enter a description for the cache policy."
            >
              <Input value={data.description || ''} onChange={({ detail }) => setData({ description: detail.value })} />
            </FormField>
          </Section>

          <Section title="TTL settings">
            <FormField label="Minimum TTL" description="Minimum time to live in seconds.">
              <Input
                type="number"
                value={String(data.minimumTtl)}
                onChange={event => setData({ minimumTtl: Number(event.detail.value) })}
                ariaRequired={true}
              />
            </FormField>
            <FormField label="Maximum TTL" description="Maximum time to live in seconds.">
              <Input
                type="number"
                value={String(data.maximumTtl)}
                onChange={event => setData({ maximumTtl: Number(event.detail.value) })}
                ariaRequired={true}
              />
            </FormField>
            <FormField label="Default TTL" description="Default time to live in seconds.">
              <Input
                type="number"
                value={String(data.defaultTtl)}
                onChange={event => setData({ defaultTtl: Number(event.detail.value) })}
                ariaRequired={true}
              />
            </FormField>
          </Section>

          <Section title="Cache key settings">
            <CacheKeyOriginSettings
              header={data.header}
              queryStrings={data.queryStrings}
              cookies={data.cookies}
              setHeader={selectedOption => setData({ header: selectedOption })}
              setQueryStrings={selectedOption => setData({ queryStrings: selectedOption })}
              setCookies={selectedOption => setData({ cookies: selectedOption })}
              spacing="m"
            />
          </Section>
        </SpaceBetween>

        <Box float="right">
          <SpaceBetween size="s" direction="horizontal">
            <Button variant="link" formAction="none" onClick={onCancel} data-testid="create-cache-policy-cancel-button">
              Cancel
            </Button>

            <Button loading={data.isSubmitting} data-testid="create-cache-policy-submit-button">
              Create
            </Button>
          </SpaceBetween>
        </Box>
      </SpaceBetween>
    </form>
  );
}
