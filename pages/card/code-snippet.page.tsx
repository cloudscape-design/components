// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import ButtonGroup from '~components/button-group';
import Card from '~components/internal/components/card';

import { CardPage } from './common';

export default function CardScenario() {
  return (
    <CardPage title="Code snippet">
      <Card
        header="Python"
        actions={
          <ButtonGroup
            variant="icon"
            items={[
              { type: 'icon-button', id: 'download', iconName: 'download', text: 'Download code' },
              { type: 'icon-button', id: 'copy', iconName: 'copy', text: 'Copy code' },
            ]}
          />
        }
      >
        <Box variant="code">
          <pre style={{ backgroundColor: 'light-dark(#f8f8f8, #ffffff1a)', borderRadius: 8, margin: 0, padding: 8 }}>
            {`def lambda_handler(event, context):
  bucket = event['Records'][0]['s3']['bucket']['name']
  key = event['Records'][0]['s3']['object']['key']
  print(f'New file uploaded: {key} in bucket {bucket}')
  return {'statusCode': 200}`}
          </pre>
        </Box>
      </Card>
    </CardPage>
  );
}
