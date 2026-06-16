// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React, { useState } from 'react';

import Button from '@cloudscape-design/components/button';
import Container from '@cloudscape-design/components/container';
import FormField from '@cloudscape-design/components/form-field';
import Header from '@cloudscape-design/components/header';
import RadioGroup from '@cloudscape-design/components/radio-group';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Textarea from '@cloudscape-design/components/textarea';

import { InfoLink } from '../../commons';
import { PRICE_CLASS_OPTIONS, SSL_CERTIFICATE_OPTIONS } from '../edit-config';
import { DistributionsFooter } from './distribution-footer';

export const Content = ({ loadHelpPanelContent }: { loadHelpPanelContent: (value: number) => void }) => {
  const [cNames, setCnames] = useState('');
  const [priceClass, setPriceClass] = useState(PRICE_CLASS_OPTIONS[0].value);
  const [tlsCertificate, setTlsCertificate] = useState(SSL_CERTIFICATE_OPTIONS[0].value);
  return (
    <Container
      header={<Header variant="h2">Distribution settings</Header>}
      footer={<DistributionsFooter loadHelpPanelContent={index => loadHelpPanelContent(index)} />}
    >
      <SpaceBetween size="l">
        <FormField label="Price class" stretch={true}>
          <RadioGroup
            items={PRICE_CLASS_OPTIONS}
            value={priceClass}
            onChange={event => setPriceClass(event.detail.value)}
          />
        </FormField>
        <FormField
          label={
            <>
              Alternative domain names (CNAMEs)<i> - optional</i>
            </>
          }
          info={<InfoLink id="cname-info-link" onFollow={() => loadHelpPanelContent(1)} />}
          description="You must list any custom domain names that you use in addition to the CloudFront domain name for the URLs for your files."
          constraintText="Specify up to 100 CNAMEs separated with commas or put each on a new line."
          stretch={true}
        >
          <Textarea
            placeholder="www.one.example.com,www.two.example.com"
            value={cNames}
            onChange={({ detail }) => setCnames(detail.value)}
          />
        </FormField>
        <FormField
          label="SSL/TLS certificate"
          info={<InfoLink id="ssl-info-link" onFollow={() => loadHelpPanelContent(2)} />}
          stretch={true}
        >
          <RadioGroup
            items={SSL_CERTIFICATE_OPTIONS}
            value={tlsCertificate}
            onChange={event => setTlsCertificate(event.detail.value)}
            ariaRequired={true}
          />
        </FormField>
        <Button>Request or import a certificate with AWS Certificate Manager (ACM)</Button>
      </SpaceBetween>
    </Container>
  );
};
