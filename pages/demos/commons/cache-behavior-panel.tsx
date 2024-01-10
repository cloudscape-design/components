// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Header from '~components/header';
import Link from '~components/link';
import Input from '~components/input';
import Box from '~components/box';
import Button from '~components/button';
import Checkbox from '~components/checkbox';
import RadioGroup from '~components/radio-group';
import Container from '~components/container';
import ColumnLayout from '~components/column-layout';
import ExpandableSection from '~components/expandable-section';
import FormField from '~components/form-field';
import SpaceBetween from '~components/space-between';
import {
  ALLOWED_HTTP_METHOD_OPTIONS,
  FORWARD_HEADER_OPTIONS,
  VIEWER_PROTOCOL_POLICY_OPTIONS,
  COOKIE_OPTIONS,
  CURRENT_COMPRESSION_OPTIONS,
  QUERY_STRING_OPTIONS,
} from './form-config';

function CacheBehaviorFooter() {
  const [lambdaType, setLambdaType] = useState('');
  const [lambdaArn, setLambdaArn] = useState('');
  const [cookies, setCookies] = useState(COOKIE_OPTIONS[0].value);
  const [queryStringSettings, setQueryStringSettings] = useState(QUERY_STRING_OPTIONS[0].value);
  const [smoothStreaming, setSmoothStreaming] = useState(false);
  const [requireSignature, setRequireSignature] = useState(false);
  const [compressionMode, setCompressionMode] = useState(CURRENT_COMPRESSION_OPTIONS[0].value);

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
            onChange={event => setCookies(event.detail.value)}
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
            onChange={event => setQueryStringSettings(event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <FormField label="Smooth Streaming">
          <Checkbox checked={smoothStreaming} onChange={event => setSmoothStreaming(event.detail.checked)}>
            Turn on Microsoft Smooth Streaming
          </Checkbox>
        </FormField>
        <FormField label="Viewer access">
          <Checkbox checked={requireSignature} onChange={event => setRequireSignature(event.detail.checked)}>
            Require signed URL or signed cookie
          </Checkbox>
        </FormField>
        <FormField label="Content compression" stretch={true}>
          <RadioGroup
            items={CURRENT_COMPRESSION_OPTIONS}
            value={compressionMode}
            onChange={event => setCompressionMode(event.detail.value)}
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
              <Input ariaRequired={true} value={lambdaType} onChange={event => setLambdaType(event.detail.value)} />
            </FormField>
            <FormField label="ARN">
              <Input ariaRequired={true} value={lambdaArn} onChange={event => setLambdaArn(event.detail.value)} />
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

export default function CacheBehaviorPanel() {
  const [minimumTtl, setMinimumTtl] = useState('0');
  const [maximumTtl, setMaximumTtl] = useState('31536000');
  const [defaultTtl, setDefaultTtl] = useState('86400');

  const [viewerProtocolPolicy, setViewerProtocolPolicy] = useState(VIEWER_PROTOCOL_POLICY_OPTIONS[0].value);
  const [allowedHttpMethods, setAllowedHttpMethods] = useState(ALLOWED_HTTP_METHOD_OPTIONS[0].value);
  const [forwardHeaders, setForwardHeaders] = useState(FORWARD_HEADER_OPTIONS[0].value);

  return (
    <Container
      id="cache-behavior-panel"
      className="custom-screenshot-hide"
      header={
        <Header variant="h2" info={<Link variant="info">info</Link>}>
          Cache behavior settings
        </Header>
      }
      footer={<CacheBehaviorFooter />}
    >
      <SpaceBetween size="l">
        <FormField label="Viewer protocol policy" stretch={true}>
          <RadioGroup
            items={VIEWER_PROTOCOL_POLICY_OPTIONS}
            value={viewerProtocolPolicy}
            onChange={event => setViewerProtocolPolicy(event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <FormField label="Allowed HTTP methods" stretch={true}>
          <RadioGroup
            items={ALLOWED_HTTP_METHOD_OPTIONS}
            value={allowedHttpMethods}
            onChange={event => setAllowedHttpMethods(event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <FormField label="Forward headers" description="Cache your objects based on header values." stretch={true}>
          <RadioGroup
            items={FORWARD_HEADER_OPTIONS}
            value={forwardHeaders}
            onChange={event => setForwardHeaders(event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <FormField label="Object caching" stretch={true} description="Cache your objects based on header values.">
          <ColumnLayout columns={4}>
            <FormField label="Minimum TTL">
              <Input
                type="number"
                value={minimumTtl}
                onChange={event => setMinimumTtl(event.detail.value)}
                ariaRequired={true}
              />
            </FormField>
            <FormField label="Maximum TTL">
              <Input
                type="number"
                value={maximumTtl}
                onChange={event => setMaximumTtl(event.detail.value)}
                ariaRequired={true}
              />
            </FormField>
            <FormField label="Default TTL">
              <Input
                type="number"
                value={defaultTtl}
                onChange={event => setDefaultTtl(event.detail.value)}
                ariaRequired={true}
              />
            </FormField>
            <div className="custom-header">
              <Button>Set to default</Button>
            </div>
          </ColumnLayout>
        </FormField>
      </SpaceBetween>
    </Container>
  );
}
