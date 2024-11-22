// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Carousel from '~components/carousel/index';
import Link from '~components/link';

export default function () {
  return (
    <>
      <h1>Basic Carousel</h1>
      <div
        style={{
          padding: 20,
        }}
      >
        <Carousel
          size="medium"
          ariaLabel="Test carousel"
          ariaLabelNext="Next item"
          ariaLabelPrevious="Previous item"
          variant="single"
          visibleItemNumber={3}
          items={[
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
              backgroundStyle:
                'linear-gradient(135deg, rgb(0, 76, 153) 0%, rgb(0, 119, 204) 50%, rgb(51, 153, 255) 100%)',
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
              backgroundStyle:
                'linear-gradient(135deg, rgb(153, 51, 0) 0%, rgb(204, 85, 0) 50%, rgb(255, 128, 0) 100%)',
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
              backgroundStyle:
                'linear-gradient(135deg, rgb(0, 102, 51) 0%, rgb(0, 153, 76) 50%, rgb(51, 204, 102) 100%)',
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
              backgroundStyle:
                'linear-gradient(135deg, rgb(102, 0, 102) 0%, rgb(153, 51, 153) 50%, rgb(204, 102, 204) 100%)',
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
              backgroundStyle:
                'linear-gradient(135deg, rgb(51, 51, 51) 0%, rgb(102, 102, 102) 50%, rgb(153, 153, 153) 100%)',
            },
            {
              content: <div>3. Amazon Aurora MySQL zero-ETL integration with Amazon Redshift</div>,
              backgroundStyle:
                'linear-gradient(135deg, rgb(0, 51, 102) 0%, rgb(0, 102, 153) 50%, rgb(51, 153, 204) 100%)',
            },
            {
              content: <div>3. Amazon Aurora MySQL zero-ETL integration with Amazon Redshift</div>,
              backgroundStyle:
                'linear-gradient(135deg, rgb(102, 51, 0) 0%, rgb(153, 102, 0) 50%, rgb(204, 153, 0) 100%)',
            },
          ]}
        />
      </div>
    </>
  );
}
