// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useEffect, useState } from 'react';

import Button from '@cloudscape-design/components/button';
import CodeEditor, { CodeEditorProps } from '@cloudscape-design/components/code-editor';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Container from '@cloudscape-design/components/container';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import Input from '@cloudscape-design/components/input';
import RadioGroup from '@cloudscape-design/components/radio-group';
import Select from '@cloudscape-design/components/select';
import SpaceBetween from '@cloudscape-design/components/space-between';

import { InfoLink } from '../../../commons/common-components';
import {
  ALLOWED_HTTP_METHOD_OPTIONS,
  CODE_EDITOR_THEMES,
  FORWARD_HEADER_OPTIONS,
  VIEWER_PROTOCOL_POLICY_OPTIONS,
} from '../../form-config';
import { CachePolicyProps, FormPanelProps } from '../../types';
import CacheBehaviorFooter from './cache-behavior-footer';
import OriginRequestPolicy from './origin-request-policy';

type AceBuildsModule = typeof import('ace-builds');

interface CacheBehaviorPanelProps extends FormPanelProps {
  cachePolicyProps: CachePolicyProps;
}

const defaultState = { minimumTtl: 0, maximumTtl: 31536000, defaultTtl: 86400 };

export default function CacheBehaviorPanel({
  data,
  loadHelpPanelContent,
  validation = false,
  errors,
  setErrors,
  setData,
  refs,
  cachePolicyProps,
}: CacheBehaviorPanelProps) {
  const [minimumTtl, setMinimumTtl] = useState(defaultState.minimumTtl);
  const [maximumTtl, setMaximumTtl] = useState(defaultState.maximumTtl);
  const [defaultTtl, setDefaultTtl] = useState(defaultState.defaultTtl);

  const [viewerProtocolPolicy, setViewerProtocolPolicy] = useState(VIEWER_PROTOCOL_POLICY_OPTIONS[0].value);
  const [allowedHttpMethods, setAllowedHttpMethods] = useState(ALLOWED_HTTP_METHOD_OPTIONS[0].value);
  const [forwardHeaders, setForwardHeaders] = useState(FORWARD_HEADER_OPTIONS[0].value);
  const [ace, setAce] = useState<AceBuildsModule>();
  const [codeEditorLoading, setCodeEditorLoading] = useState(true);
  const [codeEditorValue, setCodeEditorValue] = useState('');
  const [codeEditorPreferences, setCodeEditorPreferences] = useState<CodeEditorProps.Preferences | null>(null);

  useEffect(() => {
    setCodeEditorLoading(true);
    import('ace-builds').then(ace => {
      ace.config.set('basePath', './libs/ace/');
      setAce(ace);
      setCodeEditorLoading(false);
    });
  }, []);

  const onCodeEditorChange: CodeEditorProps['onChange'] = event => {
    const { value } = event.detail;
    setCodeEditorValue(value);

    if (validation) {
      setData?.({ codeEditor: value });
      setErrors?.({ codeEditor: '' });
    }
  };

  const onCodeEditorPreferencesChange: CodeEditorProps['onPreferencesChange'] = event => {
    setCodeEditorPreferences(event.detail);
  };

  const onSetToDefault = () => {
    setMinimumTtl(defaultState.minimumTtl);
    setMaximumTtl(defaultState.maximumTtl);
    setDefaultTtl(defaultState.defaultTtl);
  };

  return (
    <Container
      id="cache-behavior-panel"
      className="custom-screenshot-hide"
      header={
        <Header variant="h2" info={<InfoLink onFollow={() => loadHelpPanelContent(8)} />}>
          Cache behavior settings
        </Header>
      }
      footer={<CacheBehaviorFooter />}
    >
      <SpaceBetween size="l">
        <OriginRequestPolicy
          refs={refs}
          data={data}
          errors={errors}
          setData={setData}
          setErrors={setErrors}
          validation={validation}
        />

        <FormField
          label="Cache policy"
          description="The Amazon S3 bucket or web server that you want CloudFront to get your web content from."
          errorText={!cachePolicyProps.selectedPolicy && errors?.cachePolicy}
          secondaryControl={
            <SpaceBetween direction="horizontal" size="m">
              <Button formAction="none" iconName="refresh" ariaLabel="Refresh cache policies" />

              <Button
                ref={cachePolicyProps.buttonRef}
                formAction="none"
                data-testid="create-cache-policy-button"
                onClick={() => cachePolicyProps.toggleSplitPanel(true)}
              >
                Create cache policy
              </Button>
            </SpaceBetween>
          }
        >
          <Select
            ref={refs?.cachePolicy}
            placeholder="Choose a cache policy"
            options={cachePolicyProps.policies}
            selectedAriaLabel="Selected"
            ariaRequired={true}
            selectedOption={cachePolicyProps.selectedPolicy}
            onChange={({ detail: { selectedOption } }) => {
              cachePolicyProps.setSelectedPolicy(selectedOption);
              setErrors?.({ cachePolicy: '' });
            }}
            data-testid="cache-policy-select"
          />
        </FormField>

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
                value={String(minimumTtl)}
                onChange={event => setMinimumTtl(Number(event.detail.value))}
                ariaRequired={true}
              />
            </FormField>
            <FormField label="Maximum TTL">
              <Input
                type="number"
                value={String(maximumTtl)}
                onChange={event => setMaximumTtl(Number(event.detail.value))}
                ariaRequired={true}
              />
            </FormField>
            <FormField label="Default TTL">
              <Input
                type="number"
                value={String(defaultTtl)}
                onChange={event => setDefaultTtl(Number(event.detail.value))}
                ariaRequired={true}
              />
            </FormField>
            <div className="custom-header">
              <Button formAction="none" onClick={onSetToDefault}>
                Set to default
              </Button>
            </div>
          </ColumnLayout>
        </FormField>
        <FormField
          label="Create policy"
          description="Create a policy for your cache behavior settings."
          stretch={true}
          errorText={errors?.codeEditor}
        >
          <CodeEditor
            ace={ace}
            value={codeEditorValue}
            language="json"
            onChange={onCodeEditorChange}
            preferences={codeEditorPreferences!}
            onPreferencesChange={onCodeEditorPreferencesChange}
            loading={codeEditorLoading}
            themes={CODE_EDITOR_THEMES}
            ref={refs?.codeEditor}
          />
        </FormField>
      </SpaceBetween>
    </Container>
  );
}
