// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import React from 'react';

import HelpPanel from '@cloudscape-design/components/help-panel';

import { ExternalLinkGroup } from '../commons';

export const PRICE_CLASS_OPTIONS = [
  { label: 'Use all edge locations (best performance)', value: '0' },
  { label: 'Use only US, Canada, and Europe', value: '1' },
  { label: 'Use only US, Canada, Europe, and Asia', value: '2' },
];

export const SSL_CERTIFICATE_OPTIONS = [
  {
    label: 'Default CloudFront SSL/TLS certificate',
    value: 'default',
    description: 'Provides HTTPS or HTTP access to your content using a CloudFront domain name.',
  },
  {
    label: 'Custom SSL/TLS certificate (example.com)',
    value: 'custom',
    description: 'Grants access by using an alternate domain name, such as https://www.example.com/.',
  },
];

export const SUPPORTED_HTTP_VERSIONS_OPTIONS = [
  { label: 'HTTP 2', value: 'http2' },
  { label: 'HTTP 1', value: 'http1' },
];

/*eslint-disable react/jsx-key*/
export const TOOLS_CONTENT = [
  <HelpPanel
    header={<h2>Edit distribution</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/HowCloudFrontWorks.html',
            text: 'How CloudFront delivers content to your users',
          },
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-working-with.html',
            text: 'Working with distributions',
          },
        ]}
      />
    }
  >
    <p>You can update your CloudFront distribution by editing its settings and saving your changes.</p>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Alternate domain names (CNAMEs)</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-alternate-domain-names.html',
            text: 'Requirements for using alternate domain names (CNAMEs)',
          },
        ]}
      />
    }
  >
    <p>
      If you want to use your own domain names in the URLs for your files instead of the CloudFront domain name, enter
      the domain names in the box. These custom domain names are known as <i>alternative domain names</i> (CNAMEs). Both
      web and RTMP distributions support CNAMEs.
    </p>
    <p>
      For example, if you add <code>www.example.com</code> as your domain name, you would use the following URL to view{' '}
      <code>/images/image.jpg</code>:
    </p>
    <pre>https://www.example.com/images/image.jpg</pre>
    <h3>Before you begin</h3>
    <p>Before you add a CNAME, make sure that you do the following:</p>
    <ul>
      <li>Register the domain name with Amazon Route 53 or another domain provider.</li>
      <li>
        Add a certificate from an authorized certificate authority (CA) to CloudFront that covers the domain name that
        you plan to use with the distribution, to validate that you are authorized to use the domain.
      </li>
    </ul>
  </HelpPanel>,
  <HelpPanel
    header={<h2>SSL/TLS certificate</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cnames-and-https-requirements.html',
            text: 'Requirements for using SSL/TLS certificates with CloudFront',
          },
        ]}
      />
    }
  >
    <p>
      When CloudFront receives a request for content, it finds the domain name in the request header and responds to the
      request with the applicable SSL/TLS certificate. CloudFront and the viewer perform an SSL/TLS negotiation, and if
      the negotiation is successful CloudFront returns the requested content to the viewer.
    </p>
    <p>
      You can use the default CloudFront SSL/TLS certificate or a custom SSL/TLS certificate. The default certificate
      requires that you use the CloudFront domain name for your distribution in the URLs for your files, for example,{' '}
      <code>https://1234567890abcdef0.cloudfront.net/logo.png</code>. If you use your own domain name, such as{' '}
      <code>example.com</code>, you must choose one of these options:
    </p>
    <ul>
      <li>Use an SSL/TLS certificate provided by AWS Certificate Manager (ACM)</li>
      <li>Import a certificate from a third-party certificate authority into ACM or the IAM certificate store</li>
      <li>Create and import a self-signed certificate</li>
    </ul>
  </HelpPanel>,
  <HelpPanel
    header={<h2>Root object</h2>}
    footer={
      <ExternalLinkGroup
        items={[
          {
            href: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DefaultRootObject.html#DefaultRootObjectHowToDefine',
            text: 'Specifying a default root object',
          },
        ]}
      />
    }
  >
    <p>
      You can configure CloudFront to return a specific object (the default root object) when a user requests the root
      URL for your web distribution instead of requesting an object in your distribution. Specifying a default root
      object lets you avoid exposing the contents of your distribution or returning an error.
    </p>
  </HelpPanel>,
];
/*eslint-enable react/jsx-key*/
