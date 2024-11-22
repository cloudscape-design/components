// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button, Link } from '~components';

import logo1 from './1.png';
import logo2 from './2.png';
import logo3 from './3.png';
import logo4 from './4.png';
import logo5 from './5.png';

export function generateCarousels() {
  // generate
  return [
    {
      content: (
        <div style={{ color: 'white' }}>
          AWS Lambda Function Development
          <div>
            <Link href="#">Learn more</Link>
          </div>
          <p>Build serverless applications</p>
          <Button>Get Started</Button>
          <p>Deploy in minutes</p>
        </div>
      ),
      backgroundStyle: `url(${logo1})`,
    },
    {
      content: (
        <div style={{ color: 'white' }}>
          Amazon Aurora MySQL zero-ETL integration with Amazon Redshift Amazon S3 Storage Solutions
          <div>
            <Link href="#">Explore features</Link>
          </div>
          <p>Scalable cloud storage</p>
          <Button>Learn More</Button>
          <p>Secure and durable</p>
        </div>
      ),
      backgroundStyle: `url(${logo2})`,
    },
    {
      content: (
        <div style={{ color: 'white' }}>
          Amazon EC2 Computing
          <div>
            <Link href="#">View pricing</Link>
          </div>
          <p>Virtual servers in the cloud</p>
          <Button>Configure Now</Button>
          <p>Flexible compute capacity</p>
        </div>
      ),
      backgroundStyle: `url(${logo3})`,
    },
    {
      content: (
        <div style={{ color: 'white' }}>
          Amazon Aurora MySQL zero-ETL integration with Amazon Redshift Amazon DynamoDB
          <div>
            <Link href="#">Test link</Link>
            <Link href="#">Documentation</Link>
          </div>
          <p>Some text</p>
          <Button>This is a button</Button>
          <p>Some more text</p>
          <p>Managed NoSQL database</p>
          <Button>Try Free Tier</Button>
          <p>Millisecond latency</p>
        </div>
      ),
      backgroundStyle: `url(${logo4})`,
    },
    {
      content: (
        <div style={{ color: 'white' }}>
          Amazon Aurora MySQL zero-ETL integration with Amazon Redshift Amazon CloudFront CDN
          <div>
            <Link href="#">Test link</Link>
            <Link href="#">Features</Link>
          </div>
          <p>Some text</p>
          <Button>This is a button</Button>
          <p>Some more text</p>
          <p>Global content delivery</p>
          <Button>Set Up</Button>
          <p>Low latency access</p>
        </div>
      ),
      backgroundStyle: `url(${logo5})`,
    },
  ];
}
