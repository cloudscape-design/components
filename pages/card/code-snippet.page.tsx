// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import CopyToClipboard from '~components/copy-to-clipboard';
import Card from '~components/internal/components/card';

import { CardPage } from './common';

export default function ButtonsScenario() {
  return (
    <CardPage title="Code snippet">
      <Card
        header="Python"
        actions={
          <CopyToClipboard
            variant="icon"
            textToCopy="def lambda_handler(event, context):
bucket = event['Records'][0]['s3']['bucket']['name']
key = event['Records'][0]['s3']['object']['key']
print(f'New file uploaded: {key} in bucket {bucket}')
return {'statusCode': 200}"
            copySuccessText="Code copied"
            copyErrorText="Error while copying text"
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
