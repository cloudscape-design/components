// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Checkbox from '@cloudscape-design/components/checkbox';
import ExpandableSection from '@cloudscape-design/components/expandable-section';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import RadioGroup from '@cloudscape-design/components/radio-group';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Textarea from '@cloudscape-design/components/textarea';

import { InfoLink } from '../../commons';
import { SUPPORTED_HTTP_VERSIONS_OPTIONS } from '../edit-config';

export const DistributionsFooter = ({ loadHelpPanelContent }: { loadHelpPanelContent: (index: number) => void }) => {
  const [comment, setComment] = useState('');
  const [rootObject, setRootObject] = useState('');
  const [supportedHttpVersions, setSupportedHttpVersions] = useState(SUPPORTED_HTTP_VERSIONS_OPTIONS[0].value);
  const [loggingEnabled, setLoggingEnabled] = useState(false);
  const [ipv6Enabled, setIpv6Enabled] = useState(false);
  return (
    <ExpandableSection headerText="Additional settings" variant="footer">
      <SpaceBetween size="l">
        <FormField
          label="Supported HTTP versions"
          description="Choose the version of the HTTP protocol that you want CloudFront to accept for viewer requests."
          stretch={true}
        >
          <RadioGroup
            items={SUPPORTED_HTTP_VERSIONS_OPTIONS}
            value={supportedHttpVersions}
            onChange={event => setSupportedHttpVersions(event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <FormField
          label="Root object"
          info={<InfoLink id="root-info-link" onFollow={() => loadHelpPanelContent(3)} />}
          description="Type the name of the object that you want CloudFront to return when a viewer request points to your root URL."
        >
          <Input
            placeholder="index.html"
            value={rootObject}
            onChange={event => setRootObject(event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <FormField label="Logging">
          <Checkbox checked={loggingEnabled} onChange={event => setLoggingEnabled(event.detail.checked)}>
            Turn on logging
          </Checkbox>
        </FormField>
        <FormField label="IPv6">
          <Checkbox checked={ipv6Enabled} onChange={event => setIpv6Enabled(event.detail.checked)}>
            Enabled
          </Checkbox>
        </FormField>
        <FormField label="Comment">
          <Textarea value={comment} onChange={({ detail }) => setComment(detail.value)} />
        </FormField>
      </SpaceBetween>
    </ExpandableSection>
  );
};
