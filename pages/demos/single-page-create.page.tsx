// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ContentLayout from '~components/content-layout';
import Link from '~components/link';
import Input from '~components/input';
import Textarea from '~components/textarea';
import Tiles from '~components/tiles';
import Select from '~components/select';
import RadioGroup from '~components/radio-group';
import TimeInput from '~components/time-input';
import DatePicker from '~components/date-picker';
import Multiselect, { MultiselectProps } from '~components/multiselect';
import TagEditor, { TagEditorProps } from '~components/tag-editor';
import Button from '~components/button';
import Container from '~components/container';
import Form from '~components/form';
import FormField from '~components/form-field';
import SpaceBetween from '~components/space-between';
import { Navigation, Tools, Breadcrumbs } from '../app-layout/utils/content-blocks';
import * as toolsContent from '../app-layout/utils/tools-content';
import labels from '../app-layout/utils/labels';
import CacheBehaviorPanel from './cache-behavior-panel';
import { SSL_CERTIFICATE_OPTIONS } from './form-config';

const tagEditorI18nStrings: TagEditorProps.I18nStrings = {
  tagLimit: (availableTags: number) => `You can add up to ${availableTags} more tag${availableTags > 1 ? 's' : ''}.`,
  addButton: 'Add tag',
  removeButton: 'Remove',
  keyHeader: 'Key',
  valueHeader: 'Value',
};

function BaseFormContent({ content }: { content: React.ReactNode }) {
  return (
    <form onSubmit={event => event.preventDefault()}>
      <Form
        actions={
          <SpaceBetween direction="horizontal" size="xs">
            <Button variant="link" onClick={() => {}}>
              Cancel
            </Button>
            <Button data-testid="create" variant="primary">
              Create distribution
            </Button>
          </SpaceBetween>
        }
        errorIconAriaLabel="Error"
      >
        {content}
      </Form>
    </form>
  );
}

function ContentDeliveryPanel() {
  const [deliveryMethod, setDeliveryMethod] = useState('web');

  return (
    <Container className="custom-screenshot-hide" header={<Header variant="h2">Distribution content delivery</Header>}>
      <FormField label="Delivery method" info={<Link variant="info">info</Link>} stretch={true}>
        <Tiles
          items={[
            {
              value: 'web',
              label: 'Web',
              description: 'Deliver all types of content (including streaming). This is the most common choice.',
            },
            {
              value: 'rtmp',
              label: 'RTMP',
              description:
                'Deliver streaming content using Adobe Media Server and the Adobe Real-Time Messaging Protocol (RTMP).',
            },
          ]}
          value={deliveryMethod}
          onChange={e => setDeliveryMethod(e.detail.value)}
        />
      </FormField>
    </Container>
  );
}

function TagsPanel() {
  const [tags] = useState([
    {
      key: 'some-custom-key-1',
      value: 'some-value-1',
      existing: false,
    },
  ]);

  return (
    <Container
      header={
        <Header
          variant="h2"
          info={<Link variant="info">info</Link>}
          description="A tag is a label that you assign to an AWS resource. Each tag consists of a key and an optional value. You can use tags to search and filter your resources or track your AWS costs."
        >
          Tags
        </Header>
      }
    >
      <TagEditor tags={tags} onChange={() => {}} i18nStrings={tagEditorI18nStrings} />
    </Container>
  );
}

function OriginPanel() {
  const [selectedOptions, setSelectedOptions] = useState<MultiselectProps['selectedOptions']>([]);

  const [contentPath, setContentPath] = useState('');
  const [originId, setOriginId] = useState('');

  return (
    <Container
      id="origin-panel"
      className="custom-screenshot-hide"
      header={<Header variant="h2">Origin settings</Header>}
    >
      <SpaceBetween size="l">
        <FormField
          label="Content origin"
          info={<Link variant="info">info</Link>}
          description="The Amazon S3 bucket or web server that you want CloudFront to get your web content from."
          i18nStrings={{ errorIconAriaLabel: 'Error' }}
        >
          <Multiselect
            options={[
              {
                label: 'Option 1',
                value: '1',
              },
              {
                label: 'Option 2',
                value: '2',
              },
              {
                label: 'Option 3 (disabled)',
                value: '3',
                disabled: true,
              },
            ]}
            selectedOptions={selectedOptions}
            selectedAriaLabel="Selected"
            onChange={event => setSelectedOptions(event.detail.selectedOptions)}
            deselectAriaLabel={option => `Remove option ${option.label} from selection`}
            placeholder="Choose an S3 bucket or web server"
            loadingText="Loading origins"
            errorText="Error fetching origins."
            recoveryText="Retry"
            empty={'No origins'}
            filteringType="auto"
            filteringAriaLabel="Filter origins"
            filteringClearAriaLabel="Clear"
            ariaRequired={true}
          />
        </FormField>
        <FormField
          label="Path to content"
          info={<Link variant="info">info</Link>}
          description="The directory in your Amazon S3 bucket or your custom origin."
          i18nStrings={{ errorIconAriaLabel: 'Error' }}
        >
          <Input
            placeholder="/images"
            ariaRequired={true}
            value={contentPath}
            onChange={event => setContentPath(event.detail.value)}
          />
        </FormField>
        <FormField
          label="Origin ID"
          info={<Link variant="info">info</Link>}
          description="This value lets you distinguish multiple origins in the same distribution from one another."
          i18nStrings={{ errorIconAriaLabel: 'Error' }}
        >
          <Input ariaRequired={true} value={originId} onChange={event => setOriginId(event.detail.value)} />
        </FormField>
        <div>
          <Header variant="h3" info={<Link variant="info">info</Link>}>
            Custom headers
          </Header>
        </div>
      </SpaceBetween>
    </Container>
  );
}

