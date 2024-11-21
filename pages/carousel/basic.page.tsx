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

      <Carousel
        ariaLabel="Test carousel"
        ariaLabelNext="Next item"
        ariaLabelPrevious="Previous item"
        variant="multiple"
        visibleItemNumber={3}
        items={[
          {
            content: (
              <div style={{ color: 'white' }}>
                Amazon Aurora MySQL zero-ETL integration with Amazon Redshift
                <div>
                  <Link href="#">Test link</Link>
                </div>
                <p>Some text</p>
                <Button>This is a button</Button>
                <p>Some more text</p>
              </div>
            ),
            backgroundStyle:
              'linear-gradient(135deg, rgb(71, 17, 118) 3%, rgb(131, 57, 157) 44%, rgb(149, 85, 182) 69%, rgb(145, 134, 215) 94%)',
          },
          {
            content: (
              <div style={{ color: 'white' }}>
                Amazon Aurora MySQL zero-ETL integration with Amazon Redshift
                <div>
                  <Link href="#">Test link</Link>
                </div>
                <p>Some text</p>
                <Button>This is a button</Button>
                <p>Some more text</p>
              </div>
            ),
            backgroundStyle:
              'linear-gradient(135deg, rgb(71, 17, 118) 3%, rgb(131, 57, 157) 44%, rgb(149, 85, 182) 69%, rgb(145, 134, 215) 94%)',
          },
          {
            content: (
              <div style={{ color: 'white' }}>
                Amazon Aurora MySQL zero-ETL integration with Amazon Redshift
                <div>
                  <Link href="#">Test link</Link>
                </div>
                <p>Some text</p>
                <Button>This is a button</Button>
                <p>Some more text</p>
              </div>
            ),
            backgroundStyle:
              'linear-gradient(135deg, rgb(71, 17, 118) 3%, rgb(131, 57, 157) 44%, rgb(149, 85, 182) 69%, rgb(145, 134, 215) 94%)',
          },
          {
            content: (
              <div style={{ color: 'white' }}>
                Amazon Aurora MySQL zero-ETL integration with Amazon Redshift
                <div>
                  <Link href="#">Test link</Link>
                </div>
                <p>Some text</p>
                <Button>This is a button</Button>
                <p>Some more text</p>
              </div>
            ),
            backgroundStyle:
              'linear-gradient(135deg, rgb(71, 17, 118) 3%, rgb(131, 57, 157) 44%, rgb(149, 85, 182) 69%, rgb(145, 134, 215) 94%)',
          },
          {
            content: (
              <div style={{ color: 'white' }}>
                Amazon Aurora MySQL zero-ETL integration with Amazon Redshift
                <div>
                  <Link href="#">Test link</Link>
                </div>
                <p>Some text</p>
                <Button>This is a button</Button>
                <p>Some more text</p>
              </div>
            ),
            backgroundStyle:
              'linear-gradient(135deg, rgb(71, 17, 118) 3%, rgb(131, 57, 157) 44%, rgb(149, 85, 182) 69%, rgb(145, 134, 215) 94%)',
          },
          {
            content: <div>3. Amazon Aurora MySQL zero-ETL integration with Amazon Redshift</div>,
          },
          {
            content: <div>3. Amazon Aurora MySQL zero-ETL integration with Amazon Redshift</div>,
          },
        ]}
      />
    </>
  );
}
