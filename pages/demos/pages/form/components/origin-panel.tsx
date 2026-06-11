// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Alert from '@cloudscape-design/components/alert';
import Container from '@cloudscape-design/components/container';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import Multiselect, { MultiselectProps } from '@cloudscape-design/components/multiselect';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { InfoLink } from '../../commons/common-components';
import useContentOrigins from '../../commons/use-content-origins';
import validateField from '../form-validation-config';
import { FormPanelProps } from '../types';
import HeadersEditor from './headers-editor';

export default function OriginPanel({
  loadHelpPanelContent,
  validation = false,
  data,
  errors,
  setData,
  setErrors,
  refs,
}: FormPanelProps) {
  const [contentOriginsState, contentOriginsHandlers] = useContentOrigins();
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps['selectedOptions']>([]);
  const [contentPath, setContentPath] = useState('');

  const validateOriginId = (value = data.originId) => {
    const { errorText } = validateField('originId', value, value);

    setErrors?.({ originId: errorText });
  };

  const onChangeOriginId = (value: string) => {
    setData({ originId: value });

    if (!validation || !errors) {
      return;
    }

    if (errors.originId?.length > 0) {
      validateOriginId(value);
    }
  };

  const onBlurOriginId = () => {
    if (!validation) {
      return;
    }

    validateOriginId(data.originId);
  };

  return (
    <Container
      id="origin-panel"
      className="custom-screenshot-hide"
      header={<Header variant="h2">Origin settings</Header>}
    >
      <SpaceBetween size="l">
        <FormField
          label={
            <>
              Content origin<i> - optional</i>
            </>
          }
          info={<InfoLink id="content-origin-info-link" onFollow={() => loadHelpPanelContent(4)} />}
          description="The Amazon S3 bucket or web server that you want CloudFront to get your web content from."
          i18nStrings={{ errorIconAriaLabel: 'Error' }}
        >
          <Multiselect
            {...contentOriginsHandlers}
            options={contentOriginsState.options.filter(option => !option.label.includes('NO-ACCESS'))}
            selectedOptions={selectedOptions}
            selectedAriaLabel="Selected"
            onChange={event => setSelectedOptions(event.detail.selectedOptions)}
            statusType={contentOriginsState.status}
            deselectAriaLabel={option => `Remove option ${option.label} from selection`}
            placeholder="Choose an S3 bucket or web server"
            loadingText="Loading origins"
            errorText="Error fetching origins."
            recoveryText="Retry"
            finishedText={
              contentOriginsState.filteringText
                ? `End of "${contentOriginsState.filteringText}" results`
                : 'End of all results'
            }
            empty={contentOriginsState.filteringText ? "We can't find a match" : 'No origins'}
            filteringType="manual"
            filteringAriaLabel="Filter origins"
            filteringClearAriaLabel="Clear"
          />
        </FormField>
        <FormField
          label={
            <>
              Path to content<i> - optional</i>
            </>
          }
          info={<InfoLink id="path-info-link" onFollow={() => loadHelpPanelContent(5)} />}
          description="The directory in your Amazon S3 bucket or your custom origin."
          i18nStrings={{ errorIconAriaLabel: 'Error' }}
        >
          <Input placeholder="/images" value={contentPath} onChange={event => setContentPath(event.detail.value)} />
        </FormField>
        <FormField
          label="Origin ID"
          info={<InfoLink id="origin-id-info-link" onFollow={() => loadHelpPanelContent(6)} />}
          description="This value lets you distinguish multiple origins in the same distribution from one another."
          constraintText="Valid characters are a-z, A-Z, 0-9, hypens (-), and periods (.)."
          errorText={errors?.originId}
          i18nStrings={{ errorIconAriaLabel: 'Error' }}
        >
          <Input
            ariaRequired={true}
            value={data.originId}
            onChange={e => onChangeOriginId(e.detail.value)}
            onBlur={onBlurOriginId}
            ref={refs?.originId}
          />
        </FormField>

        <SpaceBetween size="xs">
          <Header
            variant="h3"
            info={<InfoLink id="custom-headers-info-link" onFollow={() => loadHelpPanelContent(7)} />}
          >
            Custom headers
          </Header>
          {validation && (
            <Alert statusIconAriaLabel="Info">
              To see the warning text, add empty character (space) into the "Custom header name" field.
            </Alert>
          )}
          <HeadersEditor validation={validation} refs={refs} data={data} setData={setData} />
        </SpaceBetween>
        <Alert type="info">
          Provisioning less than 100 GiB of General Purpose (SSD) storage for high throughput workloads could result in
          higher latencies upon exhaustion of the initial General Purpose (SSD) IO credit balance.
        </Alert>
      </SpaceBetween>
    </Container>
  );
}