function DistributionPanel() {
  const [sslCertificate, setSslCertificate] = useState(SSL_CERTIFICATE_OPTIONS[0].value);
  const [cloudFrontRootObject, setCloudFrontRootObject] = useState('');
  const [alternativeDomainNames, setAlternativeDomainNames] = useState('');
  const [certificateExpiryDate, setCertificateExpiryDate] = useState('');
  const [certificateExpiryTime, setCertificateExpiryTime] = useState('');
  return (
    <Container header={<Header variant="h2">Distribution settings</Header>}>
      <SpaceBetween size="l">
        <FormField label="SSL/TLS certificate" info={<Link variant="info">info</Link>} stretch={true}>
          <RadioGroup
            items={SSL_CERTIFICATE_OPTIONS}
            value={sslCertificate}
            ariaRequired={true}
            onChange={({ detail: { value } }) => setSslCertificate(value)}
          />
        </FormField>
        <FormField
          label="Root object"
          info={<Link variant="info">info</Link>}
          description="Enter the name of the object that you want CloudFront to return when a viewer request points to your root URL."
          i18nStrings={{ errorIconAriaLabel: 'Error' }}
        >
          <Input
            value={cloudFrontRootObject}
            ariaRequired={true}
            placeholder="index.html"
            onChange={({ detail: { value } }) => setCloudFrontRootObject(value)}
          />
        </FormField>
        <FormField
          label={
            <>
              Alternative domain names (CNAMEs)<i> - optional</i>
            </>
          }
          info={<Link variant="info">info</Link>}
          description="List any custom domain names that you use in addition to the CloudFront domain name for the URLs for your files."
          constraintText="Specify up to 100 CNAMEs separated with commas, or put each on a new line."
          stretch={true}
          i18nStrings={{ errorIconAriaLabel: 'Error' }}
        >
          <Textarea
            placeholder={'www.one.example.com\nwww.two.example.com'}
            value={alternativeDomainNames}
            onChange={({ detail: { value } }) => setAlternativeDomainNames(value)}
          />
        </FormField>
        <FormField
          label="S3 bucket for logs"
          description="The Amazon S3 bucket that you want CloudFront to store your access logs in."
          i18nStrings={{ errorIconAriaLabel: 'Error' }}
        >
          <Select
            options={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
              { label: 'Option 3', value: '3' },
              { label: 'Option 4', value: '4' },
              { label: 'Option 5', value: '5' },
            ]}
            selectedAriaLabel="Selected"
            placeholder="Choose an S3 bucket"
            loadingText="Loading buckets"
            errorText="Error fetching buckets."
            recoveryText="Retry"
            filteringType="auto"
            filteringAriaLabel="Filter buckets"
            filteringClearAriaLabel="Clear"
            ariaRequired={true}
            selectedOption={{}}
            onChange={() => {}}
          />
        </FormField>

        <FormField stretch={true} label={<span id="certificate-expiry-label">Certificate expiry</span>}>
          <SpaceBetween size="s" direction="horizontal">
            <FormField
              stretch={true}
              description="Specify the date when the certificate should expire."
              className="date-time-container"
              constraintText={'Use YYYY/MM/DD format.'}
              i18nStrings={{ errorIconAriaLabel: 'Error' }}
            >
              <DatePicker
                ariaLabelledby="certificate-expiry-label"
                placeholder="YYYY/MM/DD"
                previousMonthAriaLabel="Previous month"
                nextMonthAriaLabel="Next month"
                todayAriaLabel="Today"
                value={certificateExpiryDate}
                onChange={({ detail: { value } }) => setCertificateExpiryDate(value)}
                openCalendarAriaLabel={selectedDate =>
                  'Choose certificate expiry date' + (selectedDate ? `, selected date is ${selectedDate}` : '')
                }
              />
            </FormField>
            <FormField
              stretch={true}
              description="Specify the time when the certificate should expire"
              constraintText="Use 24-hour format."
              i18nStrings={{ errorIconAriaLabel: 'Error' }}
            >
              <TimeInput
                ariaLabelledby="certificate-expiry-label"
                use24Hour={true}
                placeholder="hh:mm:ss"
                value={certificateExpiryTime}
                onChange={({ detail: { value } }) => setCertificateExpiryTime(value)}
              />
            </FormField>
          </SpaceBetween>
        </FormField>
      </SpaceBetween>
    </Container>
  );
}

export function FormContent() {
  return (
    <BaseFormContent
      content={
        <SpaceBetween size="l">
          <ContentDeliveryPanel />
          <DistributionPanel />
          <OriginPanel />
          <CacheBehaviorPanel />
          <TagsPanel />
        </SpaceBetween>
      }
    />
  );
}

export default function () {
  return (
    <AppLayout
      ariaLabels={labels}
      contentType="form"
      breadcrumbs={<Breadcrumbs />}
      navigation={<Navigation />}
      tools={<Tools>{toolsContent.long}</Tools>}
      content={
        <ContentLayout
          header={
            <Header
              variant="h1"
              info={<Link variant="info">info</Link>}
              description="When you create an Amazon CloudFront distribution, you tell CloudFront where to find your content by specifying your origin servers."
            >
              Create distribution
            </Header>
          }
        >
          <FormContent />
        </ContentLayout>
      }
    />
  );
}
