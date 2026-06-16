// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import Checkbox from '@cloudscape-design/components/checkbox';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import RadioGroup from '@cloudscape-design/components/radio-group';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { COOKIE_OPTIONS, CURRENT_COMPRESSION_OPTIONS, QUERY_STRING_OPTIONS } from '../../form-config';

export default function CacheBehaviorFooter() {
  const [lambdaType, setLambdaType] = useState('');
  const [lambdaArn, setLambdaArn] = useState('');
  const [cookies, setCookies] = useState(COOKIE_OPTIONS[0].value);
  const [queryStringSettings, setQueryStringSettings] = useState(QUERY_STRING_OPTIONS[0].value);
  const [smoothStreaming, setSmoothStreaming] = useState(false);
  const [requireSignature, setRequireSignature] = useState(false);
  const [compressionMode, setCompressionMode] = useState(CURRENT_COMPRESSION_OPTIONS[0].value);

  function changeHandler<T>(callBackFn: React.Dispatch<React.SetStateAction<T>>, value: T) {
    callBackFn(value);
  }

  return (
    <ExpandableSection headerText="Additional settings" variant="footer">
      <SpaceBetween size="l">
        <div>
          <Box variant="awsui-key-label">Path pattern</Box>
          <div>Default (*)</div>
        </div>
        <FormField
          label="Cookies"
          description="Include all user cookies in the request URLs that it forwards to your origin."
          stretch={true}
        >
          <RadioGroup
            items={COOKIE_OPTIONS}
            value={cookies}
            onChange={event => changeHandler<string>(setCookies, event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <FormField
          label="Query string forwarding and caching"
          description="Query string parameters you want CloudFront to forward to the origin."
          stretch={true}
        >
          <RadioGroup
            items={QUERY_STRING_OPTIONS}
            value={queryStringSettings}
            onChange={event => changeHandler<string>(setQueryStringSettings, event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <FormField label="Smooth Streaming">
          <Checkbox
            checked={smoothStreaming}
            onChange={event => changeHandler<boolean>(setSmoothStreaming, event.detail.checked)}
          >
            Turn on Microsoft Smooth Streaming
          </Checkbox>
        </FormField>
        <FormField label="Viewer access">
          <Checkbox
            checked={requireSignature}
            onChange={event => changeHandler<boolean>(setRequireSignature, event.detail.checked)}
          >
            Require signed URL or signed cookie
          </Checkbox>
        </FormField>
        <FormField label="Content compression" stretch={true}>
          <RadioGroup
            items={CURRENT_COMPRESSION_OPTIONS}
            value={compressionMode}
            onChange={event => changeHandler<string>(setCompressionMode, event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <FormField
          label={<Box variant="h3">Lambda functions</Box>}
          description="These functions run in response to CloudFront events."
          stretch={true}
        >
          <ColumnLayout columns={3}>
            <FormField label="Type">
              <Input
                ariaRequired={true}
                value={lambdaType}
                onChange={event => changeHandler<string>(setLambdaType, event.detail.value)}
              />
            </FormField>
            <FormField label="ARN">
              <Input
                ariaRequired={true}
                value={lambdaArn}
                onChange={event => changeHandler<string>(setLambdaArn, event.detail.value)}
              />
            </FormField>
            <div className="custom-header">
              <Button>Add lambda function</Button>
            </div>
          </ColumnLayout>
        </FormField>
      </SpaceBetween>
    </ExpandableSection>
  );
}
